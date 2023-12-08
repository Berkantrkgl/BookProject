import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Configuration static folder
app.use(express.static("public"));


// For the query for API http://covers.openlibrary.org/api/query


// Get home page 
app.get("/", (req, res) => {
    res.render("index.ejs");
});

// Read Notes page
app.get("/note-detail", (req, res) => {
    res.render("note-detail.ejs");
});

// Take Notes page
app.get("/take-note", (req, res) => {
    res.render("take-note.ejs");
});

// Rate book
app.get("/rate", (req, res) => {
    res.render("rate.ejs");
});

// Delete note 
app.get("/delete", (req, res) => {

})

// Search note 
app.get("/search", (req, res) => {
    
})

// Running server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
