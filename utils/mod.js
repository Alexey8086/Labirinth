module.exports.deleteExpiredOrder = async (Order) => { 
  try {
    const orders = await Order.find().lean()
    const currentData = new Date()
    orders.forEach(async order => {
      const endDate = order.expirationDate
      if (order.confirmed) {
        if (+currentData >= +endDate) {
          await Order.deleteOne({
            _id: order._id
          })
        } else {
          console.log('Заказ ещё не завершён.')
        }
      }
    })
  } catch (error) {
    console.log(error)
  } 
}

module.exports.userIsAdmin = async (userId, User) => {
  try {
    const user = await User.findById(userId)
    if (user.role === "admin") return user.role
    else return null
  } catch (e) {
    console.log(e)
  }
}
