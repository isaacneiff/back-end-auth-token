// src/services/auth.service.ts
import prisma from "../prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "default-secret";

/** Input types */
type RegisterInput = { name: string; email: string; password: string };
type LoginInput = { email: string; password: string };

/** Register user */
export async function registerUser({ name, email, password }: RegisterInput) {
  // check existing
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email já cadastrado.");

  
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed },
    select: { id: true, name: true, email: true },
  });

  // optionally return token after register:
  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

  return { token, user };
}

/** Login user */
export async function loginUser({ email, password }: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário ou senha inválidos.");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Usuário ou senha inválidos.");

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

  return { token, user: { id: user.id, name: user.name, email: user.email } };
}
