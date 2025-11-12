const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

// WARNING: Plaintext password storage (requested). Do NOT use in production.
userSchema.methods.matchPassword = function (candidate) {
  return candidate === this.password;
};

module.exports = mongoose.model('User', userSchema);


