const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 4040;
const mainDir = path.join(__dirname, "/public");

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDir, "notes.html"));
});

app.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.get("/api/notes/:id", function(req, res) {
    let notesSaved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(notesSaved[Number(req.params.id)]);
});

app.get("*", function(req, res) {
    res.sendFile(path.join(mainDir, "index.html"));
});

app.post("/api/notes", function(req, res) {
    let notesSaved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteNew = req.body;
    let uniqueID = (notesSaved.length).toString();
    noteNew.id = uniqueID;
    notesSaved.push(noteNew);

    fs.writeFileSync("./db/db.json", JSON.stringify(notesSaved));
    console.log("Saved Note: ", noteNew);
    res.json(notesSaved);
})

app.delete("/api/notes/:id", function(req, res) {
    let notesSaved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = req.params.id;
    let newID = 0;
    console.log(`deleting note ${noteID}`);
    notesSaved = notesSaved.filter(currNote => {
        return currNote.id != noteID;
    })
    
    for (currNote of notesSaved) {
        currNote.id = newID.toString();
        newID++;
    }

    fs.writeFileSync("./db/db.json", JSON.stringify(notesSaved));
    res.json(notesSaved);
})

app.listen(port, function() {
    console.log(`Now on  ${port}. Welcome!`);
})