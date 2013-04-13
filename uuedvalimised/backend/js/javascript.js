var parameters = {};
window.onload=function() {
	
	alert("hai");
	alert(navigator.onLine);
	
	
	var appCache = window.applicationCache;

	appCache.update(); // Attempt to update the user's cache.


	if (appCache.status == window.applicationCache.UPDATEREADY) {
	  appCache.swapCache();  // The fetch was successful, swap in the new cache.
	}
	
	
	function handleCacheEvent(e) {
		 console.log('ma tegin '+e);
		}

		function handleCacheError(e) {
		  alert('Error: Cache failed to update!');
		};

		// Fired after the first cache of the manifest.
		appCache.addEventListener('cached', handleCacheEvent, false);

		// Checking for an update. Always the first event fired in the sequence.
		appCache.addEventListener('checking', handleCacheEvent, false);

		// An update was found. The browser is fetching resources.
		appCache.addEventListener('downloading', handleCacheEvent, false);

		// The manifest returns 404 or 410, the download failed,
		// or the manifest changed while the download was in progress.
		appCache.addEventListener('error', handleCacheError, false);

		// Fired after the first download of the manifest.
		appCache.addEventListener('noupdate', handleCacheEvent, false);

		// Fired if the manifest file returns a 404 or 410.
		// This results in the application cache being deleted.
		appCache.addEventListener('obsolete', handleCacheEvent, false);

		// Fired for each resource listed in the manifest as it is being fetched.
		appCache.addEventListener('progress', handleCacheEvent, false);

		// Fired when the manifest resources have been newly redownloaded.
		appCache.addEventListener('updateready', handleCacheEvent, false);

	
	getMainPageParametersAndUpdate();
	
	jQuery(document).ready( function() {
		jQuery('#tab-container').easytabs();
    });
	
    google.load('visualization', '1.0', {'packages':['corechart']});
    //google.setOnLoadCallback(drawChart);

	
	/*
	// Load the Visualization API and the piechart package.
	google.load('visualization', '1.0', {'packages':['corechart']});

	// Set a callback to run when the Google Visualization API is loaded.
	google.setOnLoadCallback(displayStat);
	*/

	var searchFieldContent = document.getElementsByName("candidateSearchByName")[0].value;
    setInterval(function() {
    	if(searchFieldContent != document.getElementsByName("candidateSearchByName")[0].value){
    		searchFieldContent = document.getElementsByName("candidateSearchByName")[0].value;
    		suggestNames(searchFieldContent);
    	};
    	
    	if(document.getElementsByName("candidateSearchByName")[0].value == "" && document.getElementById("search_party").value == "" && document.getElementById("search_region").value == ""){
    		document.getElementById("otsiNupp").value="Kuva kõik kandidaadid";
    	}else{
    		document.getElementById("otsiNupp").value="Otsi kandidaati";
    	}
    	
	},100);
    
    var suggestionsAdded=false;
    
    function suggestNames(name){
    	if(name!=""){
    		if(!suggestionsAdded){
    			
    			suggestionsAdded=true
		    	jQuery.getJSON("myjson?lastname="+name, function(result) {
					var obj = jQuery('#candidateSearchByName');
					jQuery.each(result, function(index, item) {
						if (index != "id") {
							if(item.lastname.charAt(0) == name.toUpperCase()){
								obj.append(jQuery("<option value='"+item.lastname+", "+item.firstname+"'>"));
							}
							if(item.firstname.charAt(0) == name.toUpperCase()){
								obj.append(jQuery("<option value='"+item.firstname+" "+item.lastname+"'>"));
							}
						}
					});
		    	});
    		}
    	}else{
    		jQuery('#candidateSearchByName').empty();
    		suggestionsAdded=false;
    		
    	}
    	
    }
}

on_message = function(message) {
    console.log("message received");
	alert(message);
  };
  
function getMainPageParametersAndUpdate(){
		parameters = {};
		jQuery.getJSON("mainpageparameters" , function(data){
		
		jQuery.each(data, function(index, item){
			parameters[index] = item;
		});
		
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
		
		
	});
}


function drawChart(array, tabname){
	var options = {'title':'Diagramm', 'width':700, 'height':500};
	var data = new google.visualization.DataTable();
	data.addColumn('string', 'nimi');
	data.addColumn('number', 'votes');
	for (var i = 0; i < array.length; i++){
		data.addRow(array[i]);
	}
	var chart = new google.visualization.PieChart(document.getElementById(tabname + '_chart_div'));
	chart.draw(data, options);
}

function updateStat() {
	
	/*if (area != upDatedArea){
		console.log("piirkonnad ei klapi");
		return
	}*/
	var tabname = "";
	if (document.getElementById("tabpage_3").style.display != "none"){
		tabname = "Candidates";
	}
	else if (document.getElementById("tabpage_4").style.display != "none"){
		tabname = "Party";
	}
	else {
		return
	}
	var area = document.getElementById("selection" + tabname).value;
	if (document.getElementById("selection" + tabname).value != ""){
		Effect.Appear('loading_img_' + tabname);
		jQuery('#' + tabname + 'Table').html("");
		jQuery.getJSON("myjson/stat?area=" + area + "&tabname=" + tabname, function(data){
			var totalvotes = 0
			jQuery.each(data, function(index, item){
					totalvotes = totalvotes + (item.votes)
			});
			jQuery.each(data, function(index, item){
					
				    var row = jQuery("<tr />");
					if (tabname == "Candidates"){
						jQuery("<td />").text(item.firstname + " " + item.lastname).appendTo(row);
						arrayForChart.push([item.firstname + " " + item.lastname, item.votes])
					}
					else{
						arrayForChart.push([item.party, item.votes])
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
			console.log(arrayForChart);
			drawChart(arrayForChart, tabname);
			Effect.Fade('loading_img_' + tabname);
		});
		
	}
}

// Display statistics on selection
function displayStat(tabname) {
	var arrayForChart = new Array();
	var area = document.getElementById("selection" + tabname).value;
	document.getElementById("statisticsAreaToAppear" + tabname).style.display="none";
	if (document.getElementById("selection" + tabname).value != "") {
		Effect.Appear('loading_img_' + tabname);
		jQuery('#' + tabname + 'Table').html("");
		jQuery.getJSON("myjson/stat?area=" + area + "&tabname=" + tabname, function(data){
			var totalvotes = 0
			jQuery.each(data, function(index, item){
					totalvotes = totalvotes + (item.votes)
			});
			jQuery.each(data, function(index, item){
					
				    var row = jQuery("<tr />");
					if (tabname == "Candidates"){
						jQuery("<td />").text(item.firstname + " " + item.lastname).appendTo(row);
						arrayForChart.push([item.firstname + " " + item.lastname, item.votes])
					}
					else{
						arrayForChart.push([item.party, item.votes])
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
			console.log(arrayForChart);
			drawChart(arrayForChart, tabname);
		});
		
		var selectedOption = document.getElementById("selection" + tabname).options[document.getElementById("selection" +tabname).selectedIndex];
		document.getElementById("areaName" + tabname).innerHTML = selectedOption.text;
		setTimeout(function(){
			Effect.Fade('loading_img_' +tabname);
			Effect.Appear("statisticsAreaToAppear" + tabname, {duration: 0.5});
		}, 1000);
		
	}
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
	for (var i = 0; i < radiobuttons.length; i++){
		if (radiobuttons[i].checked){
			result = true;
			var valitud = radiobuttons[i].value;
			break;
		}
	}
	if (!result){
		alert("Te pole kandidaati valinud");
	}
	else {
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("POST", "main?" +
					"selected_candidate=" + valitud +
					"&person_id=" + parameters.current_user_id +
					"&toDo=make_vote", false);
		xmlhttp.send();
		alert("Teie hääl on arvestatud");
		getMainPageParametersAndUpdate();
	}
}

function unVote(){
	var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("POST", "main?" +
					"person_id=" + parameters.current_user_id +
					"&toDo=delete_vote", false);
		xmlhttp.send();
		alert("Teie hääl on tagasi võetud");
		getMainPageParametersAndUpdate();
}

function getContent(){ // VOTE PAGE CONTENT 
	start_loading();
	
	var selectionIndex=document.getElementById('selection').selectedIndex;
	if(selectionIndex != 0){
		jQuery('#voting_table_body').empty();
		document.getElementById('piirkond').innerHTML=document.getElementById('selection').options[selectionIndex].text ;
			jQuery.getJSON("myjson/vote?area="+selectionIndex, function(result){
			var table_obj = jQuery('#voting_table_body');
			jQuery.each(result, function(index, item) {
				if (index != "id") {
					table_obj.append(jQuery('<tr><td><input type="radio" name="selected_candidate" value="' + item.cand_id + '"></td><td>' + item.cand_id + '</td><td>' + item.firstname + ' ' + item.lastname + '</td><td>' + item.party + '</td></tr>'));
					}
			});
		});
	}
	
	//If the chosen option is without a value
	if (document.getElementById("selection").value == "") {
		document.getElementById("ifVoteDisplayed").value = "waitabit";
		console.log("esimese valiku algus");
		console.log(document.getElementById("ifVoteDisplayed").value);
		Effect.Fade("areaToAppear", {duration: 0.5});
		window.setTimeout( function() {
			document.getElementById("ifVoteDisplayed").value = "beginning";
			console.log("esimese valiku l6pp");
			console.log(document.getElementById("ifVoteDisplayed").value);
			stop_loading();
		}, 500);
		return;
	}
	//
	if (document.getElementById("ifVoteDisplayed").value == "true") {
		document.getElementById("ifVoteDisplayed").value = "false";
		console.log("from 1 to 0, start");
		new Effect.Opacity("areaToAppear", {from: 1.0, to:0, duration:0.2});
		console.log("from 1 to 0, end");
	}
	
	if (document.getElementById("ifVoteDisplayed").value == "beginning") {
		window.setTimeout( function () {
		function x() {
			Effect.Appear("areaToAppear", {duration: 0.2});
			function y() {
				document.getElementById("areaToAppear").style.display = "";
				console.log("beginning, hakkan ootama");
				window.setTimeout( function() {
					stop_loading();
					document.getElementById("ifVoteDisplayed").value = "true";
					console.log("beginning, l6petasin ootamise");
					return;
				}, 300);
			}
			y();
		}
		x();
		}, 300);
	} else {
	console.log('peaks nagu tekitama ka nyyd 0 to 1-i');
	window.setTimeout(function () {
		var image = document.getElementById("imageToSwap");
		var dropd = document.getElementById("selection");
		image.src = dropd.value;
		
		window.setTimeout( function() {
			new Effect.Opacity("areaToAppear", {from:0, to:1.0, duration:0.2});
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
		new Effect.Highlight("applicationArea");
		document.getElementById("RedX1").style.display="";
	}
	else {
		document.getElementById("RedX1").style.display="none";
	}
	if(applicationPartySelect.selectedIndex == 0){
		new Effect.Highlight("applicationParty");
		document.getElementById("RedX2").style.display="";
	}
	else {
		document.getElementById("RedX2").style.display="none";
	}
	if(applicationPartySelect.selectedIndex != 0 && applicationAreaSelect.selectedIndex != 0){
		var xmlhttp;
		xmlhttp=new XMLHttpRequest();
		xmlhttp.open("POST", "main?Area=" + applicationAreaSelect.selectedIndex + 
					"&Party=" + applicationPartySelect.selectedIndex +
					"&person_id=" + parameters.current_user_id +
					"&toDo=set_candidate", false);
		xmlhttp.send();
		alert("Tere avaldus on edukalt esitatud!");
		getMainPageParametersAndUpdate();
	}
}

function unCandidate(){
	var xmlhttp;
	xmlhttp=new XMLHttpRequest();
	xmlhttp.open("POST", "main?"+
					"person_id=" + parameters.current_user_id +
					"&toDo=delete_candidate", false);
	xmlhttp.send();
	alert("Teie avaldus on edukalt tagasi võetud.");
	getMainPageParametersAndUpdate();
}

function start_loading() {
    Effect.Appear('loading_img');
}

function stop_loading() {
    Effect.Fade('loading_img', {duration:0.0});
}

//PALUN JAVASCRIPT MA ANUN SIND
function getForm(form) {

	var name = form.candidateSearchByName.value;
	var party = form.search_party.value;
	var region = form.search_region.value;

	jQuery("#myTable").empty();
	jQuery("#kekeke").empty();
	var gotStuff = 0;
	
	var searchParameter = "";
	
	if( name != ""){
		var nimi = name.split(", ");
		if(nimi.length===1){
			var nimi2 = name.split(" ");
			searchParameter+="lastname="+nimi2[0];
			if(nimi2.length > 1){
				searchParameter+="&firstname="+nimi2[1];
			}
		}else{
			searchParameter+="lastname="+ nimi[0] + "&firstname="+nimi[1];
		}
		
	}
	if( party != ""){
		if(searchParameter!=""){
			searchParameter+="&";
		}
		searchParameter+="party="+party;
	}
	if( region != ""){
		if(searchParameter!=""){
			searchParameter+="&";
		}
		searchParameter+="area="+region;
	}
	if(searchParameter === ""){
		searchParameter+="lastname=";
	}
		
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
			jQuery.getScript("js/sortable.js", function(){
					//Make the table sortable again
				ts_makeSortable(document.getElementById("myTable"));
			});
		}
	});

}
