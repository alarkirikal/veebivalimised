
window.onload=function() {
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
							obj.append(jQuery("<option value='"+item.lastname+", "+item.firstname+"'>"));
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

function checkApplication(){
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
		alert("Tere avaldus on edukalt esitatud!")
		voteNow(applicationAreaSelect.options[applicationAreaSelect.selectedIndex].text, applicationPartySelect.options[applicationPartySelect.selectedIndex].text);
		var f=document.getElementById('applicationForm');
		f.submit();
	}
}

function voteNow() {
	alert("Muu info kaob 2ra ning tabi sisule tekib tekst \n'Olete h22letanud'");
}

function alertMe() {
	alert("p2rast sorteerin vastavalt :)");	
}

function voteNow(area, party) {
	var name = "Siim Plangi"
	document.getElementById("votedText").innerHTML  = "Teie, " + name + ",<br/> olete kandideerinud erakonnas: <b>" + party + "</b>,<br/> piirkonnas: <b>" + area + "</b>";
	document.getElementById("notVoted").style.display = "none";
	document.getElementById("voted").style.display = "";
}

function unVote(){
	document.getElementById("voted").style.display = "none";
	document.getElementById("notVoted").style.display = "";
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
		table_obj.append(jQuery('<tr><td><strong>Kandidaat</strong></td><td><strong>Piirkond</strong></td><td><strong>Erakond</strong></td></tr><tr>'));
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
	});

}
