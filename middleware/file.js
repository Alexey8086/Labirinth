const multer = require('multer')

// var upload = multer({ dest: 'uploads/' })
// конфигурация хранилища для загруженных изображений
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads')
  },

  filename(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname)
  }
})

// Массив разшённых типов изображения
const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

// Валидация типа изображения и явл., ли объект изображением
const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer ({
  storage: storage,
  fileFilter: fileFilter
})