const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Define file paths for words
const verbFilePath = path.join(__dirname, 'verbs.txt');
const nounFilePath = path.join(__dirname, 'nouns.txt');
const adjectiveFilePath = path.join(__dirname, 'adjectives.txt');

// Define the allowed origins (replace '*' with your client's actual origin)
const allowedOrigins = ['http://example.com', 'http://localhost:3000', 'http://localhost:5500', 'http://127.0.0.1:5500']; 

// Configure CORS with specific options
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
  }
};

// Enable CORS with specific options
app.use(cors(corsOptions));

// Cache for storing word lists
let wordLists = {
    verbs: [],
    nouns: [],
    adjectives: []
};

// Preload and cache word lists when the server starts up
fs.readFile(verbFilePath, 'utf8', (err, verbsData) => {
    if (err) {
        console.error(err);
        return;
    }
    wordLists.verbs = verbsData.trim().split('\n');
});

fs.readFile(nounFilePath, 'utf8', (err, nounsData) => {
    if (err) {
        console.error(err);
        return;
    }
    wordLists.nouns = nounsData.trim().split('\n');
});

fs.readFile(adjectiveFilePath, 'utf8', (err, adjectivesData) => {
    if (err) {
        console.error(err);
        return;
    }
    wordLists.adjectives = adjectivesData.trim().split('\n');
});

// API endpoint for word classification
app.get('/api/classify', (req, res) => {
    const word = req.query.word.toLowerCase(); // Convert word to lowercase for case-insensitive matching
    let classification = null;

    // Check if the word exists in any of the preloaded lists
    if (wordLists.adjectives.includes(word)) {
        classification = "adjective";
    } else if (wordLists.verbs.includes(word)) {
        classification = "verb";
    } else if (wordLists.nouns.includes(word)) {
        classification = "noun";
    }

    res.json(classification);
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
