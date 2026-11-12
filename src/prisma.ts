import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client";

const endereco = process.env.DATABASE_URL;
if (!endereco) {
    throw new Error("Configure DATABASE_URL no .env.");
}

const url = new URL(endereco);
const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
const adapter = new PrismaMariaDb({
    host: url.hostname.replace(/^\[|\]$/g, ""),
    port: Number(url.port || "3306"),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 5,
    allowPublicKeyRetrieval: local
});
const prisma = new PrismaClient({ adapter });

export { prisma };
