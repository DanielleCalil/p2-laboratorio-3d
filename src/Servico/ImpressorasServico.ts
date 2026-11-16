import {
  adicionarImpressora,
  buscaTodosImpressoras,
  buscaImpressoraId,
  editarImpressora,
  excluirImpressora,
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
  const impressora = await adicionarImpressora(validarDadosImpressora(dados));
  return impressora;
};

const buscaTodosImpressorasServico = async () => {
  const impressoras = await buscaTodosImpressoras();
  return impressoras;
};

const buscaImpressoraIdServico = async (id: number) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const impressora = await buscaImpressoraId(id);
  return impressora;
};

const editarImpressoraServico = async (id: number, dados: IImpressora) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const impressora = await editarImpressora(id, validarDadosImpressora(dados));
  return impressora;
};

const excluirImpressoraServico = async (id: number) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID válido.");
  }

  const impressora = await excluirImpressora(id);
  return impressora;
};

export {
  adicionarImpressoraServico,
  buscaTodosImpressorasServico,
  buscaImpressoraIdServico,
  editarImpressoraServico,
  excluirImpressoraServico,
};
