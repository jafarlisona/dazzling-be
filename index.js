import express from "express";
import cors from "cors";
import "dotenv/config";
import { mongoose, Schema } from "mongoose";

const app = express();
const port = process.env.PORT;
const key = process.env.KEY;

app.use(express.json());
app.use(cors());

const postsSchema = new Schema(
  {
    title: String,
    image: String,
    description: String,
  },
  { timestamps: true }
);

const postsModel = mongoose.model("posts", postsSchema);

app.get("/posts", async (req, res) => {
  try {
    const posts = await postsModel.find({});
    res.status(200).json(posts);
  } catch (error) {
    res.send("Posts are not found!");
  }
});

app.get("/posts/:id", async function (req, res) {
  const { id } = req.params;
  const post = await postsModel.findById(id);
  res.send(post);
});

app.post("/posts", async function (req, res) {
  try {
    const { title, image, description } = req.body;
    const newPosts = new postsModel({ title, image, description });
    await newPosts.save();
    res.send("Post is created!");
  } catch (error) {
    res.send("Post is not created!");
  }
});

app.put("/posts/:id", async function (req, res) {
  const { title, image, description } = req.body;
  const { id } = req.params;
  const posts = await postsModel.findByIdAndUpdate(id, {
    title,
    image,
    description,
  });

  res.send(posts);
});

app.delete("/posts/:id", async function (req, res) {
  const { id } = req.params;
  const post = await postsModel.findByIdAndDelete(id);
  res.send(post);
});

mongoose
  .connect(key)
  .then(() => console.log("Connected!"))
  .catch((err) => console.log("Not Connected!"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
