const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});