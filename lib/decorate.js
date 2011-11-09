define('decorate', function(oi) {
  var merge = function(obj, extendWith) {
    oi.forEach(extendWith, function(name, val) {
      obj[name] = val;
    });
  };

  exports.merge = merge;
});
