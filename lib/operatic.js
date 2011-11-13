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

var operaticMiddleware = function(options) {
  options = options || {};
  return middleware({
    globalWrapper: options.globalWrapper || operaticModuleWrapper
  }).add({
    name: 'operatic'
  , contentDir: __dirname
  , excludes: '/client.js'
  , matcher: '/operatic'
  });
};


exports.middleware = operaticMiddleware;
