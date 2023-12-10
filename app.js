import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import pg from "pg";

const app = express();
const port = 3000;

// Configuration static folder
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'BookProject',
    password: 'Berkan188138',
    port: 5432,
})

db.connect();

const API_URL = "https://covers.openlibrary.org/b/isbn/";

// For the query for API http://covers.openlibrary.org/api/query


// Get home page 
app.get("/", async (req, res) => {
    try {
        const query = await db.query("SELECT * FROM covers ORDER BY id DESC");
        res.render("index.ejs", {
            books: query.rows,
        });

        } catch (error) {
        console.log("Failed to make request (select):", error.message)
    }
});

// Add new note
app.post("/addNote", async (req, res) => { 
    try {
        const query_url = API_URL + req.body.isbn + ".json";
        const response = await axios.get(query_url);
        const image_url = response.data.source_url;
        await db.query(
            "INSERT INTO covers(name, isbn, rating, notes, image_url) VALUES ($1, $2, $3, $4, $5)",
            [req.body.bookName, req.body.isbn, parseInt(req.body.rating), req.body.notes, image_url]
        );
        res.redirect("/");

    } catch (error) {
        console.error("Failed to make request: (insert)", error.message);
    }
})

// Read Notes page
app.get("/note-detail", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await db.query(
            "SELECT * FROM covers WHERE id = ($1)", [id]
        );
        console.log(result.rows[0])
        res.render("note-detail.ejs", {
            book: result.rows[0],
        });
    } catch (error) {
        
    }
   
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
