const express = require("express");
const path = require("path");
const { exit } = require("process");
const sqlite = require("sqlite3");

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

const db = new sqlite.Database('./db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run(`CREATE TABLE IF NOT EXISTS topics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  category INTEGER NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author TEXT NOT NULL,
  content TEXT,
  topic INTEGER NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run("INSERT INTO categories (name, description) VALUES ('Announcements', 'Announcements from the Hatch Team.')", (err) => { if (err) { console.error(err.message); } });
db.run("INSERT INTO categories (name, description) VALUES ('Suggestions', 'Suggestions for feature additions to Hatch.')", (err) => { if (err) { console.error(err.message); } });
db.run("INSERT INTO categories (name, description) VALUES ('Questions about Hatch', 'General questions about Hatch.')", (err) => { if (err) { console.error(err.message); } });
db.run("INSERT INTO categories (name, description) VALUES ('Project Help', 'Need help with a project? Ask for help here.')", (err) => { if (err) { console.error(err.message); } });
db.run("INSERT INTO categories (name, description) VALUES ('Bug Reports', 'Report bugs found on Hatch here.')", (err) => { if (err) { console.error(err.message); } });

db.run("INSERT INTO topics (name, author, category) VALUES ('Hello, World!!', 'rayne', 1)", (err) => { if (err) { console.error(err.message); } });
db.run("INSERT INTO topics (name, author, category) VALUES ('meow', 'rayne', 3)", (err) => { if (err) { console.error(err.message); } });

db.run("INSERT INTO posts (author, content, topic) VALUES ('rayne', 'hello world!!!!! ^w^', 1)", (err) => { if (err) { console.error(err.message); } });

app.use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/category/:category", (req, res) => {
  db.get("SELECT * FROM categories WHERE id = ?", [req.params.category], (err, row) => {
    db.all("SELECT * FROM topics WHERE category = ?", [req.params.category], (err, topics) => {
      res.render("category", {
        category: row,
        topics: topics
      });
    });
  });
});

app.get("/topic/:topic", (req, res) => {
  db.get("SELECT * FROM topics WHERE id = ?", [req.params.topic], (err, row) => {
    db.all("SELECT * FROM posts WHERE topic = ?", [req.params.topic], (err, posts) => {
      res.render("topic", {
        topic: row,
        posts: posts
      });
    });
  });
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
})