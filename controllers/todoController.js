const bodyParser = require('body-parser');

const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://test:test@ds137441.mlab.com:37441/todo-cyrill');

// Create a schema
const todoSchema = new mongoose.Schema({
   item: String 
});

const Todo = mongoose.model('Todo', todoSchema);
/*var itemOne = Todo({item: 'buy flowers'}).save(function(err){
    if (err) throw err;
    console.log('item saved');
});*/

//var data = [{item: 'get milk'}, {item: 'walk dog'}];

const urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports = (app) => {
    app.get('/todo', (req, res) => {
        // Get data from mongoDB & pass it to view
        Todo.find({}, (err, data) => {
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });
    
    app.post('/todo', urlencodedParser, (req, res) => {
        // Get data from the view & add it to mongoDB
        const newTodo = Todo(req.body).save((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });
    
    app.delete('/todo/:item', (req, res) => {
        // Delete the requested item from mongoDB
        Todo.find({item: req.params.item.replace(/\-/g, ' ')}).remove((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });
};