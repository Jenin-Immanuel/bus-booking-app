const express = require("express")
const { UserModel } = require("../models/user.model")
const { signJwt } = require("../utils/jwt")

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

async function createUser(req, res) {
  const users = await UserModel.find()
  console.log(req.body)

  const err = checkIfUserExists(users, req.body.email)
  if (err.error) {
    return res.json(err)
  }

  const newUser = new UserModel({
    email: req.body.email,
    password: req.body.password,
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
  console.log(email, password)
  const user = await UserModel.findOne({ email: email })
  if (user === null) {
    return res.status(404).json({ error: "Invalid user or password" })
  } else if (user.password !== password) {
    return res.status(401).json({ error: "Invalid user or password" })
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
