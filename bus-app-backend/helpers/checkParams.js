function checkParams(...args) {
  args.forEach((arg) => {
    if (!arg) {
      throw new Error("Missing parameters !")
    }
  })
}

module.exports = checkParams
