#!/usr/bin/env node

var program = require('commander')
var fs = require('fs')
var readline = require('readline')
var resv = require('reserved-words')

var log = console.log.bind(console)

program
  .version('1.1.0')
  .option('-e, --es <version>', 'Ecmascript dialects version either: 3, 5 or 6', parseInt)
  .option('-f, --file <file.js>', 'javascript file reference, ie: -f jsFileWithReserveWords.js')
  .parse(process.argv);

if (!program.es) {
  log('No Ecmascript dialects is defined, ie: "  -e 3" for es3 reference')
  return false
}

if (!program.file) {
  log('You need to provide the file reference i.e: "  -f test.js"')
  return false
}

var dialect = program.e || program.es

var file = program.f || program.file

var rd = readline.createInterface({
  input: fs.createReadStream(file),
  output: process.stdout,
  terminal: false
})

var c = 0

var isFound = false

log('parsing ' + file + '...')

rd.on('line', function(line) {
  c++
  var m = line.match(/\./g, ' ')
  if (m) {
    var objList = line.split('.')
    objList.forEach(function(o, i, r) {
      if (i !== 0 && i !== r.length - 1) {
        var isReserved = resv.check(o, dialect)
        if (isReserved) {
          isFound = true
          log(o + ' is a reserved words on line:' + c)
        }
      } else if (i === r.length - 1) {
        var last = o.substr(0, o.indexOf(' '))
        var isReservedLast = resv.check(last, dialect)
        if (isReservedLast) {
          isFound = true
          log(last + ' is a reserved words on line:' + c)
        }
      }
    })
  }
})

rd.on('close', function() {
  if (!isFound) log(file + ' has no reserved words [es' + dialect + ']')
})