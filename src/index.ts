import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import authRoutes from "./routes/auth.routes";

const app = express();
dotenv.config();

app.use(cors({
   origin: "*", // ou o domínio do seu front
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

const prisma = new PrismaClient();


app.use("/", authRoutes);
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
