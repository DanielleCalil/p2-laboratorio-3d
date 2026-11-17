import { Router } from "express";
import {
  adicionarImpressoraControle,
  listarImpressorasControle,
  buscarImpressoraPorIdControle,
  editarImpressoraControle,
  excluirImpressoraControle,
} from "../Controle/ImpressorasControle";

const router = Router();

router.post("/", adicionarImpressoraControle);
router.get("/", listarImpressorasControle);
router.get("/:id", buscarImpressoraPorIdControle);
router.put("/:id", editarImpressoraControle);
router.delete("/:id", excluirImpressoraControle);

export default router;
