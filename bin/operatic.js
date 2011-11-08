#!/usr/bin/env node

var program = require('commander')
  , fs = require('fs')
  , path = require('path')
  , util = require('util')
  , templateFolder = path.join(__dirname, 'templates')
  ;

program
  .option('-c, --create [output file]', 'create a file')
  ;

program.on('--create', function() {
  var inputPath = path.join(templateFolder, 'template.html')
    , outputPath = path.join(process.cwd(), program.create)
    ;
  if(path.existsSync(inputPath) && !path.existsSync(outputPath)) {
    util.pump(fs.createReadStream(inputPath), fs.createWriteStream(outputPath), function(err) {
      console.log(err);
    })
  }
});

program.parse(process.argv);

if(program.create) {
  program.emit('--create');
}
