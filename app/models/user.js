var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

var userSchema = mongoose.Schema({
  username: {type: String, required: true, index: {unique: true}},
  password: {type: String, required: true}
});

//Like creating a table
userSchema.pre('save', function(next) {
  console.log('hey hey you you')
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

var User = mongoose.model('User', userSchema);

User.comparePassword = function(candidatePassword, savedPassword, cb) {
  bcrypt.compare(candidatePassword, savedPassword, function(err, isMatch) {
    console.log(candidatePassword , savedPassword );
    if (err) { return cb(err); }
    cb(null, isMatch);
  });
};




// User.hashPassword = function(password) {
//   var cipher = Promise.promisify(bcrypt.hash);
//   cipher(password, null, null).bind(this)
//     .then(function(hash) {
//       this.password = hash;
//     });
// };

module.exports = User;



