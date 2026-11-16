import { Router } from "express";
import {
    buscaTodosPedidos,
    buscarPedidoPorIdControle,
    adicionarPedidoControle,
    editarPedidoControle
} from "../Controle/PedidosControle";

const route = Router();

route.post("/", adicionarPedidoControle);
route.get("/", buscaTodosPedidos);
route.get("/:id", buscarPedidoPorIdControle);
route.put("/:id", editarPedidoControle);

export default route;
