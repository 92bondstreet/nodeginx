(
	function(){

		var program = require('commander'); 
		var swig = require('swig'); 
		var fs = require('fs');
		var path = require('path');

		/* 	Nginx setup definition
		*/
		
		var http = [
			'http {'
		    ,'	proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=one:8m max_size=3000m inactive=600m;'
		    ,'	proxy_temp_path /var/tmp;'
		    ,'	include       mime.types;'
		    ,'	default_type  application/octet-stream;'
		    ,'	sendfile        on;'
		    ,'	keepalive_timeout  65;'
		    ,''
		    ,'	gzip on;'
		    ,'	gzip_comp_level 6;'
		    ,'	gzip_vary on;'
		    ,'	gzip_min_length  1000;'
		    ,'	gzip_proxied any;'
		    ,'	gzip_types text/plain text/html text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;'
		    ,'	gzip_buffers 16 8k;'
			'}'
		].join('\n');
		
		var Nginx = function(){
		};

		module.exports = new Nginx();
	}
)();