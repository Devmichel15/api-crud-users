import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";
import supabase from "./src/config/supabase.js";

const app = express();
app.use(express.json());


app.use(cors({
  origin: "https://cadastro-de-users.onrender.com",
  methods: ["GET", "POST", "DELETE"], // métodos que você quer liberar
  allowedHeaders: ["Content-Type", "Authorization"], // cabeçalhos permitidos
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
});

app.get("/", (req, res) => {
  res.send("servidor rodando muito bem");
});

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "Preencha todos os campos" });

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password_hash }])
    .select()
    .single();

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({
    id: data.id,
    name: data.name,
    email: data.email,
    created_at: data.created_at,
  });
});

app.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, created_at");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from("users")
    .delete()
    .eq("id", id)
    .select();

  if (error) return res.status(400).json({ error: error.message });
  if (!data.length)
    return res.status(404).json({ error: "Usuário Não Encontrado" });

  res.json({ message: "Usuário deletado", deletedUser: data[0] });
});

app.get("/test-supabase", async (req, res) => {
  const { data, error } = await supabase.from("users").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(5500, () => {
  console.log("http://localhost:5500");
});
