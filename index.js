const connectToMongo = require('./db')
var cors = require('cors')
const express = require('express')

connectToMongo();
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())

//Routes 


app.use('/api1/auth',require('./routes/auth'))
app.use('/api1/withdrawdetails',require('./routes/withdrawdetails'))



app.listen(port, () => {
    console.log(`App listening at  http://localhost:${port}`)
    
  })