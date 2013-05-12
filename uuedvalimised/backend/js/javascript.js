var parameters = {};
var online = navigator.onLine;
var letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","š","z","ž","t","u","v","w","õ","ä","ö","ü","x","y"];

window.onload=function() {
	
	getMainPageParametersAndUpdate();
	
	beginMapsLoad();
	
	//getDataForLocalStorage();
	
	jQuery(document).ready( function() {
		jQuery('#tab-container').easytabs();
    });
	
    google.load('visualization', '1.0', {'packages':['corechart']});
    
	var searchFieldContent = document.getElementsByName("candidateSearchByName")[0].value;
    setInterval(function() {
    	if(searchFieldContent != document.getElementsByName("candidateSearchByName")[0].value){
    		searchFieldContent = document.getElementsByName("candidateSearchByName")[0].value;
    		suggestNames(searchFieldContent);
    	}
    	
    	if(document.getElementsByName("candidateSearchByName")[0].value == "" && document.getElementById("search_party").value == "" && document.getElementById("search_region").value == ""){
    		document.getElementById("otsiNupp").value="Kuva kõik kandidaadid";
    	}else{
    		document.getElementById("otsiNupp").value="Otsi kandidaati";
    	}
    	
    	if(navigator.onLine){
    		if(!online){
    			online=true;
    			getMainPageParametersAndUpdate();
    		}
    	}else{
    		online=false;
    	}
    	
	},100);
    
    
    var suggestionsAdded=false;
    
    function addSuggestions(names, name){
    	var obj = jQuery('#candidateSearchByName');
    	jQuery.each(names, function(index, item) {
    		if (index != "id") {
    			if(item.lastname.charAt(0) == name.toUpperCase()){
    				obj.append(jQuery("<option value='"+item.lastname+", "+item.firstname+"'>"));
    			}
    			if(item.firstname.charAt(0) == name.toUpperCase()){
    				obj.append(jQuery("<option value='"+item.firstname+" "+item.lastname+"'>"));
    			}
    		}
    	});
    }
    
    function suggestNames(name){
    	if(name!=""){
    		if(!suggestionsAdded){
    			
    			suggestionsAdded=true;
    			if(navigator.onLine){
    				jQuery.getJSON("myjson?lastname="+name, function(result) {
    			    	addSuggestions(result, name);
    				});
    			}else{
    				var retrievedObject = JSON.parse(localStorage.getItem('myjson?lastname='+name[0]));
    				if(retrievedObject != null){
    					addSuggestions(retrievedObject, name);
    				}
    			}
		    	
    		}
    	}else{
    		jQuery('#candidateSearchByName').empty();
    		suggestionsAdded=false;
    		
    	}
    	
    }    
}
	
	function getMainPageParametersAndUpdate(){
			if(navigator.onLine){
				jQuery.getJSON("mainpageparameters" , function(data){
					jQuery.each(data, function(index, item){
						parameters[index] = item;
					});
					updateAfterMainPage(parameters);
				});
			}else{
				var retrievedObject = JSON.parse(localStorage.getItem('mainpageparameters'));
				jQuery.each(retrievedObject, function(index, item){
					parameters[index] = item;
				});
				updateAfterMainPage(parameters);
			}
	}
	
	function updateAfterMainPage(parameters){
		var loggedInAsDiv = document.getElementById("loggedInAs");
		if (parameters.current_user_name != ""){
			loggedInAsDiv.innerHTML = "Logitud sisse kui: " + parameters["current_user_name"];
			loggedInAsDiv.style.display = "";
			document.getElementById("loggedInAs2").innerHTML = "Logitud sisse kui " + parameters["current_user_name"];
		}
		
		if (parameters.canVote){
			document.getElementById("noVoteAsQuest").style.display = "none";
			document.getElementById("alreadyVoted").style.display = "none";
			document.getElementById("canVote").style.display = "";
		}
		else{
			document.getElementById("canVote").style.display = "none";
			if (parameters.current_user_name == ""){
				document.getElementById("alreadyVoted").style.display = "none";
				document.getElementById("noVoteAsQuest").style.display = "";
		}
			else {
				var alreadyVotedDiv = document.getElementById("votedFor");
				alreadyVotedDiv.innerHTML = "Teie, <strong> " + parameters["current_user_name"] +
											"</strong>, olete juba hääletanud <strong>" 
											+ parameters.vote_isik + 
											"</strong> poolt, kes on erakonnas <strong>" + 
											parameters.vote_party + "</strong> piirkonnas <strong>" + 
											parameters.vote_region + "</strong>.";
				document.getElementById("noVoteAsQuest").style.display = "none";
				document.getElementById("alreadyVoted").style.display = "";
			}
		}
		
		if (parameters.canCandidate){
			document.getElementById("Candidate").style.display = "none";
			document.getElementById("noCandidateAsQuest").style.display = "none";
			document.getElementById("notCandidate").style.display = "";
		}
		else{
			document.getElementById("notCandidate").style.display = "none";
			if (parameters.current_user_name == ""){
				document.getElementById("Candidate").style.display = "none";
				document.getElementById("noCandidateAsQuest").style.display = "";
				
			}
			else {
				var candidateAs = document.getElementById("candidateAs");
				candidateAs.innerHTML = "Olete juba kandideerinud erakonda <strong>" + parameters.cand_party+ "</strong> piirkonnas <strong>" + parameters.cand_region + "</strong>.";
				document.getElementById("noCandidateAsQuest").style.display = "none";
				document.getElementById("Candidate").style.display = "";
			}
		}
	}
	
	
	function drawChart(array, tabname){
		var options = {'title':'Diagramm', 'width':700, 'height':500};
		var data = new google.visualization.DataTable();
		var i;
		data.addColumn('string', 'nimi');
		data.addColumn('number', 'votes');
		for (i = 0; i < array.length; i++)
		{
			data.addRow(array[i]);
		}
		var chart = new google.visualization.PieChart(document.getElementById(tabname + '_chart_div'));
		chart.draw(data, options);
	}
	
	function updateStat() {
		var arrayForChart = new Array();
		var tabname = "";
		if (document.getElementById("tabpage_3").style.display != "none"){
			tabname = "Candidates";
		}
		else if (document.getElementById("tabpage_4").style.display != "none"){
			tabname = "Party";
		}
		else {
			return;
		}
		var area = document.getElementById("selection" + tabname).value;
		if (document.getElementById("selection" + tabname).value != ""){
			document.getElementById("loading_img_" + tabname).style.display = "";
			jQuery('#' + tabname + 'Table').html("");
			jQuery.getJSON("myjson/stat?area=" + area + "&tabname=" + tabname, function(data){
				var totalvotes = 0;
				jQuery.each(data, function(index, item){
						totalvotes = totalvotes + (item.votes);
				});
				jQuery.each(data, function(index, item){
						
					    var row = jQuery("<tr />");
						if (tabname == "Candidates"){
							jQuery("<td />").text(item.firstname + " " + item.lastname).appendTo(row);
							arrayForChart.push([item.firstname + " " + item.lastname, item.votes]);
						}
						else{
							arrayForChart.push([item.party, item.votes]);
						}
						jQuery("<td />").text(item.party).appendTo(row);
						jQuery("<td />").text(item.votes).appendTo(row);
						jQuery("<td />").text(Math.round(item.votes / totalvotes * 100.0) + "%").appendTo(row);
	
						row.appendTo(jQuery('#' + tabname + 'Table'));
				});
				jQuery.getScript("js/sortable.js", function(){
				//Make the table sortable again
					ts_makeSortable(document.getElementById(tabname + "SortTable"));
				});
				drawChart(arrayForChart, tabname);
				
				document.getElementById('loading_img_' + tabname).style.display= "none";
			});
			
		}
	}
	
	// Display statistics on selection
	function displayStat(tabname) {
		
		var area = document.getElementById("selection" + tabname).value;
		document.getElementById("statisticsAreaToAppear" + tabname).style.display="none";
		if (document.getElementById("selection" + tabname).value != "") {
			document.getElementById('loading_img_' + tabname).style.display = "";
			jQuery('#' + tabname + 'Table').html("");
			
			if(navigator.onLine){
				jQuery.getJSON("myjson/stat?area=" + area + "&tabname=" + tabname, function(data){
					displayStatPage(data,tabname);
				});
			}else{
				var retrievedObject = JSON.parse(localStorage.getItem("myjson/stat?area=" + area + "&tabname=" + tabname));
				if(retrievedObject != null){
					displayStatPage(retrievedObject,tabname);
				}
			}
			
			var selectedOption = document.getElementById("selection" + tabname).options[document.getElementById("selection" +tabname).selectedIndex];
			document.getElementById("areaName" + tabname).innerHTML = selectedOption.text;
			setTimeout(function(){
				document.getElementById('loading_img_' +tabname).style.display = "none";
				document.getElementById("statisticsAreaToAppear" + tabname).style.display = "";
			}, 1000);
			
		}
	}
	function displayStatPage(data,tabname){
		var totalvotes = 0;
		var arrayForChart = new Array();
		jQuery.each(data, function(index, item){
				totalvotes = totalvotes + (item.votes);
		});
		jQuery.each(data, function(index, item){
				
			    var row = jQuery("<tr />");
				if (tabname == "Candidates"){
					jQuery("<td />").text(item.firstname + " " + item.lastname).appendTo(row);
					arrayForChart.push([item.firstname + " " + item.lastname, item.votes]);
				}
				else{
					arrayForChart.push([item.party, item.votes]);
				}
				jQuery("<td />").text(item.party).appendTo(row);
				jQuery("<td />").text(item.votes).appendTo(row);
				jQuery("<td />").text(Math.round(item.votes / totalvotes * 100.0) + "%").appendTo(row);
	
				row.appendTo(jQuery('#' + tabname + 'Table'));
		});
		ts_makeSortable(document.getElementById(tabname + "SortTable"));
		drawChart(arrayForChart, tabname);
	}
	
	
	// When print is clicked
	function printPage(elem) {
		popup(jQuery(elem).html(), elem);
	}
	
	function popup(data, elem) {
		var mywindow = window.open('', elem);
		mywindow.document.write('<html><head><title> Statistika </title>');
		mywindow.document.write('<link rel="stylesheet" href="style.css" type="text/css" media="print" />');
		mywindow.document.write('</head><body>');
		mywindow.document.write(data);
		mywindow.document.write('</body></html>');
		
		mywindow.print();
		mywindow.close();
		
		return true;
	}
	
	function checkVoteAndSend(){
		var radiobuttons = document.getElementsByName("selected_candidate");
		var result = false;
		var i;
		var valitud;
		for (i = 0; i < radiobuttons.length; i++){
			if (radiobuttons[i].checked){
				result = true;
				valitud = radiobuttons[i].value;
				break;
			}
		}
		if (!result){
			alert("Te pole kandidaati valinud");
		}
		else {
			if(online){
				var xmlhttp;
				xmlhttp=new XMLHttpRequest();
				xmlhttp.open("POST", "?" +
							"selected_candidate=" + valitud +
							"&person_id=" + parameters.current_user_id +
							"&toDo=make_vote", false);
				xmlhttp.send();
				alert("Teie hääl on arvestatud");
				getMainPageParametersAndUpdate();
			}
		}
	}
	
	function unVote(){
		if(online){
			var xmlhttp;
				xmlhttp=new XMLHttpRequest();
				xmlhttp.open("POST", "?" +
							"person_id=" + parameters.current_user_id +
							"&toDo=delete_vote", false);
				xmlhttp.send();
				alert("Teie hääl on tagasi võetud");
				getMainPageParametersAndUpdate();
		}
	}
	
	function addVoteCandidates(data){
		var table_obj = jQuery('#voting_table_body');
		counter = 0;
		jQuery.each(data, function(index, item) {
			if (index != "id") {
				table_obj.append(jQuery('<tr id=candidate'+counter+'><td><input type="radio" id=candidateSelect'+counter+' name="selected_candidate" value="' + item.cand_id + '"></td><td>' + item.cand_id + '</td><td id=candidateName'+counter+'>' + item.firstname + ' ' + item.lastname + '</td><td id=candidateParty'+counter+'>' + item.party + '</td></tr>'));
				counter++;
			}
		});
	}
	
	function getContent(){ // VOTE PAGE CONTENT 
		start_loading();
		var selectionIndex=document.getElementById('selection').selectedIndex;
		if(selectionIndex != 0){
			jQuery('#voting_table_body').empty();
			document.getElementById('piirkond').innerHTML=document.getElementById('selection').options[selectionIndex].text ;
			if(online){
				jQuery.getJSON("myjson/vote?area="+selectionIndex, function(result){
					addVoteCandidates(result);
				});
			}else{
				var retrievedObject = JSON.parse(localStorage.getItem("myjson/vote?area="+selectionIndex));
				if(retrievedObject != null){
					addVoteCandidates(retrievedObject);
				}
			}
		}
		
		//If the chosen option is without a value
		if (document.getElementById("selection").value == "") {
			document.getElementById("ifVoteDisplayed").value = "waitabit";
			document.getElementById("areaToAppear").style.display = "none";
			window.setTimeout( function() {
				document.getElementById("ifVoteDisplayed").value = "beginning";
				stop_loading();
			}, 500);
			return;
		}
		//
		if (document.getElementById("ifVoteDisplayed").value == "true") {
			document.getElementById("ifVoteDisplayed").value = "false";
			document.getElementById("areaToAppear").style.display = "none";
		}
		
		if (document.getElementById("ifVoteDisplayed").value == "beginning") {
			window.setTimeout( function () {
			function x() {
				document.getElementById("areaToAppear").style.display = "";
				function y() {
					document.getElementById("areaToAppear").style.display = "";
					window.setTimeout( function() {
						stop_loading();
						document.getElementById("ifVoteDisplayed").value = "true";
						return;
					}, 300);
				}
				y();
			}
			x();
			}, 300);
		} else {
		window.setTimeout(function () {
			var image = document.getElementById("imageToSwap");
			var dropd = document.getElementById("selection");
			image.src = dropd.value;
			
			window.setTimeout( function() {
				document.getElementById("areaToAppear").style.display = "";
				document.getElementById("ifVoteDisplayed").value = "true";
				stop_loading();
			}, 200);
		}, 500);
		}
	}
	
	function checkApplicationAndSend(){
		var applicationAreaSelect = document.getElementById("applicationArea");
		var applicationPartySelect = document.getElementById("applicationParty");
		if (applicationAreaSelect.selectedIndex == 0){
			document.getElementById("RedX1").style.display="";
		}
		else {
			document.getElementById("RedX1").style.display="none";
		}
		if(applicationPartySelect.selectedIndex == 0){
			document.getElementById("RedX2").style.display="";
		}
		else {
			document.getElementById("RedX2").style.display="none";
		}
		if(applicationPartySelect.selectedIndex != 0 && applicationAreaSelect.selectedIndex != 0 && online){
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("POST", "?Area=" + applicationAreaSelect.selectedIndex + 
						"&Party=" + applicationPartySelect.selectedIndex +
						"&person_id=" + parameters.current_user_id +
						"&toDo=set_candidate", false);
			xmlhttp.send();
			alert("Tere avaldus on edukalt esitatud!");
			getMainPageParametersAndUpdate();
		}
	}
	
	function unCandidate(){
		if(online){
			var xmlhttp;
			xmlhttp=new XMLHttpRequest();
			xmlhttp.open("POST", "?"+
							"person_id=" + parameters.current_user_id +
							"&toDo=delete_candidate", false);
			xmlhttp.send();
			alert("Teie avaldus on edukalt tagasi võetud.");
			getMainPageParametersAndUpdate();
		}
	}
	
	function start_loading() {
		document.getElementById('loading_img').style.display="";
	}
	
	function stop_loading() {
		document.getElementById('loading_img').style.display="none";
	}
	
	//PALUN JAVASCRIPT MA ANUN SIND
	function getForm(form) {
	
		var name = form.candidateSearchByName.value;
		var party = form.search_party.value.charAt(0).toUpperCase() + form.search_party.value.slice(1);
		var region = form.search_region.value.charAt(0).toUpperCase() + form.search_region.value.slice(1);
	
		jQuery("#myTable").empty();
		jQuery("#kekeke").empty();
		var gotStuff = 0;
		
		var searchParameter = "";
		var isName=false;
		var isParty=false;
		var isArea=false;
		var firstname;
		var lastname;
		
		if( name != ""){
			isName=true;
			var nimi = name.split(", ");
			if(nimi.length===1){
				var nimi2 = name.split(" ");
				searchParameter+="lastname="+nimi2[0];
				lastname=nimi2[0].charAt(0).toUpperCase() + nimi2[0].slice(1);
				firstname="";
				if(nimi2.length > 1){
					searchParameter+="&firstname="+nimi2[1];
					firstname=nimi2[1].charAt(0).toUpperCase() + nimi2[1].slice(1);
				}
			}else{
				searchParameter+="lastname="+ nimi[0] + "&firstname="+nimi[1];
				firstname=nimi[1].charAt(0).toUpperCase() + nimi[1].slice(1);
				lastname=nimi[0].charAt(0).toUpperCase() + nimi[0].slice(1);
			}
			
		}
		if( party != ""){
			isParty=true;
			if(searchParameter!=""){
				searchParameter+="&";
			}
			searchParameter+="party="+party;
		}
		if( region != ""){
			isArea=true;
			if(searchParameter!=""){
				searchParameter+="&";
			}
			searchParameter+="area="+region;
		}
		if(searchParameter === ""){
			searchParameter+="lastname=";
		}
		if(online){
			jQuery.getJSON("myjson?"+searchParameter, function(result){
				var table_obj = jQuery('#myTable');
				table_obj.append(jQuery('<thead><tr><th><strong>Kandidaat</strong></th><th><strong>Piirkond</strong></th><th><strong>Erakond</strong></th></tr></thead>'));
				jQuery.each(result, function(index, item) {
					if (index != "id") {
						gotStuff+=1;
						table_obj.append(jQuery('<tr><td>' + item.firstname + " " + item.lastname + '</td><td>' + item.area + '</td><td>' + item.party + '</td></tr>'));
			
					}
				});
				if (gotStuff == 0) {
					var myDiv = jQuery('#kekeke');
					myDiv.append(jQuery('<h3>P&auml;ringule vastused puuduvad!</h3>'));
				}
				else{
					ts_makeSortable(document.getElementById("myTable"));
					
				}
			});
		}else{
			var table_obj = jQuery('#myTable');
			table_obj.append(jQuery('<thead><tr><th><strong>Kandidaat</strong></th><th><strong>Piirkond</strong></th><th><strong>Erakond</strong></th></tr></thead>'));
		
		
			var retrievedObject = JSON.parse(localStorage.getItem('myjson?lastname='));
			jQuery.each(retrievedObject, function(index, item){
				if(!isArea && !isName && !isParty){
					gotStuff+=1;
					table_obj.append(jQuery('<tr><td>' + item.firstname + " " + item.lastname + '</td><td>' + item.area + '</td><td>' + item.party + '</td></tr>'));
				}else{
					var nameBool;
					if(!isName){
						nameBool=true;
					}else{
						nameBool = ((item.firstname.indexOf(firstname) == 0 && item.lastname.indexOf(lastname) == 0) || (item.firstname.indexOf(lastname) == 0 && item.lastname.indexOf(firstname) == 0));
					}
					var areaBool = (item.area.indexOf(region) == 0);
					var partyBool = (item.party.indexOf(party) == 0);
				
					if(nameBool && areaBool && partyBool){
						gotStuff+=1;
						table_obj.append(jQuery('<tr><td>' + item.firstname + " " + item.lastname + '</td><td>' + item.area + '</td><td>' + item.party + '</td></tr>'));
					}
				}
			});
		
			if (gotStuff == 0) {
				var myDiv = jQuery('#kekeke');
				myDiv.append(jQuery('<h3>P&auml;ringule vastused puuduvad!</h3>'));
			}
			else{
				ts_makeSortable(document.getElementById("myTable"));
				}
			}
		
		}
	
//	function getDataForLocalStorage(){
//		if(!supports_html5_storage() && !online){
//			return;
//		}
//		var counter = -1;
//		var i, letter;
//		for(i = 0;i<letters.length;i++){
//			letter = letters[i];
//	    	jQuery.getJSON("myjson?lastname="+letters[i], function(result) {
//	    		counter++;
//	    		localStorage["myjson?lastname="+letters[counter]] = JSON.stringify(result);
//	//    			var retrievedObject = JSON.parse(localStorage.getItem('myjson?lastname=m'));
//	    			});
//	    		}
//		jQuery.getJSON("myjson?lastname=", function(result) {
//			counter++;
//			localStorage["myjson?lastname="] = JSON.stringify(result);
//	//			var retrievedObject = JSON.parse(localStorage.getItem('myjson?lastname=m'));
//				});
//		
//		jQuery.getJSON("mainpageparameters" , function(data){
//			localStorage["mainpageparameters"] = JSON.stringify(data);
//		});
//		
//		
//		function setCandidates(i) {
//				jQuery.getJSON("myjson/stat?area=" + i + "&tabname=Candidates", function(data){
//					localStorage["myjson/stat?area=" + i + "&tabname=Candidates"] = JSON.stringify(data);
//				});
//			}
//		var j;
//		for(j = 1;j<13;j++){
//			setCandidates(j);
//		}
//		
//		function setParty(i) {
//				jQuery.getJSON("myjson/stat?area=" + i + "&tabname=Party", function(data){
//					localStorage["myjson/stat?area=" + i + "&tabname=Party"] = JSON.stringify(data);
//				});
//			}
//		var k;
//		for(k = 1;k<13;i++){
//			setParty(k);
//		}
//		
//		function setCandidatingCandidates(i) {
//			jQuery.getJSON("myjson/vote?area="+i, function(data){
//				localStorage["myjson/vote?area="+i] = JSON.stringify(data);
//			});
//		}
//	
//		for(i = 1;i<12;i++){
//			setCandidatingCandidates(i);
//		}
//	}
		
	
	function supports_html5_storage() {
//		  try {
//		    return 'localStorage' in window && window['localStorage'] !== null;
//		  } catch (e) {
		    return false;
//		  }
		}
		
	
	var partys = [
				  ["http://maps.google.com/mapfiles/ms/icons/blue-dot.png", "Eestimaa Sinised", "blue"],
				  ["http://maps.google.com/mapfiles/ms/icons/red-dot.png", "Eestimaa Mustad", "red"],
				  ["http://maps.google.com/mapfiles/ms/icons/green-dot.png", "Eestimaa Läbipaistvad", "green"],
				  ["http://maps.google.com/mapfiles/ms/icons/yellow-dot.png", "Eestimaa Kollased", "yellow"],
				  ["http://maps.google.com/mapfiles/ms/icons/orange-dot.png", "Eestimaa Ruudulised", "orange"],
				  ["http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png", "Eestimaa Joonelised", "aqua"],
				  ["http://maps.google.com/mapfiles/ms/icons/red.png", "Tulemused puuduvad", "white"]
				  ];
	
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
					 ];
					 
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
					  "Valimisringkond nr 11: Põlvamaa, Valgamaa, Võrumaa"];
					  
	var markers;
		
	var infoBoxes;
	
	var map;
	
	var results;
	
	function beginMapsLoad(){
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
				results[i] = [parseInt(index, 10), item["party"], item["total"], item["votes"]];
				i++;
			});
			results.sort(myArraySort);
			addMarkers();
		});
	}
	
	function addMarkers(){
		var i;
		var partyArray;
		for (i = 0; i<11; i++){
		partyArray = getColor(results[i][1]);
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
		var i;
		for (i = 0; i<6; i++){
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
		legend.innerHTML = "Erakonnad";
		map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(
			document.getElementById('legend'));	
		var i, icon, name, div;
		for (i = 0; i < 6; i++){
			icon = partys[i][0];
			name = partys[i][1];
			div = document.createElement('div');
			div.innerHTML = '<img src="' + icon + '"> ' + name;
			legend.appendChild(div);
		}
	}
	
	
	function getOptions(i){
		var boxText = document.createElement("div");
		partyArray = getColor(results[i][1]);
		boxText.style.cssText = "border: 1px solid black; margin-top: 8px; background: yellow; padding: 5px; font-weight: bold; font-size: 10px;";
		boxText.style.background = partyArray[2];
		var erakond = partyArray[1];
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

