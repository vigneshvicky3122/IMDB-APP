const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const app = express();
const router = require("./routes/index");

app.use(cors({ origin: "*", credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api", router);

app.listen(PORT, () => console.log(`Server is Running into Port : ${PORT}`));
