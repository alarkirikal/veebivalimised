window.onload = begin;

var myLatLngs = [
				 new google.maps.LatLng(59.455555,24.697000),
				 new google.maps.LatLng(59.426900,24.755000),
				 new google.maps.LatLng(59.400000,24.686000),
				 new google.maps.LatLng(59.156220, 24.807129),
				 new google.maps.LatLng(58.830804, 23.752441),
				 new google.maps.LatLng(59.306562, 26.328735),
				 new google.maps.LatLng(59.282720, 27.465820),
				 new google.maps.LatLng(58.602611, 25.625610),
				 new google.maps.LatLng(58.538161, 26.515503),
				 new google.maps.LatLng(58.375078, 26.721840),
				 new google.maps.LatLng(57.936725, 26.864319)
				 ]
				 
var piirkonnad = ["Valimisringkond nr 1: Haabersti, Põhja-Tallinn, Kristiine",
				  "Valimisringkond nr 2: Kesklinn, Lasnamäe, Pirita",
				  "Valimisringkond nr 3: Mustamäe, Nõmme",
				  "Valimisringkond nr 4: Harjumaa, Raplamaa",
				  "Valimisringkond nr 5: Läänemaa, Saaremaa, Hiiumaa",
				  "Valimisringkond nr 6: Lääne-Virumaa",
				  "Valimisringkond nr 7: Ida-Virumaa",
				  "Valimisringkond nr 8: Viljandimaa, Järvamaa",
				  "Valimisringkond nr 9: Jõgevamaa, Tartumaa",
				  "Valimisringkond nr 10: Tartu",
				  "Valimisringkond nr 11: Põlvamaa, Valgamaa, Võrumaa"]
				  
				 
				 
				 
				 
	

function begin(){
	jQuery(window).hashchange( function(){
		if (location.hash == "#tabpage_7"){
			initialize();
		}
	});
	
	
}

function initialize(){

	var markers = [];

	var mapProp = {
	  center:new google.maps.LatLng(58.528742,25.370850),
	  zoom:7,
	  mapTypeId:google.maps.MapTypeId.ROADMAP
	  };

	var map=new google.maps.Map(document.getElementById("googleMap")
		  ,mapProp);
	google.maps.event.trigger(map, 'resize');
	
	for (var i = 0; i<11; i++){
		markers[i] = new google.maps.Marker({
			  position: myLatLngs[i],
			  map: map,
			  title: piirkonnad[i]
		});
	}
	
}
