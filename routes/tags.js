import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();


// gets all tags
router.get("/", async (req, res) => {
  const tags = await prisma.tags.findMany({});
  res.status(200).json({ data: tags });
});


// create tag
router.post("/", async (req, res) => {
  console.log(req.body)
  const tag = await prisma.tags.findFirst({
    where: {
      title: req.body.tag,
    },
  });

  if (!tag) {
    try {
      const createTag = await prisma.tags
        .create({
          data: {
            title: req.body.tag,
          },
        })
        .then(() => {
          res.status(200).send("tag created succesfullly");
        });
    } catch (error) {
      res.status(401).json("error in creating tag");
    }
  } else {
    res.status(409).send("tag already exsist");
  }
});










export default router