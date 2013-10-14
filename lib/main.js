(
	function(){

		var program = require('commander'); 
		var swig = require('swig'); 
		var fs = require('fs');
		var path = require('path');
		var url = require('url');

		/* 	Nginx setup definition
		*/
		
		var httpTemplate = [
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
			,'}'
		].join('\n');

		var upstreamTemplate = [
			'upstream {{upstream}} {'
  			,'	server 127.0.0.1:{{port}};'
  			,'	keepalive 64;'
			,'}'
		].join('\n');

		var wwwTemplate = [
			'server {'
			,'	listen 80;'
  			,'	server_name www.{{servername}};'
  			,'	rewrite ^ http://{{servername}}$uri permanent;'
			,'}'
		].join('\n');

		var serverTemplate = [
			'{{http_section}}'
			,''
			,'{{upstream_section}}'
			,''
			,'{{www_section}}'
			,''
			,'server {'
  			,'	listen 80;'
  			,''
  			,'	server_name {{servers}};'
  			,''
			,'	#error_page 502  /errors/502.html;'
			,''
			,'	location ~ ^/(images/|img/|javascript/|js/|css/|stylesheets/|flash/|media/|static/|font/|robots.txt|humans.txt|favicon.ico) {'
    		,'		root {{rootdir}};'
    		,'		access_log off;'
    		,'		expires max;'
  			,'	}'
  			,''
  			,'	#location /errors {'
  			,'		#  internal;'
  			,'		#  alias /usr/local/silly_face_society/node/public/errors;'
  			,'	#}'
  			,''	
		  	,'	location / {'
		    ,'		proxy_redirect off;'
			,'  	proxy_set_header   X-Real-IP            $remote_addr;'
			,'  	proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;'
			,'  	proxy_set_header   X-Forwarded-Proto $scheme;'
			,'  	proxy_set_header   Host                   $http_host;'
			,'    	proxy_set_header   X-NginX-Proxy    true;'
			,'    	proxy_set_header   Connection "";'
			,'    	proxy_http_version 1.1;'
			,'    	proxy_cache one;'
			,'   	proxy_pass         {{upstream}};'
		  	,'	}'
			,'}'
		].join('\n');
		
		/**
		 * 	Nginx definition
		 */
		var Nginx = function(){
			this.init();
		};

		Nginx.prototype = {
			
			/**
			* Parse input commands
			*
			* @method init 
			*/

			init: function(){

				// Create options parsing
				program
					.version('0.1.0')
					.description('Generate the Nginx configuration file as proxy for Node.js')
					.option('-o, --outputfile <path>', 'File name or path for configuration file')
					.option('-p, --port <value>', 'Listen port for connections')
					.option('-r, --rootdir <path>', 'Root path for (public) static content')
					.option('-s, --servername <value>', 'Server name')
					.option('-u, --upstream <value>', 'Upstream name value')
					.option('-h, --http', 'Generate Nginx http section options')
					.option('-w, --withoutwww', 'Redirect www to non-www')

				
				// Create default options value	
				this.options = {	http: false
								 	,withoutwww:false
				};
			}
			/**
			* Generate config file configuration
			*
			* @method config 			
			* @param {Array} 		process_argv	process.arv
			* @param {Function} 	callback		function	 
			*/
			,config: function(process_argv,callback){

				// 1. Exception handler
    			if(arguments.length!==2 )
    				throw new Error('No valid args for config(process_argv,callback)');  
    			else{
    				// init parameters 
    				var callback = this.checkCallback(callback) ? callback : null;
 
    				//1.1 Check paramaters one by one 				
    				if(!this.checkCallback(callback))
    					throw new Error('No valid args for callback parameters | config(process_argv,callback)');  	
    			}

    			// 2. Success on args
    			this.process_argv = process_argv;
    			this.callback = callback;

    			//3. Parse arguments 
    			this.parseArgs();    

    			//4. write file
    			this.writeFile();			
			}
			/**
			* Test callback function
			*
			* @method 				checkCallback
			* @param {Function} 	callback				function
			*/
			,checkCallback:function (callback){
				
				if (callback && typeof(callback) === "function")  
					return true;
				else
					return false;	
			}
			/**
			* Parse args commands
			*
			* @method 				parseArgs
			*/
			,parseArgs: function(){

				this.nooptions = false;
				
				program.parse(this.process_argv);

				if(!program.outputfile || !program.port || !program.rootdir || !program.servername || !program.upstream)
					this.nooptions = true;

				if(program.outputfile)
					this.options.outputfile = program.outputfile;
				if(program.port)
					this.options.port = program.port;
				if(program.rootdir)
					this.options.rootdir = program.rootdir;
				if(program.servername)
					this.options.servername = program.servername;
				if(program.upstream)
					this.options.upstream = program.upstream;
				if(program.http)
					this.options.http = true;
				if(program.withoutwww)
					this.options.withoutwww = true;

				return;
			}
			/**
			* Write Nginx config file
			*
			* @method 				writeFile
			*/
			,writeFile: function(){
				// 1. Before to write, do some check command args		
				if(this.nooptions === true)
					return this.callback(new Error('All required options are not defined in command line '));

				var self = this;

				// Update server name
				// Delete protocol and www			
				var servername = this.options.servername.replace(/.*?:\/\//g, "").replace('www.', "");
				this.options.servername = servername;

				// write nginx file
				//0. HTTP section
				var httpTpl = swig.compile(httpTemplate);
				var httpFile = httpTpl(this.options);

				//1. Upstream section
				var upstreamTpl = swig.compile(upstreamTemplate);
				var upstreamFile = upstreamTpl(this.options);

				//2. www section
				var wwwTpl = swig.compile(wwwTemplate);
				var wwwFile = wwwTpl(this.options);

				//3. Server section
				// According command, update file
				if(this.options.http)
					this.options.http_section = httpFile;
				if(this.options.withoutwww){
					this.options.www_section = wwwFile;
					this.options.servers = this.options.servername;
				}
				else
					this.options.servers = 'http://www.' + this.options.servername + ' ' + this.options.servername;	
				this.options.upstream_section = upstreamFile;

				var serverTpl = swig.compile(serverTemplate);
				var serverFile = serverTpl(this.options);

				// Dump to disk
  				fs.writeFile(this.options.outputfile, serverFile, function (err) {
					self.callback(err,"Script daemon file saved to " + self.options.outputfile);
				});

			}
			
		};

		module.exports = new Nginx();
	}
)();