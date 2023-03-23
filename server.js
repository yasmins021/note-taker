const express = require('express');
const path = require('path');
const notes = require('./routes/notes.js');

const PORT = process.env.PORT || 3001;

const app = express();

// Sets up all the necesarry middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', notes);;

app.use(express.static('public'));

// get route for the notes.html file
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// get route for the index.html file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT} 🚀`);
});