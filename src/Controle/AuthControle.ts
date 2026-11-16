import type { Request, Response } from "express";
import { loginServico } from "../Servico/AuthServico";
import { responderErro } from "../Utils/erroApi";

const loginControle = async (req: Request, res: Response) => {
  const { usuario, senha } = req.body ?? {};
  try {
    const dadosLogin = await loginServico(usuario, senha);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Login realizado com sucesso.",
      idUsuario: dadosLogin.idUsuario,
      token: dadosLogin.token,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao realizar login.");
  }
};

export { loginControle };
