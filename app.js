require('dotenv').config();
const MOVIEDEX = require('./movies-data-small.json');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());



function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query;
    if(genre) {
        
    }
    if(country) {

    }
    if(avg_vote) {

    }

    res.status(200).send(MOVIEDEX)
}

app.get('/movie', handleGetMovie);

module.exports = app;