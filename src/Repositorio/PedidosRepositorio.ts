import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../prisma";

type DadosPedido = Pick<Prisma.PedidoUncheckedCreateInput,
    "solicitante" | "descricao" | "larguraMm" | "profundidadeMm" | "alturaMm" |
    "materialId" | "consumoGramas">;

const buscaTodosPedidosRepositorio = async () => {
    const pedidos = await prisma.pedido.findMany({
        orderBy: { id: "asc" }
    });
    return pedidos;
};

const buscarPedidoPorIdRepositorio = async (id: number, conexao: Prisma.TransactionClient = prisma) => {
    const pedido = await conexao.pedido.findUnique({
        where: { id },
        include: { material: true, impressora: true }
    });
    return pedido;
};

const adicionarPedidoRepositorio = async (dados: DadosPedido) => {
    const pedido = await prisma.pedido.create({ data: dados });
    return pedido;
};

const editarPedidoRepositorio = async (id: number, dados: Partial<DadosPedido>) => {
    const pedido = await prisma.pedido.update({
        where: { id, status: "PENDENTE" },
        data: dados
    });
    return pedido;
};

const buscarMaterialPorIdRepositorio = async (id: number) => {
    const material = await prisma.material.findUnique({ where: { id } });
    return material;
};

export {
    buscaTodosPedidosRepositorio,
    buscarPedidoPorIdRepositorio,
    adicionarPedidoRepositorio,
    editarPedidoRepositorio,
    buscarMaterialPorIdRepositorio,
    type DadosPedido
};
