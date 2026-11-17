import { Request, Response } from "express";
import {
  adicionarMaterialServico,
  listarMateriaisServico,
  buscarMaterialPorIdServico,
  editarMaterialServico,
  excluirMaterialServico,
} from "../Servico/MateriaisServico";
import { responderErro } from "../Utils/erroApi";

const adicionarMaterialControle = async (req: Request, res: Response) => {
  try {
    const material = await adicionarMaterialServico(req.body);
    return res.status(201).json({
      sucesso: true,
      mensagem: "Material cadastrado com sucesso.",
      material: material,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao cadastrar material.");
  }
};

const listarMateriaisControle = async (_req: Request, res: Response) => {
  try {
    const materiais = await listarMateriaisServico();
    return res.status(200).json({
      sucesso: true,
      mensagem: "Materiais encontrados com sucesso.",
      materiais: materiais,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao consultar materiais.");
  }
};

const buscarMaterialPorIdControle = async (req: Request, res: Response) => {
  try {
    const material = await buscarMaterialPorIdServico(Number(req.params.id));
    return res.status(200).json({
      sucesso: true,
      mensagem: "Material encontrado com sucesso.",
      material: material,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao consultar material.");
  }
};

const editarMaterialControle = async (req: Request, res: Response) => {
  try {
    const material = await editarMaterialServico(
      Number(req.params.id),
      req.body,
    );
    return res.status(200).json({
      sucesso: true,
      mensagem: "Material atualizado com sucesso.",
      material: material,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao editar material.");
  }
};

const excluirMaterialControle = async (req: Request, res: Response) => {
  try {
    const material = await excluirMaterialServico(Number(req.params.id));
    return res.status(200).json({
      sucesso: true,
      mensagem: "Material excluído com sucesso.",
      material: material,
    });
  } catch (erro) {
    return responderErro(erro, res, "Erro ao excluir material.");
  }
};

export {
  adicionarMaterialControle,
  listarMateriaisControle,
  buscarMaterialPorIdControle,
  editarMaterialControle,
  excluirMaterialControle,
};
