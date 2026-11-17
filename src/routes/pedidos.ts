import { Router } from "express";
import {
  listarPedidosControle,
  buscarPedidoPorIdControle,
  adicionarPedidoControle,
  editarPedidoControle,
  excluirPedidoControle,
  iniciarPedidoControle,
  concluirPedidoControle,
} from "../Controle/PedidosControle";

const router = Router();

router.post("/", adicionarPedidoControle);
router.get("/", listarPedidosControle);
router.get("/:id", buscarPedidoPorIdControle);
router.put("/:id", editarPedidoControle);
router.delete("/:id", excluirPedidoControle);
router.put("/:id/iniciar", iniciarPedidoControle);
router.put("/:id/concluir", concluirPedidoControle);

export default router;
