import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import router from "./src/routes/index.js";

//server configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "production";

//starting the express service
const app = express();

app.use('/',router);
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "src/views"));

//Bootstrap assets
app.use(
  "/bcss",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")),
);
app.use(
  "/bjs",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")),
);

//project assets
app.use(express.static(path.join(__dirname, "public")));

// Start the server and listen to the PORT
app.listen(PORT, () => {
  console.log(`Server is running and on http://127.0.0.1:${PORT}`);
});
