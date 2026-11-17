import { prisma } from "../prisma";

interface IMaterial {
  nome: string;
  tipo: string;
  cor: string;
  estoqueGramas: number;
}

const adicionarMaterialRepositorio = async (dados: IMaterial) => {
  const material = await prisma.material.create({ data: dados });
  return material;
};

const listarMateriaisRepositorio = async () => {
  const materiais = await prisma.material.findMany({ orderBy: { id: "asc" } });
  return materiais;
};

const buscarMaterialPorIdRepositorio = async (id: number) => {
  const material = await prisma.material.findUniqueOrThrow({ where: { id } });
  return material;
};

const editarMaterialRepositorio = async (id: number, dados: IMaterial) => {
  const material = await prisma.material.update({ where: { id }, data: dados });
  return material;
};

const excluirMaterialRepositorio = async (id: number) => {
  const material = await prisma.material.delete({ where: { id } });
  return material;
};

export {
  IMaterial,
  adicionarMaterialRepositorio,
  listarMateriaisRepositorio,
  buscarMaterialPorIdRepositorio,
  editarMaterialRepositorio,
  excluirMaterialRepositorio,
};
