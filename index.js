import express from "express";
import bodyParser from "body-parser";
import { connectToDatabase } from "./db.js";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.js";
import cors from "cors";

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());
app.use("/todos", todoRoutes);

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start the server due to database connection error",
      err
    );
  });
