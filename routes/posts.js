import { prisma } from "../prisma.js";
import express from "express";
import multer, { diskStorage } from "multer";

import { verify } from "jsonwebtoken";
const router = express.Router();

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

//gets all posts
router.get("/", async (req, res) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
      tags: true,
    },
  });
  res.json(posts).status(200);
});

// get post by id
router.get("/:id", async(req, res) => {
  const postId = req.params.id;
  // const post = await prisma.post.findFirst({
  //   where:{
  //     title:postId
  //   }
  // })
  // res.json(post).status(200)
  try {
      const post = await prisma.post.findUnique({
        where: {
          id: Number(postId),
        },
        include:{
            author:true,
            tags:true
        }
      });
     
      res.status(200).json(post)
  } catch (error) {
    res.json(error).status(500)
    
  }   
});

//
router.post(
  "/create-post",
  authenticateToken,
  upload.single("file"),
  async function (req, res) {
    const { email, title, content, tag, userType, published, image } = req.body;
    console.log(req.user);
    const authors = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userType == "ADMIN") {
      const createPost = await prisma.post
        .create({
          data: {
            title: title,
            content: content,
            Image: req.file.path,
            published: published === "true" ? true : false,
            author: {
              connect: {
                email: authors.email,
              },
            },
            tags: {
              connectOrCreate: {
                where: {
                  title: tag,
                },
                create: {
                  title: tag,
                },
              },
            },
          },
        })
        .then(() => {
          res.json({ message: "post created succesfully" });
        });
    } else {
      res.sendStatus(401);
    }
  }
);
function authenticateToken(req, res, next) {
  const header = req.headers["authorization"];
  const token = header && header.split("=")[1];
  if (token === null) return res.sendStatus(401);
  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

router.get("/img/:name(*)", function (req, res, next) {

  var file = req.params.name;
  var path = `./public/${file}`;
res.sendFile(path, { root: '.' });
  // res.sendFile(path, file, function (err) {
  //  if (err) {
  //    res.status(500).send({ "error": 'Unexpected error occure' });
  //  } else {
  //    res.send({ "message": 'success' });
  //  }
  // });
});

export default router;
