import { Router } from "express";
import {
  adicionarMaterialControle,
  listarMateriaisControle,
  buscarMaterialPorIdControle,
  editarMaterialControle,
  excluirMaterialControle,
} from "../Controle/MateriaisControle";

const router = Router();

router.post("/", adicionarMaterialControle);
router.get("/", listarMateriaisControle);
router.get("/:id", buscarMaterialPorIdControle);
router.put("/:id", editarMaterialControle);
router.delete("/:id", excluirMaterialControle);

export default router;
