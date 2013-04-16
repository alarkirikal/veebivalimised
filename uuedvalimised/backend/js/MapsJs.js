window.onload = begin;

function begin(){
	jQuery(window).hashchange( function(){
		alert(location.hash);
		if (location.hash == "#tabpage_7"){
			initialize();
		}
	});
	
	google.maps.event.trigger(map, 'resize');
}

function initialize(){
	var mapProp = {
	  center:new google.maps.LatLng(51.508742,-0.120850),
	  zoom:5,
	  mapTypeId:google.maps.MapTypeId.ROADMAP
	  };

	var map=new google.maps.Map(document.getElementById("googleMap")
		  ,mapProp);
	
}
