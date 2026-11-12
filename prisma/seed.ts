import "dotenv/config";
import { prisma } from "../src/prisma";
import { hashSenha } from "../src/Utils/criptografia";

const criarUsuario = async () => {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const senha = process.env.ADMIN_SENHA;
    if (!email || !senha || senha.length < 8) {
        throw new Error("Configure ADMIN_EMAIL e ADMIN_SENHA (mínimo de 8 caracteres) no .env.");
    }

    await prisma.usuario.upsert({
        where: { email },
        update: {},
        create: { nome: "Equipe do laboratório", email, senha: await hashSenha(senha) }
    });
    console.log("Usuário inicial disponível para login.");
}

criarUsuario()
    .catch((erro) => {
        console.error(erro.message);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
