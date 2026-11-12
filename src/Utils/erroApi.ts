import type { Response } from "express";
import { Prisma } from "../../generated/prisma/client";

class ErroApi extends Error {
    constructor(public status: number, mensagem: string) {
        super(mensagem);
    }
}

const responderErro = (erro: unknown, res: Response, mensagem: string) => {
    if (erro instanceof ErroApi) {
        return res.status(erro.status).json({ sucesso: false, mensagem: erro.message });
    }
    if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === "P2025") {
            return res.status(404).json({ sucesso: false, mensagem: "Registro não encontrado." });
        }
        if (erro.code === "P2002" || erro.code === "P2003") {
            return res.status(409).json({ sucesso: false, mensagem: "A operação entra em conflito com um registro existente." });
        }
    }
    console.error(erro);
    return res.status(500).json({ sucesso: false, mensagem });
}

export { ErroApi, responderErro };
