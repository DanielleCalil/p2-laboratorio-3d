import { Router } from "express";
import {
  buscaTodosPedidos,
  buscarPedidoPorIdControle,
  adicionarPedidoControle,
  editarPedidoControle,
  excluirPedidoControle,
  iniciarPedidoControle,
  concluirPedidoControle,
} from "../Controle/PedidosControle";

const route = Router();

route.post("/", adicionarPedidoControle);
route.get("/", buscaTodosPedidos);
route.get("/:id", buscarPedidoPorIdControle);
route.put("/:id", editarPedidoControle);
route.delete("/:id", excluirPedidoControle);
route.put("/:id/iniciar", iniciarPedidoControle);
route.put("/:id/concluir", concluirPedidoControle);

export default route;
