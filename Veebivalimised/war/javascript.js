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

    // onclick listener for tabs
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

function swapImage(){
	var image = document.getElementById("imageToSwap");
	var dropd = document.getElementById("selection");
	image.src = dropd.value;
}









