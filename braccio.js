//arduino_address defualt address
var arduino_address="linino.local";
$("#arduino_address").val(arduino_address);

	
/*Run on page loaded*/
$(document).ready(function() {		
	//Show proper functions for Braccio		
	if(window.location.href.indexOf("?Commands")!=-1){	
		$("#commands").show();
		$("#motors").hide();
	}else{
		$("#commands").hide();
		$("#motors").show();
	}	

	arduino_address=getUrlVars()["arduino_address"];
	if((arduino_address+"")!='undefined'){				
		if (arduino_address=="") arduino_address=="linino.local";
		$("#arduino_address").val(arduino_address);
	}
	if(inIframe()){
		$('.hiddenoniframe').hide();
		$('.showoniframe').show();
	}
	else{
		$(".hiddenoniframe").show();
		$('.showoniframe').hide();
	}

	//Desktop event
	$('.motorValue').mousemove(function(){
            var value = $(this).val();
            var id = $(this).attr('id');
            $('#'+id+'-output').text(value);
        });

	$('.motorValue').mouseup(function(){
            var id= $(this).attr('id');
	    var command=id+'/value:' + this.value;
	    sendCommand(command);
        });

	//Touch event
	$('.motorValue').bind('touchmove',function(e){
	    var value = $(this).val();
            var id = $(this).attr('id');
            $('#'+id+'-output').text(value);
	});

	$('.motorValue').bind('touchend',function(e){
	    var id= $(this).attr('id');
	    var command=id+'/value:' + this.value;
	    sendCommand(command);
	});

	$('.braccioCommand').click(function(){
            var command= $(this).attr('id');	    
	    sendCommand(command);
        });
});

/**
Check if the page is on an iFrame 
*/
function inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

/*
Show or hide the passed id
*/
function showhide(id){
	if ($('#'+id).is(":hidden")) 
	   $('#'+id).show();
	else
	   $('#'+id).hide();
}


/**
A setup function for ajax commands
*/
function setup(){
	$.ajaxSetup({
		crossDomain : true,
		dataType: "jsonp", 
		xhrFields: { withCredentials: true},
		type: 'GET'
	});
	
	//bind the address to the URL
	arduino_address = $("#arduino_address").val();
	var host="http://" + arduino_address + "/arduino/";
	
	//If you want store this page on your YUN you have to uncomment this part	
	//host="/arduino/";
	
	return host;
}

/**
Handle the address to store the data in the URL
*/
function linkhandler(a){
	a.href="?" + a.href.split("?")[1];
	var val = '&arduino_address=' + $("#arduino_address").val();	
	
	a.href=a.href + val;
	a.href = a.href.replace(val+val,val);
}

/*
Javascript function to send REST commands to your Arduino Board.
*/
function sendCommand(command) {			
	var host=setup();
	$.get(host + command, function(data){});
	
	/*
	Alternative way but remove ajax setup
	$.ajax({
		crossDomain : true,
		dataType: "jsonp", 
		xhrFields: { withCredentials: true}	,
		type: 'GET',			
		url: "http://"+host+"/arduino/" + data
	
	});
	*/
	
	if(command=="THROWSPONGE"){
	  alert("NOW USER, PICK UP THE SPONGE!");
	}
}

/*
Handle slider command
*/
function sendMotorValue(me){
	var id= $(me).attr('id')
	var command=id+'/value:' + me.value;
	sendCommand(command);
}

function outputSliderValue(me){
	var id= $(me).attr('id')
	$('#'+id+'-output').text(value);
}

/**
Store cookies
*/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

/**
Retrive cookies
*/
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

/*
Get variables from URL
*/
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

/*
Store a variable on the URL
*/
function setUrlVars(variable, value) {	
	//window.open(window.location.href + '?Commands', '_self');
	locationval=window.location.href;
		
	//Add ? if there isn't
	if(locationval.indexOf("?")==-1)
		locationval+="?";
	
	//Check if the variable is present in the url
	if((getUrlVars()[variable]+"")!="undefined"){		
		var rep = variable + "=" + getUrlVars()[variable];
		var locationtmp = (locationval+"").replace(rep, "");		
	}else
		locationtmp = locationval;
	var tmp = locationtmp + '&' + variable +"="+value;	
	var newlocation = tmp.replace("&&", "&");	
	window.open(newlocation, '_self');
	
}

