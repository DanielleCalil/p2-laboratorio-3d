import {
  adicionarImpressoraRepositorio,
  listarImpressorasRepositorio,
  buscarImpressoraPorIdRepositorio,
  editarImpressoraRepositorio,
  excluirImpressoraRepositorio,
  type IImpressora,
} from "../Repositorio/ImpressorasRepositorio";
import { idValido, textoValido, inteiroPositivo } from "../Utils/validacao";
import { ErroApi } from "../Utils/erroApi";

const validarDadosImpressora = (dados: IImpressora) => {
  if (
    !dados ||
    !textoValido(dados.nome) ||
    !inteiroPositivo(dados.larguraMm) ||
    !inteiroPositivo(dados.profundidadeMm) ||
    !inteiroPositivo(dados.alturaMm) ||
    !Array.isArray(dados.tiposCompativeis) ||
    dados.tiposCompativeis.length === 0 ||
    !dados.tiposCompativeis.every((tipo) => textoValido(tipo))
  ) {
    throw new ErroApi(
      400,
      "Informe nome, dimensões positivas em milímetros e pelo menos um tipo de material.",
    );
  }
  return {
    nome: dados.nome.trim(),
    larguraMm: dados.larguraMm,
    profundidadeMm: dados.profundidadeMm,
    alturaMm: dados.alturaMm,
    tiposCompativeis: [
      ...new Set(
        dados.tiposCompativeis.map((tipo) => tipo.trim().toUpperCase()),
      ),
    ],
  };
};

const adicionarImpressoraServico = async (dados: IImpressora) => {
  const impressora = await adicionarImpressoraRepositorio(validarDadosImpressora(dados));
  return impressora;
};

const listarImpressorasServico = async () => {
  const impressoras = await listarImpressorasRepositorio();
  return impressoras;
};

const buscarImpressoraPorIdServico = async (id: number) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const impressora = await buscarImpressoraPorIdRepositorio(id);
  return impressora;
};

const editarImpressoraServico = async (id: number, dados: IImpressora) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const impressora = await editarImpressoraRepositorio(id, validarDadosImpressora(dados));
  return impressora;
};

const excluirImpressoraServico = async (id: number) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const impressora = await excluirImpressoraRepositorio(id);
  return impressora;
};

export {
  adicionarImpressoraServico,
  listarImpressorasServico,
  buscarImpressoraPorIdServico,
  editarImpressoraServico,
  excluirImpressoraServico,
};
