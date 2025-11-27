const mongoose = require('mongoose');

const isEmail = require('validator/lib/isEmail');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Jacques Cousteau',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Explorer',
  },
  avatar: {
    type: String,
    validate: {
      validator(v) {
        return /^(https?:\/\/)(www\.)?\S+(\/\S+)*(\/)?#?$/.test(v);
      },
      message: (props) => `${props.value} is not a valid URL!`,
    },
    default:
      'https://practicum-content.s3.us-west-1.amazonaws.com/resources/moved_avatar_1604080799.jpg',
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    require: true,
    minlength: 8, // conforme está na msg de erro do input, no frontend
  },
});

module.exports = mongoose.model('user', userSchema);
