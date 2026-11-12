import { prisma } from "../prisma";

const buscarUsuarioPorEmailRepositorio = async (email: string) => {
    const usuario = await prisma.usuario.findUnique({
        where: { email },
        select: { id: true, senha: true }
    });
    return usuario;
}

export {
    buscarUsuarioPorEmailRepositorio
}
