(
	function()
	{
		var should = require('should');
		var nginx = require('../lib/main');


		var traceError = function (error, retval) {
		  if (error) {
		    console.log(error);
		    return;
		  }
		  console.log(retval);
		}


 	   /*
 		* 		Generate configuration file
 		*/
 		describe('Generate nginx file', function() {
 			describe('with no arguments', function() {
 				it('throw ERROR', function() {
		          (function () {
		          	nginx.config();		            
		          }).should.throw();  
		        });
		    });

		    describe('More than 2 invalids arguments', function() {
		    	it('throw ERROR for just 2', function() {
		          (function () {
		          	nginx.config("","");		
		          }).should.throw();
		        });

		        it('throw ERROR for more than 2', function() {
		          (function () {
		          	nginx.config("","","");		
		          }).should.throw();
		        });

		         it('throw ERROR for more than 2', function() {
		          (function () {
		          	nginx.config("","","","");		
		          }).should.throw();
		        });
		    });

		    describe('with 2 valids arguments', function() {
		    	describe('with no required options', function() {

		    		it('Callback error', function(done){
			        	               						         	
			        	nginx.config([],function(err,response){
	             			if (err) 
	             				console.log(err);
	             			else
	             				console.log(response);
	            			done();
	          			});
					});

					it('Callback error if required missing', function(done){
			        	               						         	
			        	nginx.config(['npm', 'test', '-o', 'mynodesite', '-p', '8001'],function(err,response){
	             			if (err) 
	             				console.log(err);
	             			else
	             				console.log(response);
	            			done();
	          			});
					});

		    	});

		    	describe('with required options', function() {
		    		
		    		it('generate confiuration file with required arguments', function(done) {
		    			           						         	
			        	nginx.config(['npm', 'test', '-o', 'mynodeapp', '-p', '8001', '-r', '/var/www/mynodeapp/public', '-u', 'mynodeapp_upstream', '-s', 'www.mynodeapp.com'],function(err,response){
	             			if (err) 
	             				console.log(err);	
	             			else
	             				console.log(response);	            		
	            			done();
	          			});
		    		});

		    		it('generate confiuration file with required AND optional arguments', function(done) {
		    			           						         	
			        	nginx.config(['npm', 'test', '-o', 'mynodesite', '-p', '8002', '-r', '/var/www/mynodesite/public', '-u', 'mynodesite_upstream', '-s', 'http://mynodesite.com', '-c', '-w'],function(err,response){
	             			if (err) 
	             				console.log(err);	
	             			else
	             				console.log(response);	            		
	            			done();
	          			});
		    		});
		    
		    	});
		    });


 		});
	}
)();