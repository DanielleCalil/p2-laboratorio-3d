import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import { ErroApi } from "./erroApi";

const derivarChave = promisify(scrypt);

const segredoToken = () => {
  const segredo = process.env.JWT_SECRET;
  if (!segredo) {
    throw new Error("Configure JWT_SECRET no .env.");
  }
  return segredo;
};

const hash = async (senha: string) => {
  const salt = randomBytes(16).toString("hex");
  const chave = (await derivarChave(senha, salt, 64)) as Buffer;
  return `scrypt:${salt}:${chave.toString("hex")}`;
};

const verificarSenha = async (senha: string, senhaSalva: string) => {
  const [algoritmo, salt, chave, extra] = senhaSalva.split(":");
  if (
    algoritmo !== "scrypt" ||
    extra !== undefined ||
    !/^[a-f0-9]{32}$/.test(salt) ||
    !/^[a-f0-9]{128}$/.test(chave)
  ) {
    return false;
  }

  const chaveInformada = (await derivarChave(senha, salt, 64)) as Buffer;
  return timingSafeEqual(chaveInformada, Buffer.from(chave, "hex"));
};

const gerarToken = (idUsuario: number) => {
  return jwt.sign({ idUsuario }, segredoToken(), {
    algorithm: "HS256",
    expiresIn: "8h",
  });
};

const validaToken = (req: Request, _res: Response, next: NextFunction) => {
  const token = req.headers["x-access-token"];
  if (typeof token !== "string" || !token.trim()) {
    return next(
      new ErroApi(401, "Informe o token no cabeçalho x-access-token."),
    );
  }

  const segredo = segredoToken();
  try {
    const dados = jwt.verify(token, segredo, { algorithms: ["HS256"] });
    if (
      typeof dados === "string" ||
      !Number.isInteger(dados.idUsuario) ||
      dados.idUsuario <= 0
    ) {
      return next(new ErroApi(401, "Token inválido ou expirado."));
    }
  } catch {
    return next(new ErroApi(401, "Token inválido ou expirado."));
  }

  next();
};

export { hash, verificarSenha, gerarToken, validaToken };
