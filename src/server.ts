import express, { type ErrorRequestHandler } from "express";
import swaggerUi from "swagger-ui-express";
import rotasAuth from "./routes/auth";
import { validaToken } from "./Utils/criptografia";
import { responderErro } from "./Utils/erroApi";
import { swaggerDocument } from "./swagger";

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(express.json());
app.get("/", (_req, res) => {
    return res.status(200).json({ sucesso: true, mensagem: "API do Laboratório 3D funcionando.", documentacao: "/docs" });
});
app.get("/docs.json", (_req, res) => res.json(swaggerDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/auth", rotasAuth);

app.use((_req, res) => {
    return res.status(404).json({ sucesso: false, mensagem: "Rota não encontrada." });
});

const tratarErro: ErrorRequestHandler = (erro, _req, res, next) => {
    if (res.headersSent) return next(erro);
    if (erro?.type === "entity.parse.failed") {
        return res.status(400).json({ sucesso: false, mensagem: "O corpo da requisição deve ser um JSON válido." });
    }
    if (erro?.type === "entity.too.large") {
        return res.status(413).json({ sucesso: false, mensagem: "O corpo da requisição excede o tamanho permitido." });
    }
    return responderErro(erro, res, "Erro interno no servidor.");
};

app.use(tratarErro);
app.listen(PORT, () => console.log(`Servidor executando em localhost:${PORT}`));
