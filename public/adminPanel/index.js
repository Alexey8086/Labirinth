$('#table').bootstrapTable({
  url: '/adminPanel/users-data',
  pagination: true,
  search: true,
  columns: [
    {
      field: 'name',
      title: 'Имя пользователя'
    },
    {
      field: 'email',
      title: 'Эл. почта'
    },
    {
      field: 'role',
      title: 'Роль'
    },
    {
      field: 'ordersAmount',
      title: 'Количество текущих заказов'
    }
  ]
})

