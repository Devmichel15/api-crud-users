import express from "express";
import users from "./data.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${new Date().toISOString()}`);
  next();
});

app.get("/", (req, res) => {
  res.send("servidor rodando muito bem");
});

app.get("/users", (req, res) => {
  res.send(users);
});

app.post("/users", (req, res) => {
    const newUser = req.body;
    users.push(newUser);
    res.status(201).send(newUser);
});

app.delete("/users/:id", (req, res) => {
  const userId = Number(req.params.id);
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return res.status(404).json({ message: "Usuário não encontrado" });

  const deletedUser = users.splice(index, 1); // remove do array
  res.json({ message: "Usuário deletado", deletedUser });
});


app.listen(5500, () => {
  console.log("http://localhost:5500");
});
