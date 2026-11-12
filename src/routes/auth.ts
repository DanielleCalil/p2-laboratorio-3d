import { Router } from "express";
import { loginControle } from "../Controle/AuthControle";

const router = Router();

router.post("/login", loginControle);

export default router;
