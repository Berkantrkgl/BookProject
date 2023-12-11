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

// Get home page 
app.get("/", async (req, res) => {
    try {
        const query = await db.query("SELECT * FROM covers ORDER BY id DESC");
        res.render("index.ejs", {
            books: query.rows,
        });
        } catch (error) {
        console.log("Failed to make request (select all):", error.message)
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
        console.error("Failed to make request: (insert into)", error.message);
    }
})

// Get book detail
app.get("/note-detail", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await db.query(
            "SELECT * FROM covers WHERE id = ($1)", [id]
        );
        res.render("note-detail.ejs", {
            book: result.rows[0],
        });
    } catch (error) {
        console.log("Failed to make request:", error.message);   
    }
});

// Delete from database
app.get("/delete", async (req, res) => {
    try {
        const id = req.query.id;
        await db.query("DELETE FROM covers WHERE id = $1", [id]);
        res.redirect("/");
    } catch (error) {
        console.log("Failed to make request:", error.message);
    }
});

// Get book detail by id for editing
app.get("/edit", async (req, res) => {
    try {
        const id = req.query.id;
        const result = await db.query("SELECT * FROM covers WHERE id = $1", [id]);
        res.render("edit.ejs", {
            book: result.rows[0],
        });
    } catch (error) {
        console.log("Failed to make request:", error.message);
    }
})

// Update db
app.post("/update", async (req, res) => {
    try {
        const id = parseInt(req.body.id);
        const bookName = String(req.body.bookName);
        const isbn = String(req.body.isbn);
        const rating = parseInt(req.body.rating);
        const notes = String(req.body.notes);

        const query_url = API_URL + isbn + ".json";
        const response = await axios.get(query_url);
        const image_url = response.data.source_url;
        await db.query(
            "UPDATE covers SET name = $1, isbn = $2, rating = $3, notes = $4, image_url = $5 WHERE id = $6",
            [bookName, isbn, rating, notes, image_url, id]
        )
        res.redirect(`/note-detail?id=${id}`);
    } catch (error) {
        console.log("Failed to make request:", error.message);
    }
})

// Take Notes page
app.get("/take-note", (req, res) => {
    res.render("take-note.ejs");
});

// Rate book
app.get("/rate", (req, res) => {
    res.render("rate.ejs");
});

// Search note 
app.get("/search", async (req, res) => {
    try {
        const searchQuery = req.query.query;
        const result = await db.query(
            "SELECT * FROM covers WHERE  LOWER(name) LIKE '%'||$1||'%' OR isbn LIKE $1||'%'"
            , [searchQuery.toLowerCase()]);
        res.render("index.ejs", {
            books: result.rows,
        })
    } catch (error) {
        console.log("Failed to make request:", error.message);   
    }
})

// How to use page
app.get("/using", (req, res) => {
    res.render("how-to-use.ejs")
})



// Running server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
