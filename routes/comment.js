import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

//to make a comment
router.post("/", async (req, res) => {
  const { content, email, postId } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  try {
    await prisma.comment
      .create({
        data: {
          content,
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              email: user.email,
            },
          },
          likes: 0,
          dislikes: 0,
          published: true,
        },
      })
      .then(() => {
        res.status(200).json("comment created succesfullly");
      });
  } catch (error) {
    res.status(404).json(error);
  }
});

//reply
router.post("/:id/reply", async (req, res) => {
  const commentId = req.params.id;
  const { content, email, postId } = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  try {
    await prisma.reply
      .create({
        data: {
          content,
          comment: {
            connect: {
              id: commentId,
            },
          },
          user: {
            connect: {
              email: user.email,
            },
          },
        },
      })
      .then(() => {
        res.status(200).json("replied succesfullly");
      });
  } catch (error) {
    res.status(500);
  }
});

//like and dislike
router.put("/:id/:action", async (req, res) => {
  const commentId = req.params.id;
  const action = req.params.action;

  switch (action) {
    case "like":
     const comment = await prisma.comment.findUnique({
        where: {
          id: commentId,
        },
      });

    

    //  if () return 0
        
      

      try {
        await prisma.comment
          .update({
            where: {
              id: commentId,
            },
            data: {
              likes: {
                increment: 1,
              },
              dislikes: {
                decrement: comment.dislikes <= 0 ? 0 : 1,
              },
            },
          })
          .then(() => {
            res.json("comment liked succesfully").status(200);
          });
      } catch (error) {
        res.json(error).status(401);
      }
      break;
    case "dislike":
      try {
        await prisma.comment
          .update({
            where: {
              id: commentId,
            },
            data: {
              dislikes: {
                increment: 1,
              },
              likes: {
                decrement:  1,
              },
            },
          })
          .then(() => {
            res.json("comment disliked succesfully").status(200);
          });
      } catch (error) {
        res.json(error).status(401);
      }
      break;
    case "delete":
      try {
        await prisma.comment
          .delete({
            where: {
              id: commentId,
            },
          })
          .then(() => {
            res.status(200).json("comment deleted succesfullly");
          });
      } catch (error) {
        res.json(error).status(401);
      }
      break;

    default:
      break;
  }
});

//get all comments for a post by its and with replies
router.get("/:id", async (req, res) => {
  const postId = req.params.id;
  
  try {
      const comments = await prisma.comment.findMany({
        where: {
          postId: Number.parseInt(postId),
        },
        include: {
          replies:{

            include:{
              user:true
            }
          },   
          user:true
        },
      });
      res.status(200).json(comments);
  } catch (error) {
   res.json(error).status(500)
  }

});

export default router;
