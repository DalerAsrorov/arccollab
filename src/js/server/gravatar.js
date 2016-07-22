var gravatar = require('gravatar');

module.exports = {
  getGravatar: function(email, callback) {
    console.log('email received:', email);
    var url = gravatar.url(email,  {s: '70', r: 'x', d: 'wavatar'}, false);
    callback(url);
  }
};
