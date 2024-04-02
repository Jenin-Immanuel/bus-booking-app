const express = require("express")
const { UserModel } = require("../models/user.model")
const { signJwt } = require("../utils/jwt")
const bcrypt = require("bcrypt")

function checkIfUserExists(users, email) {
  let err
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      err = "User already exists"
      console.log(err)
      return { error: err }
    }
  }
  return {}
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

async function createUser(req, res) {
  const users = await UserModel.find()

  const err = checkIfUserExists(users, req.body.email)
  if (err.error) {
    return res.json(err)
  }

  const hashedPassword = await hashPassword(req.body.password)

  const newUser = new UserModel({
    email: req.body.email,
    password: hashedPassword,
    name: req.body.name,
  })

  const user = await newUser.save()
  return res.send(user)
}

async function getUsers(req, res) {
  const users = await UserModel.find()
  return res.json(users)
}

async function login(req, res) {
  const email = req.body.email
  const password = req.body.password

  const user = await UserModel.findOne({ email: email })
  if (user === null) {
    return res.status(404).json({ error: "Invalid user or password" })
  }

  // Check Password
  const validPassword = await bcrypt.compare(password, user.password)
  if (!validPassword) {
    return res.status(401).json({ error: "Invalid user or passwords" })
  }

  const token = signJwt({ email: email })
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  })
  return res.json({ name: user.name, email: user.email })
}

const getUserByToken = async (req, res) => {
  const token = req.headers["authorization"]
  const decoded = jwt.decode(token, process.env.PRIVATE_KEY)
  return res.json(decoded)
}

const me = async (req, res) => {
  const email = req.email
  const user = await UserModel.findOne({ email })
  return res.json({ email: user.email, name: user.name })
}

module.exports = {
  createUser,
  getUsers,
  getUserByToken,
  login,
  me,
}
