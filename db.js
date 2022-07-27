const mongoose = require('mongoose')
// const mongoURI = "mongodb://localhost:27017/newdatabaseuser"
//Atlas DATABASE
const DB = 'mongodb+srv://atishayjain:Atishay%40123@cluster0.nrueh.mongodb.net/backend1?retryWrites=true&w=majority'

const connectToMongo = () =>{
    mongoose.connect(DB).then(()=>{
        console.log("connected to mongo cloud")
    }).catch((err) => console.log(err))
}

module.exports = connectToMongo