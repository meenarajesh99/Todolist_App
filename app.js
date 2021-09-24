const express = require('express');
const mongoose = require('mongoose');



/* Mongoose model */
const TodoItem = require('./api/models/todoItem');

const TODOLIST = require('./test/data/todoList')
const cors = require('cors');

/* create and configure database */
const DB_NAME = 'todoApp';
const DB_URL = `mongodb://localhost:27017/${DB_NAME}`;
console.log('MongoDB: Attempting to connect');


mongoose
  .connect(DB_URL)
  .then(()=> console.log('Connected to MongoDB ${DB_URL}'))
  .catch(error => console.log(`Failed to connectto DB: ${error}`));


   TODOLIST.forEach(item =>{
      const itemModel = new TodoItem({name: item.name, content: item.content});

      itemModel
      .save()
      .catch(error => {
          console.log(`MongoDB: ERROR saving todoItem ${error}`);
      })

  });




  const PORT = 8888; 
  /* Create express server for our API */
  const app = express();

  /* Parse json in request body for POST, PUT */
  app.use(express.json());

  
  app.use(cors());

  /* Create routes for our express server */

  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}, params: ${req.params}`);
    if (req.body) {
      console.log(JSON.stringify(req.body));
    }
    next();
  })

 // get the todoitems
app.get('/todoitems', (req, res) => {
  TodoItem
    .find()
    .then(todoitems => {
      console.log('Todoitems ', todoitems);
      res.send(todoitems);
    })
    .catch(error => res.status(400).send(`Unable to get notes. Error: ${error}`));
})


// Get the todoitem by id
app.get('/todoitem/:id', (req, res) => {
  const id = req.params.id;
  console.log('todoitem id ', id);
  TodoItem
    .findById(id)
    .then(todoitem => {
      console.log('todoitem ', todoitem);
      res.send(todoitem);
    })
    .catch(error => res.status(400).send(`Error on ${req.method} ${req.path}: ${error}`));
})


//Create new todoitem
app.post('/todoitem', (req, res) => {
  const body = req.body;

  if(!body || !body.content) {
    res
      .status(400)
      .send(`Error, malformed POST body: ${JSON.stringify(body)}`)
  }

  const newToDo = new TodoItem({ name: body.name, content: body.content });

  newToDo
    .save()
    .then(data => res.send('Todo created, ' + JSON.stringify(data)))
    .catch(error => {
      res
        .status(400)
        .send(`Error - unable to create todoitem: ${error}`);
    });
});


//Updating todoitem
app.put('/todoitem/:id', (req, res) => {
  const body = req.body;
  const id = req.params.id;

  if (!body || !body.content) {
    res
      .status(400)  
      .send(`Error, bad body: ${body}`);
  }
  TodoItem
      .findById(id)
      .then(todoitem => {
      todoitem.content = body.content;
      todoitem
      .save()
      .then(data => res.send(`${data}`));
  })
  .catch(error => res.status(400).send(`Error updating: ${error}`));
});


//Deleting todoitem
  app.delete('/todoitem/:id', (req, res) => {
    const id = req.params.id;
    console.log('todoitem id ', id);
    TodoItem
      .findByIdAndDelete(id)
      .then(msg => res.send(`Successfully deleted ${msg}`))
      .catch(error => res.status(400).send(`Error deleting ${error}`));
  });

  app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
  })


  
