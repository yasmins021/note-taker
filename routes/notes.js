const notes = require('express').Router();
const fs = require('fs');
const util = require('util');


// Helper functions
const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}\n`)
  );

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeToFile(file, parsedData);
      }
    });
};

// This code block populates the noteIdArr with the prexisting note ids found in the db.json file
let noteIdArr = [];
fs.readFile('./db/db.json', 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }
  const noteData = JSON.parse(data);
  for (let i = 0; i < noteData.length; i++) {
    noteIdArr.push(noteData[i].id);
  }
});

// creatId() function creates and returns a unique id
// also adds the unique id to the noteIdArr
const createId = () => {
  let noteId = Math.floor(Math.random() * 99) + 1;
  if (noteIdArr.length === 0) {
    noteIdArr.push(noteId);
  } else {
    for (let i = 0; i < noteIdArr.length; i++) {
      if (noteIdArr[i] === noteId) {
        noteId = Math.floor(Math.random() * 99) + 1;
        i = 0;
      }
    }
    noteIdArr.push(noteId);
  }
  return noteIdArr[noteIdArr.length - 1];
};

// Finds the specific note to remove, removes it, and rewrites the information to the json file
const removeNote = (noteId, noteData) => {
  for (let i = 0; i < noteData.length; i++) {
    if (noteData[i].id == noteId) {
      console.log('Deleting note:');
      console.log(noteData[i]);
      noteData.splice(i, 1);
    }
  }
  writeToFile('./db/db.json', noteData);
};

// notes get route

notes.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

// notes post route
notes.post('/notes', (req, res) => {

    console.log(req.body);

    req.body.id = createId();

    const { title, text, id } = req.body;

    if (req.body) {
        const newNote = {
        title,
        text,
        id
        };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully`);
  } else {
    res.errored('Error in adding note');
  }
});

// notes delete route
notes.delete('/notes/:id', async (req, res) => {
  const { id } = req.params;
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const noteData = JSON.parse(data);
    removeNote(id, noteData);
  });
  res.json('Note deleted successfully')
});

module.exports = notes;