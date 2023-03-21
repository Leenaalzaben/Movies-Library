'use strict';
// Create a basic server with a route that returns a response
// express :is a framework 
const express = require("express");
const app = express();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const MoviesData = require('./data.json')
// 5344c96d797be3ae007ed55de899a943
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
// notice to use all apps after declration ,where the app here is express which bulid the server
app.use(cors());

//Routes 
app.get("/", HANDLER);
app.get("/favorite", HANDLERTWO);
app.get('/trending', trendingHandler);
app.get("/search", searchHandler);
// app.get("/watchlists", watchlists);
// app.get("/newTrendList",newTrendList);
app.get('*', HandlerNotFoundError);

//app.get(the name of my PATH.endpoint , typr any thing HANDLER)
// app.get("/",(req,res)=>{
//     res.send("Hello world");
// })


// functions
function HANDLER(req, res) {
    let newData = new movieInfo(MoviesData.title, MoviesData.poster_path, MoviesData.overview);
    res.json(newData);

}
function HANDLERTWO(req, res) {

    res.send("Welcome to Favorite Page");
}
// 

function trendingHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
    axios.get(url)
        .then(response => {
            let dataMovies = result.data.map((Movie) => {
                return new movieMoreInfo(Movie.id, Movie.title, Movie.release_date, Movie.poster_path, Movie.overview);
            })
            console.log(response);
            res.json(dataMovies);
        })
        .catch((error) => {
            console.log(error);
        })

}

function searchHandler(res, req) {
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            console.log(result);
            // res.json(result);
        })
        .catch((error) => {
            console.log(error);
        })



}

// function watchlists(req, res) {



// }
// function newTrendList(req,res){


// }


function HandlerNotFoundError(req, res) {
    res.status(404).send("Not Found");
}


// My constructor
function movieInfo(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

};
// my constructor II
function movieMoreInfo(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

};
// Run server and make it listening all the time
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



