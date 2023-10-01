import { prisma } from "../prisma.js";
import express from "express";
import pkg from "jsonwebtoken";
const {sign} = pkg
const router = express.Router();

router.post("/register", async function (req, res) {
  const data = req.body;
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user) return res.status(409).json("user already exsists");

  const newUser = await prisma.user
    .create({
      data: data,
    })
    .then(() => res.json({ message: "succesful", status: 200 }))
    .catch((err) => console.log(err.message));
  console.log(newUser, data);
  console.log(data);
});

router.post("/login", async (req, res) => {
  const { name, email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user?.password === password) {
    const accessToken = sign(name, process.env.ACCESS_TOKEN_SECRET);
    res.json({
      message: "Signed in succesfullly",
      status: 200,
      user: user,
      accessToken: accessToken,
    });
  } else {
    res.json({ message: "Wrong email or password", status: 403 });
  }
});

export default router;
