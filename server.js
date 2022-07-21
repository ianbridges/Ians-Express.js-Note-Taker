const fs = require('fs');
const path = require('path');

const express = require('require');
const PORT = process.env.PORT || 443;

const app = express();
var { notes } = require('./Develop/db/db.json');
const { networkInterfaces } = require('os');

app.use(express.static('Develop/public'));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());










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

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './Develop/public/notes.html'));
});

app.listen(PORT, () => {
    console.log('API server now on port ${PORT}!');
});