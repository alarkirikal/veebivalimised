// Loading tabs
window.onload=function() {

	var container = document.getElementById("tabContainer");
	var tabcon = document.getElementById("tabscontent");

    // Setting the first tab
    var navitem = document.getElementById("tabHeader_1");
	
    // Storing current tab nr
    var ident = navitem.id.split("_")[1];
	
    navitem.parentNode.setAttribute("data-current",ident);
    navitem.setAttribute("class","tabActiveHeader");

    // Hiding the rest of the tabs
   	 var pages = tabcon.getElementsByClassName("tabpage");
    	for (var i = 1; i < pages.length; i++) {
     	 pages.item(i).style.display="none";
		};

    // onClick listener for tabs
    var tabs = container.getElementsByTagName("li");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].onclick=displayPage;
    }
}

// When a tab is clicked
function displayPage() {

	// Losing previous content
	var current = this.parentNode.getAttribute("data-current");
	document.getElementById("tabHeader_" + current).removeAttribute("class");
	document.getElementById("tabpage_" + current).style.display="none";

	// Showing new content
	var ident = this.id.split("_")[1];
	this.setAttribute("class","tabActiveHeader");
	document.getElementById("tabpage_" + ident).style.display="block";
	this.parentNode.setAttribute("data-current",ident);
}

// Display statistics on selection
function displayStat(tabname) {
	Effect.Fade("statisticsAreaToAppear" + tabname, {duration: 0.5});
	if (document.getElementById("selection" + tabname).value != "") {
		Effect.Appear('loading_img_' + tabname);
		window.setTimeout(function() {
			var selectedOption = document.getElementById("selection" + tabname).options[document.getElementById("selection" +tabname).selectedIndex];
			document.getElementById("areaName" + tabname).innerHTML = selectedOption.text
			Effect.Appear("statisticsAreaToAppear" + tabname, {duration:0.5});
		}, 500);
		Effect.Fade('loading_img_' +tabname);
	}
}

// When print is clicked
function printPage(elem) {
	popup($(elem).html(), elem);
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

function alertMe() {
	alert("p2rast sorteerin vastavalt :)");	
}

function voteNow() {
	alert("Muu info kaob 2ra ning tabi sisule tekib tekst \n'Olete h22letanud'");
}

function start_loading() {
    Effect.Appear('loading_img');
}

function stop_loading() {
    Effect.Fade('loading_img', {duration:0.0});
}


