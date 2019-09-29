const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
});

userSchema.methods.verifyPassword = async function(plainPass) {
  const isMatch = await bcrypt.compare(plainPass, this.password);
  return isMatch;
}

const User = mongoose.model('User', userSchema);

module.exports = User;