'use strict';
// Create a basic server with a route that returns a response
// express :is a framework 
const express = require("express");
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const MoviesData = require('./Movie Data/data.json');
const { json } = require('express');
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
// notice to use all apps after declration ,where the app here is express which bulid the server
const app = express();
app.use(cors());

//Routes 
app.get("/", homeHandler);
app.get("/favorite", favoriteHandler);
app.get('/trending', trendingHandler);
app.get("/search", searchHandler);
app.get("/popular", popularHandler);
app.get("/overview", overview);
app.get('*', HandlerNotFoundError);



// functions
//1. Home
function homeHandler(req, res) {
    let newData = new movieInfo(MoviesData.title, MoviesData.poster_path, MoviesData.overview);
    res.json(newData);

}
//2. favorite
function favoriteHandler(req, res) {

    res.send("Welcome to Favorite Page");
}
//3. trending 

function trendingHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            let trendDataMovies = result.data.results.map((Movie) => {

                return new trendMovie(Movie.id, Movie.title, Movie.release_date, Movie.poster_path, Movie.overview);

            })
            res.json(trendDataMovies);
        })
        .catch((error) => {
            console.log(error);
        })

}

function searchHandler(req, res) {
    let clientQuery = req.query.title;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${clientQuery}&page=2`
    axios.get(url)
        .then((result) => {
            let searchDataMovies = result.data.results.map((Movie) => {
                return new movieInfo(Movie.title, Movie.poster_path, Movie.overview);
            })
            res.json(searchDataMovies);
        })
        .catch((error) => {
            console.log(error);
        })


}



function popularHandler(req, res) {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then((result) => {
            let popularMovies = result.data.results.map((Movie) => {
                return new popular(Movie.title, Movie.overview, Movie.release_date, Movie.vote);
            })
            res.json(popularMovies);

        })
        .catch((error) => {
            console.log(error);
        })

}

function overview(req, res) {
    const endpoint = 'https://api.themoviedb.org/3/movie/top_rated';
    const url = `${endpoint}?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            let overView = result.data.results.map((Movie) => {
                return new topShow(Movie.name, Movie.lang, Movie.overview, Movie.vote);
            })
            res.json(overView);

        })
        .catch((error) => {
            console.log(error);
        })



}


function HandlerNotFoundError(req, res) {
    res.status(404).send("Not Found");
}
app.use(function (error, req, res, next) {
    console.error(error.stack);
    res.status(500).send({
        status: 500,
        ResponseText: 'Something Error'
    });


});


// My constructor
function movieInfo(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

};
// my constructor II(

function trendMovie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

}

// my constructor III(search) vote
function popular(title, overview, release_date, vote) {
    this.title = title;
    this.overview = overview;
    this.release_date = release_date;
    this.vote = vote;
};
function topShow(name, lang, overview, vote) {
    this.name = name;
    this.lang = lang;
    this.overview = overview;
    this.vote = vote;


}


// Run server and make it listening all the time
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



