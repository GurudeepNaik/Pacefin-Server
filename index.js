const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./routes/routes");
const app = express();
const PORT = process.env.PORT || 7000;


mongoose.connect('mongodb://localhost:27017/news-api-app',(err) => {
    if (err) console.log(err);
    else console.log("Database Connected");
}
);

app.use(cors());
app.use(express.json());
app.use("/api", route);


app.get("*", (req, res) => {
  res.status(404).json({
    status: "Failed",
    message: "Invalid Path",
  });
});

app.listen(PORT, () => {
  console.log(`Server is up at http://localhost:${PORT}/`);
});