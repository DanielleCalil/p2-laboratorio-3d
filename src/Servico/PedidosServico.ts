import { Prisma } from "../../generated/prisma/client";
import {
  listarPedidosRepositorio,
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
} from "../Repositorio/PedidosRepositorio";
import { ErroApi } from "../Utils/erroApi";
import { idValido, inteiroPositivo, textoValido } from "../Utils/validacao";

const validarDadosPedido = (dados: Partial<DadosPedido>, cadastro: boolean) => {
  if (
    (cadastro || dados.solicitante !== undefined) &&
    !textoValido(dados.solicitante)
  ) {
    throw new ErroApi(400, "Informe um solicitante com até 191 caracteres.");
  }
  if (
    (cadastro || dados.descricao !== undefined) &&
    !textoValido(dados.descricao)
  ) {
    throw new ErroApi(400, "Informe uma descrição com até 191 caracteres.");
  }
  const medidas = [dados.larguraMm, dados.profundidadeMm, dados.alturaMm];
  if (
    medidas.some(
      (medida) =>
        (cadastro || medida !== undefined) && !inteiroPositivo(medida),
    )
  ) {
    throw new ErroApi(
      400,
      "Informe dimensões em milímetros como números inteiros positivos.",
    );
  }
  if (
    (cadastro || dados.materialId !== undefined) &&
    !idValido(dados.materialId)
  ) {
    throw new ErroApi(400, "Informe um ID de material válido.");
  }
  if (
    (cadastro || dados.consumoGramas !== undefined) &&
    !inteiroPositivo(dados.consumoGramas)
  ) {
    throw new ErroApi(
      400,
      "Informe um consumo em gramas como número inteiro positivo.",
    );
  }
};

const buscarPedidoPorIdServico = async (
  id: number,
  conexao?: Prisma.TransactionClient,
) => {
  if (!idValido(id)) {
    throw new ErroApi(400, "Informe um ID de pedido válido.");
  }
  const pedido = await buscarPedidoPorIdRepositorio(id, conexao);
  if (!pedido) {
    throw new ErroApi(404, "Pedido não encontrado.");
  }
  return pedido;
};

const listarPedidosServico = async () => {
  const pedidos = await listarPedidosRepositorio();
  return pedidos;
};

const adicionarPedidoServico = async (dados: DadosPedido) => {
  const {
    solicitante,
    descricao,
    larguraMm,
    profundidadeMm,
    alturaMm,
    materialId,
    consumoGramas,
  } = dados ?? {};
  validarDadosPedido(
    {
      solicitante,
      descricao,
      larguraMm,
      profundidadeMm,
      alturaMm,
      materialId,
      consumoGramas,
    },
    true,
  );

  const material = await buscarMaterialPorIdRepositorio(materialId);
  if (!material) {
    throw new ErroApi(404, "Material não encontrado.");
  }

  const pedido = await adicionarPedidoRepositorio({
    solicitante: solicitante.trim(),
    descricao: descricao.trim(),
    larguraMm,
    profundidadeMm,
    alturaMm,
    materialId,
    consumoGramas,
  });
  return pedido;
};

const editarPedidoServico = async (id: number, dados: Partial<DadosPedido>) => {
  const atual = await buscarPedidoPorIdServico(id);
  if (atual.status !== "PENDENTE") {
    throw new ErroApi(409, "Apenas pedidos pendentes podem ser editados.");
  }
  const {
    solicitante,
    descricao,
    larguraMm,
    profundidadeMm,
    alturaMm,
    materialId,
    consumoGramas,
  } = dados ?? {};
  const novosDados = {
    solicitante,
    descricao,
    larguraMm,
    profundidadeMm,
    alturaMm,
    materialId,
    consumoGramas,
  };
  if (Object.values(novosDados).every((valor) => valor === undefined)) {
    throw new ErroApi(400, "Informe pelo menos um campo válido para editar.");
  }
  validarDadosPedido(novosDados, false);

  if (
    materialId !== undefined &&
    !(await buscarMaterialPorIdRepositorio(materialId))
  ) {
    throw new ErroApi(404, "Material não encontrado.");
  }

  try {
    const pedido = await editarPedidoRepositorio(id, {
      ...novosDados,
      solicitante: solicitante?.trim(),
      descricao: descricao?.trim(),
    });
    return pedido;
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2025"
    ) {
      await buscarPedidoPorIdServico(id);
      throw new ErroApi(409, "Apenas pedidos pendentes podem ser editados.");
    }
    throw erro;
  }
};

const excluirPedidoServico = async (id: number) => {
  const atual = await buscarPedidoPorIdServico(id);
  if (atual.status !== "PENDENTE") {
    throw new ErroApi(409, "Apenas pedidos pendentes podem ser excluídos.");
  }
  try {
    const pedido = await excluirPedidoRepositorio(id);
    return pedido;
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2025"
    ) {
      await buscarPedidoPorIdServico(id);
      throw new ErroApi(409, "Apenas pedidos pendentes podem ser excluídos.");
    }
    throw erro;
  }
};

const iniciarPedidoServico = async (id: number) => {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      return await executarTransacaoPedidoRepositorio(async (conexao) => {
        const pedido = await buscarPedidoPorIdServico(id, conexao);
        if (pedido.status !== "PENDENTE") {
          throw new ErroApi(
            409,
            "Apenas pedidos pendentes podem iniciar impressão.",
          );
        }
        if (pedido.material.estoqueGramas < pedido.consumoGramas) {
          throw new ErroApi(
            409,
            "Estoque insuficiente para iniciar a impressão.",
          );
        }

        const impressoras = await buscarImpressorasDisponiveisRepositorio(
          conexao,
          pedido,
        );
        const impressora = impressoras.find(
          (item) =>
            Array.isArray(item.tiposCompativeis) &&
            item.tiposCompativeis.includes(pedido.material.tipo),
        );
        if (!impressora) {
          throw new ErroApi(
            409,
            "Nenhuma impressora livre comporta a peça e aceita o material.",
          );
        }

        const materialDescontado = await descontarMaterialRepositorio(
          conexao,
          pedido.materialId,
          pedido.consumoGramas,
        );
        if (!materialDescontado) {
          throw new ErroApi(
            409,
            "Estoque insuficiente para iniciar a impressão.",
          );
        }
        return await iniciarPedidoRepositorio(
          conexao,
          pedido.id,
          impressora.id,
        );
      });
    } catch (erro) {
      if (
        !(erro instanceof Prisma.PrismaClientKnownRequestError) ||
        erro.code !== "P2034"
      ) {
        throw erro;
      }
    }
  }
  throw new ErroApi(
    409,
    "Outro pedido alterou a disponibilidade. Tente iniciar novamente.",
  );
};

const concluirPedidoServico = async (id: number) => {
  const atual = await buscarPedidoPorIdServico(id);
  if (atual.status !== "EM_IMPRESSAO") {
    throw new ErroApi(409, "Apenas pedidos em impressão podem ser concluídos.");
  }
  try {
    const pedido = await concluirPedidoRepositorio(id);
    return pedido;
  } catch (erro) {
    if (
      erro instanceof Prisma.PrismaClientKnownRequestError &&
      erro.code === "P2025"
    ) {
      throw new ErroApi(
        409,
        "Apenas pedidos em impressão podem ser concluídos.",
      );
    }
    throw erro;
  }
};

export {
  listarPedidosServico,
  buscarPedidoPorIdServico,
  adicionarPedidoServico,
  editarPedidoServico,
  excluirPedidoServico,
  iniciarPedidoServico,
  concluirPedidoServico,
};
