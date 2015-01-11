Object.defineProperty(Error.prototype, 'toJSON', {
  value: function() {
    var alt;
    alt = {};
    Object.getOwnPropertyNames(this).forEach(function(key) {
      return alt[key] = this[key];
    }, this);
    return alt;
  }
});
