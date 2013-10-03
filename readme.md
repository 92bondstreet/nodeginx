NODEGINX [![Build Status](https://travis-ci.org/92bondstreet/nodeginx.png)](https://travis-ci.org/92bondstreet/nodeginx)
=========

nodeginx is a node.js module to create a Nginx configuration file for your nodejs application.

The package generates a file for `/etc/nginx/sites-available`.

It makes Ngnix as proxy for static content with Node.js website or webapp.

Keynote
-------
The idea is to use Nginx server to prevent unnecessary traffic for node.js websites and webapps. And also to serve static content. 

Installation
------------

You can install `nodeginx` and its dependencies with npm: 

`npm install nodeginx -g` for a global installation (for example)

Usage
-----

To generate the configuration file from the command line, use following options:

		$ nodeginx --help
		usage: nodeginx [options]
	
		Generate the Nginx configuration file as proxy for Node.js

		options:
			-o, --outputfile 	<OUTPUTFILE>	File name or path for configuration file
			-p, --port			<PORT>			Listen port for connections
			-r, --root			<ROOT>			Root path for (public) static content
			-u, --upstream		<UPSTREAM>		Upstream name value			
			-s, --servername	<SERVERNAME>  	Server name			
			-h, --htpp			[HTTP] 			Generate Nginx http section options						
			-w, --withoutwww	[WITHOUTWWW]	Redirect www to non-www
		Error:
		Cannot generate Nginx conf file: no options defined.

In order to use the configuration file, be sure to update Nginx http section with following values:

		http {
		    proxy_cache_path  /var/cache/nginx levels=1:2 keys_zone=one:8m max_size=3000m inactive=600m;
		    proxy_temp_path /var/tmp;
		    include       mime.types;
		    default_type  application/octet-stream;
		    sendfile        on;
		    keepalive_timeout  65;
		 
		    gzip on;
		    gzip_comp_level 6;
		    gzip_vary on;
		    gzip_min_length  1000;
		    gzip_proxied any;
		    gzip_types text/plain text/html text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
		    gzip_buffers 16 8k;
		}

Running tests
-------------

To run the tests under node you will need `mocha` and `should` installed (it's listed as a
`devDependencies` so `npm install` from the checkout should be enough), then do

    $ npm test

Project status
--------------
nodeginx is currently maintained by Yassine Azzout.

Authors and contributors
------------------------
### Current
* [Yassine Azzout][] (Creator, Coder, Keeper)

[Yassine Azzout]: http://yass.io


License
-------
[MIT license](http://www.opensource.org/licenses/Mit)
