const {Schema, model} = require('mongoose')

const editorSchema = new Schema({
  time: {
    type: Number,
    required: true,
    default: 1600000000016
  },

  blocks: [
    {
      type: {
        type: String,
        required: true,
        default: 'header'
      },
      data: Object
    }
  ],

  version: {
    type: String,
    required: false,
    default: '2.19.0'
  },

  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

module.exports = model('notes', editorSchema)