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
        }
        // else {
        //   console.log('Заказ ещё не завершён.')
        // }
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

module.exports.dateDiffInDays = (d1, d2) => {
  let t2
  let t1
  let daysBeforeEndFreeze

  if (d2 === null) {
    daysBeforeEndFreeze = false
  } else {
    t2 = d2.getTime()
    t1 = d1.getTime()
    daysBeforeEndFreeze = parseInt((t2-t1)/(24*3600*1000))

    if (daysBeforeEndFreeze <= 0) daysBeforeEndFreeze=false
  }

  return daysBeforeEndFreeze
}
