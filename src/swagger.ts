const referencia = (nome: string) => ({
    $ref: `#/components/schemas/${nome}`
});

const resposta = (descricao: string, schema: object) => ({
    description: descricao,
    content: { "application/json": { schema } }
});

const corpo = (nome: string) => ({
    required: true,
    content: { "application/json": { schema: referencia(nome) } }
});

const respostaErro = (descricao: string) => resposta(descricao, referencia("Erro"));

const parametroId = {
    name: "id",
    in: "path",
    description: "Identificador do registro",
    required: true,
    schema: { type: "integer", minimum: 1 }
};

const respostasProtegidas = {
    400: respostaErro("Dados inválidos."),
    401: respostaErro("Token ausente, inválido ou expirado."),
    404: respostaErro("Registro não encontrado."),
    409: respostaErro("A operação conflita com o estado do registro."),
    500: respostaErro("Erro interno.")
};

const respostaSucesso = (descricao: string, campo?: string, schema?: object) => {
    const propriedades: Record<string, object> = {
        sucesso: { type: "boolean", example: true },
        mensagem: { type: "string", example: descricao }
    };
    if (campo && schema) {
        propriedades[campo] = schema;
    }
    return resposta(descricao, { type: "object", properties: propriedades });
};

const rotasCrud = (caminho: string, tag: string, recurso: string, singular: string, plural: string) => ({
    [caminho]: {
        get: {
            tags: [tag],
            summary: `Listar ${plural}`,
            responses: {
                200: respostaSucesso("Consulta realizada.", plural, { type: "array", items: referencia(recurso) }),
                ...respostasProtegidas
            }
        },
        post: {
            tags: [tag],
            summary: `Cadastrar ${singular}`,
            requestBody: corpo(`${recurso}Entrada`),
            responses: {
                201: respostaSucesso("Cadastro realizado.", singular, referencia(recurso)),
                ...respostasProtegidas
            }
        }
    },
    [`${caminho}/{id}`]: {
        parameters: [parametroId],
        get: {
            tags: [tag],
            summary: `Consultar ${singular} por ID`,
            responses: {
                200: respostaSucesso("Registro encontrado.", singular, referencia(recurso)),
                ...respostasProtegidas
            }
        },
        put: {
            tags: [tag],
            summary: `Editar ${singular}`,
            requestBody: corpo(recurso === "Pedido" ? "PedidoEdicao" : `${recurso}Entrada`),
            responses: {
                200: respostaSucesso("Atualização realizada.", singular, referencia(recurso)),
                ...respostasProtegidas
            }
        },
        delete: {
            tags: [tag],
            summary: `Excluir ${singular}`,
            responses: {
                200: respostaSucesso("Exclusão realizada.", singular, referencia(recurso)),
                ...respostasProtegidas
            }
        }
    }
});

const dimensoes = {
    larguraMm: { type: "integer", minimum: 1, example: 100 },
    profundidadeMm: { type: "integer", minimum: 1, example: 100 },
    alturaMm: { type: "integer", minimum: 1, example: 50 }
};

const entradaImpressora = {
    type: "object",
    required: ["nome", "larguraMm", "profundidadeMm", "alturaMm", "tiposCompativeis"],
    properties: {
        nome: { type: "string", example: "Impressora 01" },
        ...dimensoes,
        tiposCompativeis: {
            type: "array",
            minItems: 1,
            items: { type: "string" },
            example: ["PLA", "PETG"]
        }
    }
};

const swaggerDocument = {
    openapi: "3.0.3",
    info: {
        title: "Laboratório de Impressão 3D",
        version: "1.0.0",
        description: "API da P2 para gerenciar impressoras, materiais e pedidos de impressão."
    },
    security: [{ tokenAcesso: [] }],
    paths: {
        ...rotasCrud("/impressoras", "Impressoras", "Impressora", "impressora", "impressoras"),
        "/auth/login": {
            post: {
                tags: ["Autenticação"],
                summary: "Autenticar um usuário",
                security: [],
                requestBody: corpo("Login"),
                responses: {
                    200: resposta("Login realizado.", referencia("LoginSucesso")),
                    400: respostaErro("Dados de login inválidos."),
                    401: respostaErro("Credenciais inválidas."),
                    500: respostaErro("Erro interno.")
                }
            }
        }
    },
    components: {
        securitySchemes: {
            tokenAcesso: {
                type: "apiKey",
                in: "header",
                name: "x-access-token",
                description: "Use o token retornado pelo login."
            }
        },
        schemas: {
            Erro: {
                type: "object",
                properties: {
                    sucesso: { type: "boolean", example: false },
                    mensagem: { type: "string", example: "Dados inválidos." }
                }
            },
            Login: {
                type: "object",
                required: ["usuario", "senha"],
                properties: {
                    usuario: { type: "string", format: "email", example: "equipe@laboratorio.example" },
                    senha: { type: "string", format: "password", minLength: 1, maxLength: 128 }
                }
            },
            LoginSucesso: {
                type: "object",
                properties: {
                    sucesso: { type: "boolean", example: true },
                    mensagem: { type: "string", example: "Login realizado com sucesso." },
                    idUsuario: { type: "integer", example: 1 },
                    token: { type: "string", description: "JWT válido por oito horas." }
                }
            },
            ImpressoraEntrada: entradaImpressora,
            Impressora: {
                allOf: [
                    referencia("ImpressoraEntrada"),
                    {
                        type: "object",
                        properties: {
                            id: { type: "integer" },
                            disponivel: { type: "boolean", example: true }
                        }
                    }
                ]
            }
        }
    }
};

export {
    swaggerDocument
}
