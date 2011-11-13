var middleware = require('./middleware');

var operaticModuleWrapper = function(file) {
  return [
    ';(function(module) {'
  , '  (function(exports, define) {'
  , file
  , '  })(module.exports, module.define);'
  , "})(typeof module !== 'undefined' ?"
  , '    module :'
  , '    ((window.operatic && operatic.Module) ?'
  , '      new operatic.Module() :'
  , "      (function() { throw 'If an AMD system is not available, operatic module shim must be included'; })()"
  , '    )'
  , ');'
  ].join('\n');
};

var operaticMiddleware = function() {
  return middleware({
    name: 'operatic'
  , contentDir: __dirname
  , excludes: '/client.js'
  , matcher: '/operatic'
  , wrapper: operaticModuleWrapper
  });
};


exports.middleware = operaticMiddleware;
