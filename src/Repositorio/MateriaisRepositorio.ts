import { prisma } from "../prisma";

interface IMaterial {
  nome: string;
  tipo: string;
  cor: string;
  estoqueGramas: number;
}

const adicionarMaterial = async (dados: IMaterial) => {
  const material = await prisma.material.create({ data: dados });
  return material;
};

const buscaTodosMateriais = async () => {
  const materiais = await prisma.material.findMany({ orderBy: { id: "asc" } });
  return materiais;
};

const buscaMaterialId = async (id: number) => {
  const material = await prisma.material.findUniqueOrThrow({ where: { id } });
  return material;
};

const editarMaterial = async (id: number, dados: IMaterial) => {
  const material = await prisma.material.update({ where: { id }, data: dados });
  return material;
};

const excluirMaterial = async (id: number) => {
  const material = await prisma.material.delete({ where: { id } });
  return material;
};

export {
  IMaterial,
  adicionarMaterial,
  buscaTodosMateriais,
  buscaMaterialId,
  editarMaterial,
  excluirMaterial,
};
