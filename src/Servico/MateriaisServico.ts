import {
  adicionarMaterialRepositorio,
  listarMateriaisRepositorio,
  buscarMaterialPorIdRepositorio,
  editarMaterialRepositorio,
  excluirMaterialRepositorio,
  type IMaterial,
} from "../Repositorio/MateriaisRepositorio";
import { idValido, textoValido, inteiroNaoNegativo } from "../Utils/validacao";
import { ErroApi } from "../Utils/erroApi";

const validarDadosMaterial = (dados: IMaterial) => {
  if (
    !dados ||
    !textoValido(dados.nome) ||
    !textoValido(dados.tipo) ||
    !textoValido(dados.cor) ||
    !inteiroNaoNegativo(dados.estoqueGramas)
  ) {
    throw new ErroApi(
      400,
      "Informe nome, tipo, cor e estoque em gramas igual ou maior que zero.",
    );
  }
  return {
    nome: dados.nome.trim(),
    tipo: dados.tipo.trim().toUpperCase(),
    cor: dados.cor.trim(),
    estoqueGramas: dados.estoqueGramas,
  };
};

const adicionarMaterialServico = async (dados: IMaterial) => {
  const material = await adicionarMaterialRepositorio(validarDadosMaterial(dados));
  return material;
};

const listarMateriaisServico = async () => {
  const materiais = await listarMateriaisRepositorio();
  return materiais;
};

const buscarMaterialPorIdServico = async (id: number) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const material = await buscarMaterialPorIdRepositorio(id);
  return material;
};

const editarMaterialServico = async (id: number, dados: IMaterial) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const material = await editarMaterialRepositorio(id, validarDadosMaterial(dados));
  return material;
};

const excluirMaterialServico = async (id: number) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const material = await excluirMaterialRepositorio(id);
  return material;
};

export {
  adicionarMaterialServico,
  listarMateriaisServico,
  buscarMaterialPorIdServico,
  editarMaterialServico,
  excluirMaterialServico,
};
