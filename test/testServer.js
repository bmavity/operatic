var connect = require('connect')
  , operatic = require('../lib/middleware')
  ;

connect(
  operatic({})
, connect.static(__dirname)
).listen(process.env.PORT || 8000);

