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

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

function handleGetMovie(req, res) {
    const { genre, country, avg_vote } = req.query;

    if(avg_vote && genre && country) {
        const avg_voteNum = parseFloat(avg_vote)
        if(Number.isNaN(avg_voteNum)) {
            res.status(400).send('please provide a numeric value for avg_vote parameter');
        }

        const response = MOVIEDEX
              .filter(movie => { return movie.avg_vote >= avg_voteNum 
            }).filter(movie => { return (movie.genre.toLowerCase()).includes(genre.toLowerCase())
            }).filter(movie => { return (movie.country.toLowerCase()).includes(country.toLowerCase())
            }) 
        
        if(response.length === 0) {
            res.status(400).send('no movies with that avg_vote, try again')
        }
        return res.status(200).json(response)
    }
    if(genre) {
        const response = MOVIEDEX.filter(movie =>
            (movie.genre.toLowerCase()).includes(genre.toLowerCase()))

        if(response.length === 0) {
            res.status(400).send('invalid genre, try again');
        }
        return res.status(200).json(response)
    }
    if(country) {
        const response = MOVIEDEX.filter(movie => 
            (movie.country.toLowerCase()).includes(country.toLowerCase()));
        if(response.length === 0) {
            res.status(400).send('invalid country, try again')
        }
        return res.status(200).json(response)
    }
    if(avg_vote) {
        const avg_voteNum = parseFloat(avg_vote)

        if(Number.isNaN(avg_voteNum)) {
            res.status(400).send('please provide a numeric value for avg_vote parameter');
        }
        const response = MOVIEDEX.filter(movie =>  movie.avg_vote >= avg_voteNum)
        if(response.length === 0) {
            res.status(400).send('no movies with that avg_vote, try again')
        }
        const sortedResponse = response.sort((a, b) => {
          return a[avg_voteNum] > b[avg_voteNum] ? 1 : a[avg_voteNum] < b[avg_voteNum] ? -1 : 0;
        })
        
        return res.status(200).json(sortedResponse);
    }

    res.status(200).json(MOVIEDEX);
}

app.get('/movie', handleGetMovie);

module.exports = app;