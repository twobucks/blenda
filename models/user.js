var mongoose = require('mongoose'),
    Schema   = mongoose.Schema

var UserSchema = new Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    trim: true
  },
  gravatar: String,
  dropbox: {
		token: {
			type: String,
			default: ''
		},
		email: {
			type: String,
			default: ''
		},
		cursor: {
			type: String,
			default: ''
		}
  }
})

mongoose.model('User', UserSchema)
