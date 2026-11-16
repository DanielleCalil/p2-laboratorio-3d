import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../prisma";

type DadosPedido = Pick<
  Prisma.PedidoUncheckedCreateInput,
  | "solicitante"
  | "descricao"
  | "larguraMm"
  | "profundidadeMm"
  | "alturaMm"
  | "materialId"
  | "consumoGramas"
>;

const buscaTodosPedidosRepositorio = async () => {
  const pedidos = await prisma.pedido.findMany({
    orderBy: { id: "asc" },
  });
  return pedidos;
};

const buscarPedidoPorIdRepositorio = async (
  id: number,
  conexao: Prisma.TransactionClient = prisma,
) => {
  const pedido = await conexao.pedido.findUnique({
    where: { id },
    include: { material: true, impressora: true },
  });
  return pedido;
};

const adicionarPedidoRepositorio = async (dados: DadosPedido) => {
  const pedido = await prisma.pedido.create({ data: dados });
  return pedido;
};

const editarPedidoRepositorio = async (
  id: number,
  dados: Partial<DadosPedido>,
) => {
  const pedido = await prisma.pedido.update({
    where: { id, status: "PENDENTE" },
    data: dados,
  });
  return pedido;
};

const excluirPedidoRepositorio = async (id: number) => {
  const pedido = await prisma.pedido.delete({
    where: { id, status: "PENDENTE" },
  });
  return pedido;
};

const buscarMaterialPorIdRepositorio = async (id: number) => {
  const material = await prisma.material.findUnique({ where: { id } });
  return material;
};

const buscarImpressorasDisponiveisRepositorio = async (
  conexao: Prisma.TransactionClient,
  pedido: Pick<DadosPedido, "larguraMm" | "profundidadeMm" | "alturaMm">,
) => {
  const impressoras = await conexao.impressora.findMany({
    where: {
      larguraMm: { gte: pedido.larguraMm },
      profundidadeMm: { gte: pedido.profundidadeMm },
      alturaMm: { gte: pedido.alturaMm },
      pedidos: { none: { status: "EM_IMPRESSAO" } },
    },
    orderBy: { id: "asc" },
  });
  return impressoras;
};

const descontarMaterialRepositorio = async (
  conexao: Prisma.TransactionClient,
  id: number,
  consumoGramas: number,
) => {
  const resultado = await conexao.material.updateMany({
    where: { id, estoqueGramas: { gte: consumoGramas } },
    data: { estoqueGramas: { decrement: consumoGramas } },
  });
  return resultado.count > 0;
};

const iniciarPedidoRepositorio = async (
  conexao: Prisma.TransactionClient,
  id: number,
  impressoraId: number,
) => {
  const pedido = await conexao.pedido.update({
    where: { id, status: "PENDENTE" },
    data: { impressoraId, status: "EM_IMPRESSAO", iniciadoEm: new Date() },
    include: { impressora: true, material: true },
  });
  return pedido;
};

const concluirPedidoRepositorio = async (id: number) => {
  const pedido = await prisma.pedido.update({
    where: { id, status: "EM_IMPRESSAO" },
    data: { status: "CONCLUIDO", concluidoEm: new Date() },
    include: { impressora: true },
  });
  return pedido;
};

const executarTransacaoPedidoRepositorio = async <T>(
  operacao: (conexao: Prisma.TransactionClient) => Promise<T>,
) => {
  const resultado = await prisma.$transaction(operacao, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  });
  return resultado;
};

export {
  buscaTodosPedidosRepositorio,
  buscarPedidoPorIdRepositorio,
  adicionarPedidoRepositorio,
  editarPedidoRepositorio,
  excluirPedidoRepositorio,
  buscarMaterialPorIdRepositorio,
  buscarImpressorasDisponiveisRepositorio,
  descontarMaterialRepositorio,
  iniciarPedidoRepositorio,
  concluirPedidoRepositorio,
  executarTransacaoPedidoRepositorio,
  type DadosPedido,
};
