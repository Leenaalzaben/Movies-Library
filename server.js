'usr strict';
// Create a basic server with a route that returns a response
// express :is a framework 
const express = require('express');
const app = express();
const port = 8080;

// JSON object data in the required format
const movieData = {
    title: "Spider-Man: No Way Home",
    poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
    overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man."
};

//app.get(the name of my PATH.endpoint , typr any thing HANDLER)

app.get("/", HANDLER);
function HANDLER(req, res) {
    res.json(movieData);

}
app.get("/favorite", HANDLERTWO)
function HANDLERTWO(req, res) {
    res.json("Welcome to Favorite Page");
}



// Run server and make it listening all the time
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});



