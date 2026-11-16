import { Router } from "express";
import {
  adicionarImpressoraControle,
  buscaTodosImpressoras,
  buscaImpressoraIdControle,
  editarImpressoraControle,
  excluirImpressoraControle,
} from "../Controle/ImpressorasControle";

const route = Router();

route.post("/", adicionarImpressoraControle);
route.get("/", buscaTodosImpressoras);
route.get("/:id", buscaImpressoraIdControle);
route.put("/:id", editarImpressoraControle);
route.delete("/:id", excluirImpressoraControle);

export default route;
