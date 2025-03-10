import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 4000;

const db = new pg.Client({
 //Create your own postgreSQL database setup
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("select * from items ORDER BY id asc");
    items = result.rows
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;

  try {
     await db.query("Insert into items (title) values ($1)",[item]);
     res.redirect("/");
  } catch (error) {
    console.log(error);
  }
  
});

app.post("/edit", async (req, res) => {
 const item = req.body.updatedItemTitle;
 const id = req.body.updatedItemId;
 try {
  await db.query("Update items set title = ($1) where id = $2", [item, id]);
  res.redirect("/")
 } catch (error) {
    console.log(error);
 }
});

app.post("/delete",async(req, res) => {
 const id = req.body.deleteItemId;
 try {
  await db.query("DELETE FROM items where id = $1", [id]);
  res.redirect("/")
 } catch (error) {
    console.log(error);
 }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
