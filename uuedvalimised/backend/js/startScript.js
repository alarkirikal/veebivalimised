
function auth() {
	
	window.fbAsyncInit = function() {
		console.log("Starting");
	    FB.init({
	      appId      : '555712221116753', // App ID
	      channelUrl : 'uuedvalimised.appspot.com/channel.html', // Channel File
	      status     : true, // check login status
	      cookie     : true, // enable cookies to allow the server to access the session
	      xfbml      : true  // parse XFBML
	    });

	    FB.getLoginStatus(function(response) {
	    	console.log("funcGetLoginStatus");
	    	  if (response.status === 'connected') {
	    		logInAPI();
	    		document.getElementById("IDuserID").value = response.userID;
	    	  } else if (response.status === 'not_authorized') {
	    		  console.log("not authorized");
	    	    login();
	    	  } else {
	    		  	console.log("not logged in");
	    		login();
	    		};

	    	 });

	  };

	  // Load the SDK Asynchronously
	  (function(d){
	     var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	     if (d.getElementById(id)) {return;}
	     js = d.createElement('script'); js.id = id; js.async = true;
	     js.src = "//connect.facebook.net/en_US/all.js";
	     ref.parentNode.insertBefore(js, ref);
	   }(document));
};

function login() {
    FB.login(function(response) {
        if (response.authResponse) {
        	
        	logInAPI();
            console.log("loginfunction");
        } else {
        }
    }, { auth_type: 'reauthenticate' });
}

function logInAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    	console.log('Good to see you, ' + response.name + '.');
    	document.getElementById("IDfname").value = response.first_name;
    	document.getElementById("IDlname").value = response.last_name;
    	document.getElementById("IDuserID").value = response.id;
    	document.getElementById("facebookAuth").submit();
    });
};