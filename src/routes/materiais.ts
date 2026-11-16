import { Router } from "express";
import {
    adicionarMaterialControle,
    buscaTodosMateriais,
    buscaMaterialIdControle,
    editarMaterialControle,
    excluirMaterialControle
} from "../Controle/MateriaisControle";

const route = Router();

route.post('/', adicionarMaterialControle);
route.get('/', buscaTodosMateriais);
route.get('/:id', buscaMaterialIdControle);
route.put('/:id', editarMaterialControle);
route.delete('/:id', excluirMaterialControle);

export default route;
