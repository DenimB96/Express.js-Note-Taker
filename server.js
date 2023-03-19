const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "Develop/public")));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/Develop/public/index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/Develop/public/notes.html"));
});

// API routes
app.get("/api/notes", (req, res) => {
  const notesData = fs.readFileSync(
    path.join(__dirname, "/Develop/db/db.json")
  );
  const notes = JSON.parse(notesData);
  res.json(notes);
});
// Posting new notes
app.post("/api/notes", (req, res) => {
  const notesData = fs.readFileSync(
    path.join(__dirname, "/Develop/db/db.json")
  );
  const notes = JSON.parse(notesData);

  const newNote = {
    id: uuidv4(),
    title: req.body.title,
    text: req.body.text,
  };

  notes.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "/Develop/db/db.json"),
    JSON.stringify(notes)
  );
  res.json(newNote);
});
// Delete function
app.delete("/api/notes/:id", (req, res) => {
  const notesData = fs.readFileSync(
    path.join(__dirname, "/Develop/db/db.json")
  );
  let notes = JSON.parse(notesData);

  const noteId = req.params.id;

  notes = notes.filter((note) => note.id !== noteId);

  fs.writeFileSync(
    path.join(__dirname, "/Develop/db/db.json"),
    JSON.stringify(notes)
  );

  res.json({ message: "Note deleted" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
