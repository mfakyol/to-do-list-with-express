const express = require("express");
const ToDoService = require("./services/to-do-service");
const Todo = require("./models/Todo");
const bodyParser = require("body-parser");
const open = require("open");

var app = express();
app.use(bodyParser.json());
app.use("/statics", express.static("statics"));
const port = 3000;

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/todos", async (req, res, next) => {
  const todos = await ToDoService.findAll();
  res.send(todos);
});

app.post("/todo", async (req, res, next) => {
  const todo = await ToDoService.add(req.body);
  console.log(todo);
  res.send(todo);
});

app.put("/todo", async (req, res, next) => {
  res.send(await ToDoService.update(req.body));
});

app.delete("/todo", async (req, res, next) => {
  res.send(await ToDoService.delete(req.body.id));
});

app.listen(port, () => {
  console.log("sever started link => http://localhost:3000 ");
  open('http://localhost:3000/');
});
