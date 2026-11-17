import { prisma } from "../prisma";

interface IImpressora {
  nome: string;
  larguraMm: number;
  profundidadeMm: number;
  alturaMm: number;
  tiposCompativeis: string[];
}

const pedidosAtivos = {
  include: {
    pedidos: {
      where: { status: "EM_IMPRESSAO" },
      select: { id: true },
      take: 1,
    },
  },
} as const;

const adicionarImpressoraRepositorio = async (dados: IImpressora) => {
  const impressora = await prisma.impressora.create({
    data: dados,
    ...pedidosAtivos,
  });
  const { pedidos, ...dadosImpressora } = impressora;
  return { ...dadosImpressora, disponivel: pedidos.length === 0 };
};

const listarImpressorasRepositorio = async () => {
  const impressoras = await prisma.impressora.findMany({
    orderBy: { id: "asc" },
    ...pedidosAtivos,
  });
  return impressoras.map(({ pedidos, ...impressora }) => ({
    ...impressora,
    disponivel: pedidos.length === 0,
  }));
};

const buscarImpressoraPorIdRepositorio = async (id: number) => {
  const impressora = await prisma.impressora.findUniqueOrThrow({
    where: { id },
    ...pedidosAtivos,
  });
  const { pedidos, ...dadosImpressora } = impressora;
  return { ...dadosImpressora, disponivel: pedidos.length === 0 };
};

const editarImpressoraRepositorio = async (id: number, dados: IImpressora) => {
  const impressora = await prisma.impressora.update({
    where: { id },
    data: dados,
    ...pedidosAtivos,
  });
  const { pedidos, ...dadosImpressora } = impressora;
  return { ...dadosImpressora, disponivel: pedidos.length === 0 };
};

const excluirImpressoraRepositorio = async (id: number) => {
  const impressora = await prisma.impressora.delete({
    where: { id },
    ...pedidosAtivos,
  });
  const { pedidos, ...dadosImpressora } = impressora;
  return { ...dadosImpressora, disponivel: pedidos.length === 0 };
};

export {
  IImpressora,
  adicionarImpressoraRepositorio,
  listarImpressorasRepositorio,
  buscarImpressoraPorIdRepositorio,
  editarImpressoraRepositorio,
  excluirImpressoraRepositorio,
};
