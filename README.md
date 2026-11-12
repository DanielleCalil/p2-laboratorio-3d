# P2 — Laboratório de impressão 3D

API para cadastrar impressoras, manter o estoque de filamentos e acompanhar a fila de impressão. O sistema atribui uma impressora ao pedido quando a equipe inicia o trabalho.

## Como executar

Pré-requisitos: Node.js 24 e MySQL.

1. Crie um banco MySQL para a P2 e copie `.env.example` para `.env`.
2. Configure `DATABASE_URL`, uma chave aleatória para `JWT_SECRET` (mínimo de 32 caracteres) e o e-mail e a senha do primeiro usuário em `ADMIN_EMAIL` e `ADMIN_SENHA`.
3. Na pasta do projeto, execute:

```sh
npm ci
npx prisma migrate deploy
npx prisma generate
npm run seed
npm run dev
```

A API usa a porta 3001 por padrão. Abra [Swagger](http://localhost:3001/docs) para consultar e testar as rotas. Faça `POST /auth/login` com `usuario` (e-mail do usuário inicial) e `senha`. No Swagger, abra **Authorize** e cole o token retornado. Em outros clientes HTTP, envie o token no cabeçalho `x-access-token`.

## Rotas

| Recurso | Cadastro | Listagem | Consulta | Edição | Exclusão |
| --- | --- | --- | --- | --- | --- |
| Impressoras | `POST /impressoras` | `GET /impressoras` | `GET /impressoras/:id` | `PUT /impressoras/:id` | `DELETE /impressoras/:id` |
| Materiais | `POST /materiais` | `GET /materiais` | `GET /materiais/:id` | `PUT /materiais/:id` | `DELETE /materiais/:id` |
| Pedidos | `POST /pedidos` | `GET /pedidos` | `GET /pedidos/:id` | `PUT /pedidos/:id` | `DELETE /pedidos/:id` |

- `PUT /pedidos/:id/iniciar` escolhe uma impressora e desconta o consumo estimado.
- `PUT /pedidos/:id/concluir` registra a conclusão e libera a impressora.
- `POST /auth/login` autentica a equipe.

## Regra de negócio

Cada pedido começa como `PENDENTE`. Para iniciar, o material escolhido precisa ter saldo suficiente e deve existir uma impressora livre que aceite o tipo de filamento e comporte as medidas da peça nos eixos informados. O laboratório fornece as dimensões e o consumo estimado em gramas. A API escolhe a primeira impressora elegível por ID, registra o início e atualiza o estoque e o pedido na mesma transação.

Pedidos pendentes podem ser editados ou excluídos. Pedidos em impressão podem ser concluídos. A conclusão preserva o vínculo com a impressora para consulta do histórico. Materiais e impressoras com pedidos vinculados não podem ser excluídos.

Para demonstrar, cadastre uma impressora compatível com PLA, um material PLA com 80 g e um pedido de 120 g que caiba nessa impressora. O início deve retornar 409. Atualize o saldo para 200 g e tente novamente. O pedido passa para `EM_IMPRESSAO` e o saldo fica em 80 g. Conclua o pedido e confira que a impressora voltou a ficar disponível.

## Organização

As rotas encaminham as requisições ao controller, o controller monta a resposta HTTP, o serviço aplica as regras de negócio e o repositório consulta e grava pelo Prisma. Os modelos e as migrações ficam na pasta `prisma`.

O projeto usa TypeScript, Express, Prisma, MySQL e Swagger. O login usa JWT e as senhas são armazenadas com scrypt e salt. Para verificar os tipos, rode `npm run typecheck`.
