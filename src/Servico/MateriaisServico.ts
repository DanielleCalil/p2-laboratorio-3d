import {
    adicionarMaterial,
    buscaTodosMateriais,
    buscaMaterialId,
    editarMaterial,
    excluirMaterial,
    type IMaterial
} from "../Repositorio/MateriaisRepositorio";
import { idValido, textoValido, inteiroNaoNegativo } from "../Utils/validacao";
import { ErroApi } from "../Utils/erroApi";

const validarDadosMaterial = (dados: IMaterial) => {
    if (!dados || !textoValido(dados.nome) || !textoValido(dados.tipo) ||
        !textoValido(dados.cor) || !inteiroNaoNegativo(dados.estoqueGramas)) {
        throw new ErroApi(400, "Informe nome, tipo, cor e estoque em gramas igual ou maior que zero.");
    }
    return {
        nome: dados.nome.trim(),
        tipo: dados.tipo.trim().toUpperCase(),
        cor: dados.cor.trim(),
        estoqueGramas: dados.estoqueGramas
    };
}

const adicionarMaterialServico = async (dados: IMaterial) => {
    const material = await adicionarMaterial(validarDadosMaterial(dados));
    return material;
}

const buscaTodosMateriaisServico = async () => {
    const materiais = await buscaTodosMateriais();
    return materiais;
}

const buscaMaterialIdServico = async (id: number) => {
    if (!idValido(id)) {
        throw new ErroApi(400, "Informe um ID válido.");
    }

    const material = await buscaMaterialId(id);
    return material;
}

const editarMaterialServico = async (id: number, dados: IMaterial) => {
    if (!idValido(id)) {
        throw new ErroApi(400, "Informe um ID válido.");
    }

    const material = await editarMaterial(id, validarDadosMaterial(dados));
    return material;
}

const excluirMaterialServico = async (id: number) => {
    if (!idValido(id)) {
        throw new ErroApi(400, "Informe um ID válido.");
    }

    const material = await excluirMaterial(id);
    return material;
}

export {
    adicionarMaterialServico,
    buscaTodosMateriaisServico,
    buscaMaterialIdServico,
    editarMaterialServico,
    excluirMaterialServico
}
