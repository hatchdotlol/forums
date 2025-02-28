const express = require("express");
const path = require("path");
const sqlite = require("sqlite3");
const bodyParser = require("body-parser");
const requestIP = require("request-ip");

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 3000;

const db = new sqlite.Database('./db.db', (err) => {
  if (err) {
    console.error(err.message);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
  category INTEGER NOT NULL,
  pinned BOOLEAN NOT NULL
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

// db.run("INSERT INTO categories (name, description) VALUES ('Announcements', 'Announcements from the Hatch Team.')", (err) => { if (err) { console.error(err.message); } });
// db.run("INSERT INTO categories (name, description) VALUES ('Suggestions', 'Suggestions for feature additions to Hatch.')", (err) => { if (err) { console.error(err.message); } });
// db.run("INSERT INTO categories (name, description) VALUES ('Questions about Hatch', 'General questions about Hatch.')", (err) => { if (err) { console.error(err.message); } });
// db.run("INSERT INTO categories (name, description) VALUES ('Project Help', 'Need help with a project? Ask for help here.')", (err) => { if (err) { console.error(err.message); } });
// db.run("INSERT INTO categories (name, description) VALUES ('Bug Reports', 'Report bugs found on Hatch here.')", (err) => { if (err) { console.error(err.message); } });
// db.run("INSERT INTO categories (name, description) VALUES ('Show and Tell', 'Show off your creations here!')", (err) => { if (err) { console.error(err.message); } });

app.use(express.static(path.join(__dirname, "public")))
  .set("views", path.join(__dirname, "views"))
  .set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
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

app.get("/category/:category/new", (req, res) => {
  db.get("SELECT * FROM categories WHERE id = ?", [req.params.category], (err, row) => {
    res.render("new_topic", {
      category: row
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

app.post("/api/new/topic", (req, res) => {
  fetch("https://api.hatch.lol/auth/me", {
    headers: {
      "Token": req.header("Token")
    }
  }).then(fres => {
    if (req.body.content.length > 8000 || req.body.content.trim().length < 1 || req.body.title.length > 100 || req.body.title.trim().length < 1) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(fres.status);
    if (fres.status === 200) {
      fres.json().then(data => {
        if (req.body.category === 1 && !data.hatchTeam) {
          return;
        }
        db.get("SELECT COUNT(*) FROM topics", (err, count) => {
          if (err) { console.error(err.message); }
          db.run("INSERT INTO topics (name, author, category, pinned) VALUES (?, ?, ?, false)", [req.body.title, data.name, req.body.category], (err) => { if (err) { console.error(err.message); } });
          db.run("INSERT INTO posts (author, content, topic) VALUES (?, ?, ?)", [data.name, req.body.content, count["COUNT(*)"]+1], (err) => { if (err) { console.error(err.message); } });
        });
      });
    }
  });
});

app.post("/api/new/post", (req, res) => {
  fetch("https://api.hatch.lol/auth/me", {
    headers: {
      "Token": req.header("Token")
    }
  }).then(fres => {
    if (req.body.content.length > 8000 || req.body.content.length < 1) {
      res.sendStatus(400);
      return;
    }
    res.sendStatus(fres.status);
    if (fres.status === 200) {
      fres.json().then(data => {
        db.run("INSERT INTO posts (author, content, topic) VALUES (?, ?, ?)", [data.name, req.body.content, req.body.topic], (err) => { if (err) { console.error(err.message); } });
      });
    }
  });
});

app.post("/api/pin/topic", (req, res) => {
  fetch("https://api.hatch.lol/auth/me", {
    headers: {
      "Token": req.header("Token")
    }
  }).then(fres => {
    if (fres.status === 200) {
      fres.json().then(data => {
        if (!data.hatchTeam) {
          res.sendStatus(403);
          return;
        }
        db.get("SELECT * FROM topics WHERE id = ?", [req.body.id], (err, topic) => {
          if (err) {
            res.sendStatus(500);
            console.error(err.message);
            return;
          }
          db.run("UPDATE topics SET pinned = ? WHERE id = ?", [!topic.pinned, req.body.id], (err) => {
            if (err) {
              res.sendStatus(500);
              console.error(err.message);
              return;
            }
          });
          res.sendStatus(200);
        });
      });
    } else {
      res.sendStatus(fres.status);
    }
  });
});

app.listen(port, () => {
  console.log(`listening on http://localhost:${port}`);
});
