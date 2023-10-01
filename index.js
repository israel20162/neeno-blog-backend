import dotenv from "dotenv";
import express, { urlencoded, json } from "express";
import cors from "cors";

import authRotes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import commentRoutes from "./routes/comment.js";
import postRoutes from './routes/posts.js'
import tagRoutes from './routes/tags.js'

dotenv.config();
const app = express();
const port = process.env.PORT ;

app.use(
  cors({
    origin: "*",
  })
);


app.use(urlencoded({ extended: true }));
app.use(json());


app.use("/api/auth", authRotes);
app.use("/api/users", userRoutes);
app.use("/api/comment", commentRoutes)
app.use('/api/posts',postRoutes);
app.use('/api/tags',tagRoutes)







app.listen(port, () => {
  console.log(`Listening to requests on port ${port}`);
});
