import { prisma } from "../prisma.js";
import express from "express";

const router = express.Router();

router.get("/", async function (req, res) {
  const users = await prisma.user.findMany();
  res.json(users).status(200);
  console.log(users);
});

router.get("/:id", async (req, res) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.params.id,
    },
  });

  return res.json(user).status(200);
});

export default router;
