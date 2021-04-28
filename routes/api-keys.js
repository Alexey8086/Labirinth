const {Router} = require('express')
const router = Router()
const KEYS = require('../keys')


// API
router.post('/keys', async (req, res) => {

  if (req.body.apiClient === 'google-map') res.status(200).json({key: KEYS.GOOGLE_MAP_KEY})
  else if (req.body.apiClient === 'firebase') res.status(200).json({key: KEYS.FIREBASE_KEY})
  else res.status(200).json({key: ''})

})

module.exports = router