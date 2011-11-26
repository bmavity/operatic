define('chain', function(oi, util) {
  function FunctionChainer() {
    var registrations = {}
      , noop = function() {}
      , child
      ;

    var executeChain = function(evt, data, end) {
      var args = Array.prototype.slice.call(arguments, 0)
        , data = args.concat([])
        , evt = data.shift()
        , lastArg = data.slice(-1)[0]
        , end = util.isFunction(lastArg) ? data.pop() : null
        , it = oi.iter(registrations[evt] || {})
        ;

      var executeChild = function() {
        child.executeChain.apply(child, [evt].concat(data));
      };

      var executeHandler = function(key, val) {
        var nextFn
          ;
        if(it.hasNext()) {
          nextFn = function() {
            it.next(executeHandler);
          };
        } else if(child) {
          nextFn = executeChild;
        } else {
          nextFn = noop;
        }
        val.apply(null, data.concat([nextFn]));
      };
      if(it.hasNext()) {
        it.next(executeHandler);
      } else if(child) {
        executeChild();
      }
      end && end();
    };

    var addToChain = function(evt, name, fn) {
      registrations[evt] = registrations[evt] || {};
      registrations[evt][name] = fn;
    };

    var addChild = function(childChain) {
      child = childChain;
    };

    this.addChild = addChild;
    this.addToChain = addToChain;
    this.executeChain = executeChain;
  };

  exports.FunctionChainer = FunctionChainer;
});
