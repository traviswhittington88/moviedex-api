const app = require('./app');

app.use((error, req, res, next) => {  
    let response
    if (process.env.NODE_ENV === 'production') {
      response = { error: { message: 'server error' } }
    } else {
      response = { error }
    }
    res.status(500).json(response)
  })
  
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)});