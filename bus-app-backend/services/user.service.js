const bcrypt = require("bcrypt")
const { signJwt } = require("../utils/jwt")
const checkParams = require("../helpers/checkParams")
class UserService {
  constructor(userModel) {
    this.userModel = userModel
  }

  async getUserById(userId) {
    const user = await this.userModel.findById({ _id: userId })
    return user
  }

  async getAllUsers() {
    const users = await this.userModel.find()
    return users
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
  }

  async checkIfUserExists(users, email) {
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

  async createNewUser(name, email, password) {
    checkParams(name, email, password)
    const users = await this.userModel.find()

    const err = this.checkIfUserExists(users, email)
    if (err.error) {
      throw new Error(err.error)
    }

    const hashedPassword = await this.hashPassword(password)

    const newUser = new this.userModel({
      email: email,
      password: hashedPassword,
      name: name,
    })

    const user = await newUser.save()
    return user
  }

  async verifyUser(email, password) {
    const user = await this.userModel.findOne({ email: email })
    if (user === null) {
      throw new Error("Invalid user or password")
    }

    // Check Password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      throw new Error("Invalid user or password")
    }
    return user
  }

  async login(email, password) {
    if (!email || !password) {
      throw new Error("Invalid user or password")
    }
    const user = await this.verifyUser(email, password)
    const name = user.name
    const token = signJwt({ userId: user._id })
    return { token, name }
  }

  async me(userId) {
    const user = await this.userModel.findById(userId)
    return user
  }
}

module.exports = UserService
