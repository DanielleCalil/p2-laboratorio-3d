import type { Request, Response } from "express";
import {
  listarPedidosServico,
  buscarPedidoPorIdServico,
  adicionarPedidoServico,
  editarPedidoServico,
  excluirPedidoServico,
  iniciarPedidoServico,
  concluirPedidoServico,
} from "../Servico/PedidosServico";
import { responderErro } from "../Utils/erroApi";

const listarPedidosControle = async (_req: Request, res: Response) => {
  try {
    const pedidos = await listarPedidosServico();
    return res.status(200).json({
      sucesso: true,
      mensagem: "Pedidos encontrados com sucesso.",
      pedidos: pedidos,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao listar pedidos.");
  }
};

const buscarPedidoPorIdControle = async (req: Request, res: Response) => {
  try {
    const pedido = await buscarPedidoPorIdServico(Number(req.params.id));
    return res.status(200).json({
      sucesso: true,
      mensagem: "Pedido encontrado com sucesso.",
      pedido: pedido,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao buscar pedido.");
  }
};

const adicionarPedidoControle = async (req: Request, res: Response) => {
  try {
    const pedido = await adicionarPedidoServico(req.body);
    return res.status(201).json({
      sucesso: true,
      mensagem: "Pedido adicionado com sucesso.",
      pedido: pedido,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao cadastrar pedido.");
  }
};

const editarPedidoControle = async (req: Request, res: Response) => {
  try {
    const pedido = await editarPedidoServico(Number(req.params.id), req.body);
    return res.status(200).json({
      sucesso: true,
      mensagem: "Pedido atualizado com sucesso.",
      pedido: pedido,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao editar pedido.");
  }
};

const excluirPedidoControle = async (req: Request, res: Response) => {
  try {
    const pedido = await excluirPedidoServico(Number(req.params.id));
    return res.status(200).json({
      sucesso: true,
      mensagem: "Pedido excluído com sucesso.",
      pedido: pedido,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao excluir pedido.");
  }
};

const iniciarPedidoControle = async (req: Request, res: Response) => {
  try {
    const pedido = await iniciarPedidoServico(Number(req.params.id));
    return res.status(200).json({
      sucesso: true,
      mensagem: "Impressão iniciada com sucesso.",
      pedido: pedido,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao iniciar impressão.");
  }
};

const concluirPedidoControle = async (req: Request, res: Response) => {
  try {
    const pedido = await concluirPedidoServico(Number(req.params.id));
    return res.status(200).json({
      sucesso: true,
      mensagem: "Impressão concluída com sucesso.",
      pedido: pedido,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao concluir impressão.");
  }
};

export {
  listarPedidosControle,
  buscarPedidoPorIdControle,
  adicionarPedidoControle,
  editarPedidoControle,
  excluirPedidoControle,
  iniciarPedidoControle,
  concluirPedidoControle,
};
