require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { z } = require("zod");

const app = express();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Validación de entrada
const ItemSchema = z.object({
  nombre: z.string().min(1, "nombre requerido"),
  categoria: z.string().min(1, "categoria requerida"),
  cantidad: z.number().int().min(0, "cantidad debe ser >= 0"),
  unidad: z.string().min(1, "unidad requerida"),
  imagenUrl: z.string().url().optional().or(z.literal("")).optional(),
  notas: z.string().optional().or(z.literal("")).optional(),
});

app.get("/health", (req, res) => res.json({ ok: true }));

// READ all
app.get("/items", async (req, res) => {
  const items = await prisma.item.findMany({
    orderBy: { updatedAt: "desc" },
  });
  res.json(items);
});

// READ one
app.get("/items/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "id inválido" });

  const item = await prisma.item.findUnique({ where: { id } });
  if (!item) return res.status(404).json({ message: "No encontrado" });

  res.json(item);
});

// CREATE
app.post("/items", async (req, res) => {
  const parsed = ItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const data = parsed.data;

  const created = await prisma.item.create({
    data: {
      ...data,
      imagenUrl: data.imagenUrl || null,
      notas: data.notas || null,
    },
  });

  res.status(201).json(created);
});

// UPDATE
app.put("/items/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "id inválido" });

  const exists = await prisma.item.findUnique({ where: { id } });
  if (!exists) return res.status(404).json({ message: "No encontrado" });

  const parsed = ItemSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const data = parsed.data;

  const updated = await prisma.item.update({
    where: { id },
    data: {
      ...data,
      imagenUrl: data.imagenUrl || null,
      notas: data.notas || null,
    },
  });

  res.json(updated);
});

// DELETE
app.delete("/items/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ message: "id inválido" });

  const exists = await prisma.item.findUnique({ where: { id } });
  if (!exists) return res.status(404).json({ message: "No encontrado" });

  await prisma.item.delete({ where: { id } });
  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0",() => {
  console.log(`API lista: http://localhost:${PORT}`);
  console.log(`Health:   http://localhost:${PORT}/health`);
  console.log(`Items:    http://localhost:${PORT}/items`);
});