import { Request, Response } from "express";
import {
    adicionarImpressoraServico,
    buscaTodosImpressorasServico,
    buscaImpressoraIdServico,
    editarImpressoraServico,
    excluirImpressoraServico
} from "../Servico/ImpressorasServico";
import { responderErro } from "../Utils/erroApi";

const adicionarImpressoraControle = async (req: Request, res: Response) => {
    try {
        const impressora = await adicionarImpressoraServico(req.body);
        return res.status(201).json({
            'sucesso': true,
            'mensagem': 'Impressora cadastrada com sucesso.',
            'impressora': impressora
        });
    } catch (erro) {
        return responderErro(erro, res, "Erro ao cadastrar impressora.");
    }
}

const buscaTodosImpressoras = async (_req: Request, res: Response) => {
    try {
        const impressoras = await buscaTodosImpressorasServico();
        return res.status(200).json({
            'sucesso': true,
            'mensagem': 'Impressoras encontradas com sucesso.',
            'impressoras': impressoras
        });
    } catch (erro) {
        return responderErro(erro, res, "Erro ao consultar impressoras.");
    }
}

const buscaImpressoraIdControle = async (req: Request, res: Response) => {
    try {
        const impressora = await buscaImpressoraIdServico(Number(req.params.id));
        return res.status(200).json({
            'sucesso': true,
            'mensagem': 'Impressora encontrada com sucesso.',
            'impressora': impressora
        });
    } catch (erro) {
        return responderErro(erro, res, "Erro ao consultar impressora.");
    }
}

const editarImpressoraControle = async (req: Request, res: Response) => {
    try {
        const impressora = await editarImpressoraServico(Number(req.params.id), req.body);
        return res.status(200).json({
            'sucesso': true,
            'mensagem': 'Impressora atualizada com sucesso.',
            'impressora': impressora
        });
    } catch (erro) {
        return responderErro(erro, res, "Erro ao editar impressora.");
    }
}

const excluirImpressoraControle = async (req: Request, res: Response) => {
    try {
        const impressora = await excluirImpressoraServico(Number(req.params.id));
        return res.status(200).json({
            'sucesso': true,
            'mensagem': 'Impressora excluída com sucesso.',
            'impressora': impressora
        });
    } catch (erro) {
        return responderErro(erro, res, "Erro ao excluir impressora.");
    }
}

export {
    adicionarImpressoraControle,
    buscaTodosImpressoras,
    buscaImpressoraIdControle,
    editarImpressoraControle,
    excluirImpressoraControle
}
