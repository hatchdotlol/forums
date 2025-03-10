const version = "2.0.1";

const express = require("express");
const path = require("path");
const sqlite = require("sqlite3");
const bodyParser = require("body-parser");

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8000;

const db = new sqlite.Database("./db.db", (err) => {
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
  topic INTEGER NOT NULL,
  timestamp INTEGER NOT NULL
)`, (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.run(`CREATE TABLE IF NOT EXISTS reactions (
  author TEXT NOT NULL,
  type INTEGER NOT NULL,
  post INTEGER NOT NULL
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
  res.render("index", {
    version: version
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/category/:category", (req, res) => {
  db.get("SELECT * FROM categories WHERE id = ?", [req.params.category], (err, row) => {
    if (row === undefined) {
      res.status(404).render("404");
    }
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
    if (row === undefined) {
      res.status(404).render("404");
    }
    res.render("new_topic", {
      category: row
    });
  });
});

app.get("/topic/:topic", (req, res) => {
  db.get("SELECT * FROM topics WHERE id = ?", [req.params.topic], (err, topic) => {
    if (topic === undefined) {
      res.status(404).render("404");
    }
    db.all("SELECT * FROM posts WHERE topic = ?", [req.params.topic], async (err, posts) => {
      let get_reactions = (post) => new Promise((resolve) => {
        db.all("SELECT * FROM reactions WHERE post = ?", [post.id], function(err, reactions) {
          resolve(reactions);
        });
      });
      let post_reactions = await Promise.all(posts.map(post => get_reactions(post)));

      let get_post_counts = (post) => new Promise((resolve) => {
        db.get("SELECT COUNT(*) FROM posts WHERE author = ?", [post.author], (err, count) => {
          if (!err) {
            resolve(count["COUNT(*)"]);
          }
        });
      });
      let post_count = await Promise.all(posts.map(post => get_post_counts(post)));

      res.render("topic", {
        topic: topic,
        posts: posts,
        reactions: post_reactions,
        post_count: post_count
      });

    });
  });
});

app.get("/*", (req, res) => {
  res.status(404).render("404");
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
        if (req.body.category === "1" && !data.hatchTeam) {
          return;
        }
        db.get("SELECT COUNT(*) FROM topics", (err, count) => {
          if (err) { console.error(err.message); }

          let content = req.body.content;
          if (req.body.category === "5") {
            content = `User agent: ${req.headers["user-agent"]}\n\n${req.body.content}`;
          }

          db.run("INSERT INTO topics (name, author, category, pinned) VALUES (?, ?, ?, false)", [req.body.title, data.name, req.body.category], (err) => { if (err) { console.error(err.message); } });
          db.run("INSERT INTO posts (author, content, topic, timestamp) VALUES (?, ?, ?, ?)", [data.name, content, count["COUNT(*)"]+1, Date.now()], (err) => { if (err) { console.error(err.message); } });
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
        db.run("INSERT INTO posts (author, content, topic, timestamp) VALUES (?, ?, ?, ?)", [data.name, req.body.content, req.body.topic, Date.now()], (err) => { if (err) { console.error(err.message); } });
      });
    }
  });
});

app.post("/api/new/reaction", (req, res) => {
  let post_reaction = parseInt(req.body.reaction);
  if (post_reaction < 0 || post_reaction > 5) {
    res.sendStatus(400);
    return;
  }
  fetch("https://api.hatch.lol/auth/me", {
    headers: {
      "Token": req.header("Token")
    }
  }).then(fres => {
    if (fres.status === 200) {
      fres.json().then(data => {
        db.get("SELECT * FROM reactions WHERE author = ? AND type = ? AND post = ?", [data.name, req.body.reaction, req.body.post], (err, reaction) => {
          if (err) {
            res.sendStatus(500);
            console.error(err.message);
            return;
          }
          if (reaction) {
            db.run("DELETE FROM reactions WHERE author = ? AND type = ? AND post = ?", [data.name, req.body.reaction, req.body.post], (err) => { if (err) { res.sendStatus(500); console.error(err.message); return; } });
          } else {
            db.run("INSERT INTO reactions (author, type, post) VALUES (?, ?, ?)", [data.name, post_reaction, req.body.post], (err) => { if (err) { res.sendStatus(500); console.error(err.message); return; } })
          }
          res.sendStatus(200);
        });
      });
    } else {
      res.sendStatus(fres.status);
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
