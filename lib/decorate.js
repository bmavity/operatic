define('decorate', function(util, oi) {
  var callBefore = function(obj, fnName, callBeforeFn) {
    var old = obj[fnName];
    obj[fnName] = function() {
      var argsArr = util.toArray(arguments);
      callBeforeFn.apply({}, argsArr);
      return old.apply(obj, argsArr);
    };
  };

  var merge = function(obj, extendWith) {
    oi.forEach(extendWith, function(name, val) {
      obj[name] = val;
    });
  };

  exports.callBefore = callBefore;
  exports.merge = merge;
});
