const express = require("express");
const mongo = require("mongodb");
const path = require("path");

const client = new mongo.MongoClient(
  "mongodb+srv://admin:LmLGdKsWKZJ1EMpj@mycluster-05qfh.mongodb.net/test?retryWrites=true",
  {
    useNewUrlParser: true
  }
);

const app = express();
app.use(express.static(path.join(__dirname, "public")));

app.listen(3001, () => {
  console.log("Server is listening at http://localhost:3001");
});

client.connect(err => {
  if (err) console.log("Connection failed");
  else console.log("Connected to the database!");

  const db = client.db("ToDoApp");
  const tasks = db.collection("tasks");

  app.get("/getTasks", (req, res) => {
    let completedTasks = 0;
    let data = {};

    tasksInfo = db.collection("tasksInfo");
    tasksInfo.findOne({ info: "tasksCompleted" }, (err, data) => {
      completedTasks = data.number;
    });

    tasks.find({}).toArray((err, data) => {
      data = data;
      res.json({ data, completedTasks });
    });
  });

  app.post("/delete/:id", (req, res) => {
    const id = req.params.id;

    tasks.deleteOne({ _id: mongo.ObjectID(id) }, err => {
      tasks.find({}).toArray((err, data) => {
        res.json(data);
      });
    });
  });

  app.post("/complete/:id", (req, res) => {
    const id = req.params.id;
    tasks.deleteOne({ _id: mongo.ObjectID(id) });

    const tasksInfo = db.collection("tasksInfo");
    let completedTasks = 0;
    tasksInfo.find({ info: "tasksCompleted" }).toArray((err, data) => {
      completedTasks = data[0].number + 1;
      tasksInfo.updateOne(
        { info: "tasksCompleted" },
        { $set: { number: completedTasks } }
      );

      tasks.find({}).toArray((err, data) => {
        res.json({ data, completedTasks });
      });
    });
  });

  app.post("/:name/:importance", (req, res) => {
    const { name, importance } = req.params;

    const date = new Date();
    const time = `${date.getDate()}.${date.getMonth()} ${date.getHours()}:${date.getMinutes()}`;

    tasks.insertOne({ time, name, importance }, err => {
      if (err) console.log("Cannot add to database!");
      else console.log("Added to database successfully");

      tasks.find({}).toArray((err, data) => {
        res.json(data);
      });
    });
  });
});
