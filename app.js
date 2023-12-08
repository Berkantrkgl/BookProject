import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

// Configuration static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));



const API_URL = "http://covers.openlibrary.org/api";

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

// Add new note
app.post("/addNote", async (req, res) => {
    const bookName = req.body.bookName;
    const isbn = req.body.isbn;
    const rating = req.body.rating;
    const notes = req.body.notes;

    try {
        const response = await axios.get("http://covers.openlibary.org/api/query?isbn=9780385533225");
        const result = response.data;
        console.log(result);
    } catch (error) {
        console.error("Failed to make request:", error.message);
    }
    

})

// Running server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
