const mongoose = require('mongoose');
const { Schema } = mongoose;
const NotesSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    sender : {
        type : String,
        required : true,
        // unique : true
    },
    reciever : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        default : "General"
    },
    date : {
        type : Date,
        default : Date.now
    },

})

module.exports = mongoose.model('notes',NotesSchema);