window.onload = begin;

var partys = [
			  ["http://maps.google.com/mapfiles/ms/icons/blue-dot.png", "Eestimaa Sinised", "blue"],
			  ["http://maps.google.com/mapfiles/ms/icons/red-dot.png", "Eestimaa Mustad", "red"],
			  ["http://maps.google.com/mapfiles/ms/icons/green-dot.png", "Eestimaa Läbipaistvad", "green"],
			  ["http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", "Eestimaa Kollased", "yellow"],
			  ["http://maps.google.com/mapfiles/ms/icons/orange-dot.png", "Eestimaa Ruudulised", "orange"],
			  ["http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png", "Eestimaa Joonelised", "aqua"],
			  ["http://maps.google.com/mapfiles/ms/icons/red.png", "Tulemused puuduvad", "white"]
			  ]

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
				  
var markers;
	
var infoBoxes;

var map;

var results;

function begin(){
	jQuery(window).hashchange( function(){
		if (location.hash == "#tabpage_7"){
			initialize();
		}
	});
}

function initialize(){

	markers = [];
	
	infoBoxes = [];
	
	getJsonDataAndAddMarkers();
	
	createMap();

	createLegend();
}

function myArraySort(a,b){
	return ((a[0] < b[0]) ? -1 : ((a[0] > b[0]) ? 1 : 0));
}

function getJsonDataAndAddMarkers(){
	results = new Array();
	jQuery.getJSON("myjson/map", function(data){
		var i = 0;
		jQuery.each(data, function(index, item){
			results[i] = [parseInt(index), item["party"], item["total"], item["votes"]];
			i++;
		});
		results.sort(myArraySort);
		addMarkers();
	});
}

function addMarkers(){
	for (var i = 0; i<11; i++){
	var partyArray = getColor(results[i][1]);
	markers[i] = new google.maps.Marker({
		  icon: partyArray[0],
		  position: myLatLngs[i],
		  map: map,
		  title: piirkonnad[i]
	});
	infoBoxes[i] = new InfoBox(getOptions(i));
	addListeners(i);	
	}
}

function getColor(party){
	for (var i = 0; i<6; i++){
		if (partys[i][1] == party){
			return partys[i];
		}
	}
	return partys[6];
}

function addListeners(i){
	google.maps.event.addListener(markers[i], "mouseover", function(){
			infoBoxes[i].open(map, markers[i]);
		});
	google.maps.event.addListener(markers[i], "mouseout", function(){
			infoBoxes[i].close();
		});
}

function createMap(){
	var mapProp = {
	  center:new google.maps.LatLng(58.528742,25.370850)
	  ,zoom:7
	  ,mapTypeId:google.maps.MapTypeId.ROADMAP
	  ,panControl: false
	  ,zoomControl: true
	  ,mapTypeControl: false
	  ,scaleControl: false
	  ,streetViewControl: false
	  ,overviewMapControl: false
	  };

	map=new google.maps.Map(document.getElementById("googleMap")
		  ,mapProp);
	google.maps.event.trigger(map, 'resize');
}

function createLegend(){
	var legend = document.createElement("div");
	document.getElementById("googleMap").appendChild(legend);
	legend.id = "legend";
	legend.innerHTML = "Juhtivate erakonnad";
	map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
		document.getElementById('legend'));	
	for (var i = 0; i < 6; i++){
		var icon = partys[i][0];
		var name = partys[i][1];
		var div = document.createElement('div');
		div.innerHTML = '<img src="' + icon + '"> ' + name;
		legend.appendChild(div);
	}
}


function getOptions(i){
	var boxText = document.createElement("div");
	partyArray = getColor(results[i][1]);
	boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px; font-weight: bold; font-size: 10px;";
	boxText.style.background = partyArray[2];
	var erakond = partyArray[1]
	var osakaal; 
	if (partyArray[1] == "Tulemused puuduvad"){
		osakaal = "0";
	}
	else{
		osakaal = Math.round(results[i][3]*100.0/results[i][2]);
	}	
	boxText.innerHTML = piirkonnad[i] + "<br />Juhtiv erakond: " + partyArray[1] + "<br />Häälte osakaal: " + osakaal + "%";
	var options = {
                 content: boxText
                ,disableAutoPan: false
                ,maxWidth: 0
                ,pixelOffset: new google.maps.Size(-100, 0)
                ,zIndex: null
                ,boxStyle: {
				  width: "260px",
                  opacity: 0.75
                 }
				,closeBoxURL: ""
                ,infoBoxClearance: new google.maps.Size(1, 1)
                ,isHidden: false
                ,pane: "floatPane"
                ,enableEventPropagation: false
    };
	return options;
}