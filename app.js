require('dotenv').config();
const MOVIEDEX = require('./movies-data-small.json');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
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
  let response = MOVIEDEX;

  function notANumber(num) {
      if (Number.isNaN(num)) {
          res.status(400).send('please provide a numeric value for avg_vote parameter');
      }
  }
          
  if (genre) {
    response = response.filter(movie => (movie.genre.toLowerCase()).includes(genre.toLowerCase()))
  } 
  if(country) {
    response = response.filter(movie => (movie.country.toLowerCase()).includes(country.toLowerCase()));
  } 
            
  if (avg_vote) {
    const avg_vote_float = parseFloat(avg_vote)
    notANumber(avg_vote_float);

    response = response.filter(movie =>  movie.avg_vote >= avg_vote_float)
                        .sort((a, b) => {
                          return a.avg_vote > b.avg_vote ? 1 : a.avg_vote < b.avg_vote ? -1 : 0;
                        })
  } 
    
  if(response.length === 0) {
      res.status(400).send('Oops those movies are not in the db')
  }

  return res.status(200).json(response);
}

app.get('/movie', handleGetMovie);

module.exports = app;