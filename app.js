import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Configuration static folder
app.use(express.static("public"));



// Get home page 
app.get("/", (req, res) => {
    res.render("index.ejs");
});




// Running server 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});