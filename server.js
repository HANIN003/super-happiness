const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
const notes = require("./db/db.json");

// Routes
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf8", function (err, data) {
    if (err) {
      console.log(err);
      return;
    }
    res.json(notes);
  });
});

// Create new note
app.post("/api/notes", (req, res) => {
  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };
  console.log(typeof notes);
  notes.push(newNote);
  const stringifyNote = JSON.stringify(notes);
  res.json(notes);
  fs.writeFile("db/db.json", stringifyNote, (err) => {
    if (err) console.log(err);
    else {
      console.log("Note successfully saved to db.json");
    }
  });
});

// Delete note
app.delete("/api/notes/:id", (req, res) => {
  let noteID = req.params.id;
  fs.readFile("db/db.json", "utf8", function (err, data) {
    let updatedNotes = JSON.parse(data).filter((note) => {
      console.log("note.id", note.id);
      console.log("noteID", noteID);
      return note.id !== noteID;
    });
    notes = updatedNotes;
    const stringifyNote = JSON.stringify(updatedNotes);
    fs.writeFile("db/db.json", stringifyNote, (err) => {
      if (err) console.log(err);
      else {
        console.log("Note successfully deleted from db.json");
      }
    });
    res.json(stringifyNote);
  });
});

// Catch all error route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
