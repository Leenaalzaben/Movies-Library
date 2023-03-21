'use strict';
// Create a basic server with a route that returns a response
// express :is a framework 
const express = require("express");
const app = express();
const cors= require('cors');
const MoviesData = require('./data.json')
const PORT = 8080;
app.use(cors());

//Routes 
app.get("/", HANDLER);
app.get("/favorite", HANDLERTWO);
app.get('*',HandlerNotFoundError);
//app.get(the name of my PATH.endpoint , typr any thing HANDLER)
// app.get("/",(req,res)=>{
//     res.send("Hello world");
// })


// functions
function HANDLER(req, res) {
    let newData = new Info(MoviesData.title, MoviesData.poster_path, MoviesData.overview);
    res.json(newData);

}
function HANDLERTWO(req, res) {
    res.send("Welcome to Favorite Page");
}
function HandlerNotFoundError(req,res){
    res.send("Not Found");
}






// My constructor
function Info(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

};
// Run server and make it listening all the time
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



