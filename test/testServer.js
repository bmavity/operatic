var connect = require('connect')
  , operatic = require('../')
  ;

connect(
  operatic.middleware()
, connect.static(__dirname)
).listen(process.env.PORT || 8000);

