const fs = require('fs');
const path = require('path');

const express = require('express');
const PORT = process.env.PORT || 443;

const app = express();
var { notes } = require('./Develop/db/db.json');
console.log("this" + (notes))
const { networkInterfaces } = require('os');

app.use(express.static('Develop/public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


function createNewNote(body, notesArray) {
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify({ notes: notesArray }, null, 2)
    );
    return notes;
}

function validateNote(note) {
    if (!note.title || typeof note.title !== 'string') {
        return false;
    }
    if (!note.text || typeof note.text !== 'string') {
        return false;
    }
    return true;
}

function deleteNote(id, notesArray) {
    notesArray = notes.filter(note => note.id != id);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify ({ notes: notesArray }, null, 2)
    );
    notes = notesArray;
    return notes;
}


app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    req.body.id = notes.length;
    if (!validateNote(req.body)) {
        res.status(400).send('Fix note format')
    } else {
        createNewNote(req.body, notes);
        res.json(req.body);
    }
});

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, notes)
    res.json(notes);
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.listen(PORT, () => {
    console.log('API server now on port ${PORT}!');
});