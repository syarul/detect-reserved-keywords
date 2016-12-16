#!/usr/bin/env node

var program = require('commander')
,   fs = require('fs')
,   readline = require('readline')
,   rread = require('readdir-recursive')
,   resv = require('reserved-words')
,   ver = require('./package.json').version

,   log = console.log.bind(console)

program
  .version(ver)
  .option('-e, --es <version>', 'Ecmascript dialects version either: 3, 5 or 6', parseInt)
  .option('-f, --file <file.js>', 'javascript file reference, ie: -f jsFileWithReserveWords.js')
  .option('-d, --dir <directory>', 'parse all *.js files in a directory recursively')
  .parse(process.argv);

if (!program.file) {
  if (!program.dir) {
    errorParse()
  }
} else if (!program.dir) {
  if (!program.file) {
    errorParse()
  }
} else if (!program.es) {
  errorParse()
}

function errorParse() {
  log('Parsing error, type "dresv -h" to see available arguments')
  return false
}

var dialect = program.e || program.es
,   file = program.f || program.file
,   dir = program.d || program.dir
,   rawfiles = []

if (dir) {
  if (dir === '*') dir = './'
  var files = rread.fileSync(dir)
    .filter(function(f) {
      return (/\.js$/.test(f))
    })
  if (files.length !== 0) {
    function next(index) {
      if (index < files.length - 1) {
        index++
        ReadLine(files[index], true, function() {
          next(index)
        })
      }
    }
    next(-1)
  } else {
    log('Directory has no *.js files')
  }
} else {
  ReadLine(file)
}

function ReadLine(file, async, cb) {

  var rd = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
  })

  var c = 0
  ,   isFound = false

  file = file.replace(/([^:]\/)\/+/g, "$1")

  log('\nparsing ' + file + '...')

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
            log(o + ' is a reserved word (' + file + ':line ' + c + ')')
          }
        } else if (i === r.length - 1) {
          var last = o.substr(0, o.indexOf(' '))
          var isReservedLast = resv.check(last, dialect)
          if (isReservedLast) {
            isFound = true
            log(last + ' is a reserved word (' + file + ':line ' + c + ')')
          }
        }
      })
    }
  })

  if (async) {
    rd.on('close', function() {
      if (!isFound) log(file + ' has no reserved word [es' + dialect + ']')
      cb()
    })
  } else {
    rd.on('close', function() {
      if (!isFound) log(file + ' has no reserved word [es' + dialect + ']')
    })
  }
}