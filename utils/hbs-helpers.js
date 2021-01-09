const KEYS = require('../keys')

module.exports = {
  isEqual (a, b, options) {
    // console.log("FROM HELPER isEqual ------->", a, b)
    if (a == b) {
      return options.fn(this)
    }
    return options.inverse(this)
  },

  isAdminId (id, options) {
    // console.log("FROM HELPER isAdminId ------->", id)
    if (id == KEYS.ADMIN_ID) {
      return options.fn(this)
    }
    return options.inverse(this)
  }
}