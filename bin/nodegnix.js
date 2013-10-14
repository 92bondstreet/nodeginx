#!/usr/bin/env node
var nodegnix = require('../lib/main');
var colors = require('colors');

//Define colors for console logging
colors.setTheme({
  verbose: 'cyan',
  error: 'red'
});

// Log
var traceError = function (error, retval) {
		  if (error) {
		    console.log(colors.error(error));
		    return;
		  }
		  console.log(colors.verbose(retval));
		}

nodegnix.script(process.argv,traceError);
