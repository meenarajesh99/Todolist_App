 const mongoose = require('mongoose');

/* create the schema */
const todoListSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },

    content: {
        type: String,
        required: true
    },

    


});

const TodoItem = mongoose.model('TodoItem', todoListSchema);

module.exports =  TodoItem; 
