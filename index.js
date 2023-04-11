'use strict';
const express = require("express");
const app = express();
const MoviesData = require('./Movie Data/data.json');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();



const { json } = require('express');
const PORT = process.env.PORT;
const apiKey = process.env.API_KEY;
//postgres://username:password@localhost:5432/databasename
let url = process.env.url;

app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const { Client } = require('pg');
const client = new Client(url);



//Routes 
app.get("/", homeHandler);
app.get("/favorite", favoriteHandler);
app.get('/trending', trendingHandler);
app.get("/search", searchHandler);
app.get("/popular", popularHandler);
app.get("/overview", overview);
// Database  
app.post("/addMovie", addMovieHandler);
app.get("/getMovies", getMoviesHandeler);
app.put('/updateMovie/:id', updateHandler);
app.delete('/deleteMovie/:movieId', deleteHandler);
app.get("/specificMovie/:id", getSpecificMovieHandeler);
app.get('*', HandlerNotFoundError);

// functions
//1. Home
function homeHandler(req, res) {
    let newData = new homePage(MoviesData.title, MoviesData.poster_path, MoviesData.overview);
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
        .catch((err) => {
            console.log(err);
        })

}
//4.search
function searchHandler(req, res) {
    let clientQuery = req.query.title;
    let URL = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${clientQuery}&page=2`
    axios.get(URL)
        .then((result) => {
            let searchDataMovies = result.data.results.map((Movie) => {
                return new searchMovie(Movie.id, Movie.title, Movie.release_date, Movie.poster_path, Movie.overview)

            });
            res.json(searchDataMovies);
        })
        .catch((err) => {
            console.log(err);
        })


}
//5.popular
function popularHandler(req, res) {
    let url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;
    axios.get(url)
        .then((result) => {
            let popularMovies = result.data.results.map((Movie) => {
                return new popular(Movie.title, Movie.overview, Movie.release_date, Movie.vote);
            })
            res.json(popularMovies);

        })
        .catch((err) => {
            console.log(err);
        })

}
//6. overview
function overview(req, res) {
    const endpoint = 'https://api.themoviedb.org/3/movie/top_rated';
    const url = `${endpoint}?api_key=${apiKey}`;
    axios.get(url)
        .then(result => {
            let overView = result.data.results.map((Movie) => {
                return new overViewMovie(Movie.name, Movie.lang, Movie.overview, Movie.vote);
            })
            res.json(overView);

        })
        .catch((err) => {
            console.log(err);
        })



}



// DATABASE Functions
function addMovieHandler(req, res) {
    let { moviename, comment, image } = req.body;
    let sql = `INSERT INTO moviet  (moviename,comment,imageurl) VALUES ($1, $2,$3) RETURNING *;`
    let values = [moviename, comment, image];
    console.log(values);
    client.query(sql, values)
        .then((result) => {
            // res.status(201).json(data.rows);

            res.status(201).send("Data received by the server successfully");
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send("Error while saving data to the server");
        });
}
function getMoviesHandeler(req, res) {
    let sql = `SELECT * FROM moviet`;
    //read all data from database table
    client.query(sql).then((result) => {
        console.log(result);
        res.json(result.rows)
    }).catch((err) => {
        console.log(err);
    })

}
function updateHandler(req, res) {
    // console.log(1111,req.params)
    //new data i eant to update

    let ID = req.params.id;
    let { moviename, comment } = req.body;
    let sql = `UPDATE moviet SET  moviename = $1 ,comment=$2 
      WHERE id = $3 RETURNING *;`;
    let values = [moviename, comment, ID];
    client.query(sql, values).then(result => {
        console.log(result.rows);
        res.send(result.rows)
    }).catch(err => {
        console.log(err);
    });
}
function deleteHandler(req, res) {
    let { movieId } = req.params;
    let sql = `DELETE FROM moviet WHERE id =$1;`;
    let value = [movieId];
    client.query(sql, value).then(result => {
        res.status(204).send("deleted");
    }).catch(err => {
        console.log(err);
    })

}
function getSpecificMovieHandeler(req, res) {

    let id = req.params.id;
    let values = [id];
    let sql = `SELECT * FROM moviet WHERE id = $1`;
    client.query(sql, values).then((result) => {
        if (result.rows.length === 0) {
            res.send('This movie dose not exist');
        }
        else {
            res.json(result.rows);
        }
    }).catch(err => {
        console.log(err);
    })


}







// My constructor
function homePage(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

};
function trendMovie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

}
function searchMovie(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;

};
function popular(title, overview, release_date, vote) {
    this.title = title;
    this.overview = overview;
    this.release_date = release_date;
    this.vote = vote;
};
function overViewMovie(name, lang, overview, vote) {
    this.name = name;
    this.lang = lang;
    this.overview = overview;
    this.vote = vote;


};


//7. error found
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


client.connect().then(() => {
    // Run server and make it listening all the time
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

}).catch();



