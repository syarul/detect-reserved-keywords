#!/usr/bin/env node
var fs = require('fs')
var readline = require('readline')
var resv = require('reserved-words')

var log = console.log.bind(console)

if(process.argv[2] == undefined){
	console.log('You need to provide the file reference i.e: "resv test.js"')
	return false
}

var rd = readline.createInterface({
    input: fs.createReadStream(process.argv[2]),
    output: process.stdout,
    terminal: false
})

var c = 0

rd.on('line', function(line) {
	c++
  var m = line.match(/\./g,' ')
 	if(m){
 		var objList = line.split('.')
 		objList.forEach(function(o, i, r){
 			if(i !== 0 && i !== r.length - 1){
 				var isReserved = resv.check(o, 3)
 				if(isReserved)
 					log(o+ ' is a reserved words on line:'+c)
 			}else if(i === r.length - 1){
 				var last = o.substr(0,o.indexOf(' '))
 				var isReservedLast = resv.check(last, 3)
 				if(isReservedLast)
 					log(last+ ' is a reserved words on line:'+c)
 			}
 		})
 	}
})