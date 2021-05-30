const dateFormat = date => {
  return new Intl.DateTimeFormat('ru-Ru', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export default dateFormat

  // day: '2-digit',
  // month: 'long',
  // year: 'numeric',
  // hour: '2-digit',
  // minute: '2-digit',
  // second: '2-digit'