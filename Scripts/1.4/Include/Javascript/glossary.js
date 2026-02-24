/********************************************************************************
The following functions deal with the hover definitions found through out the 
site.  For example, in the banking form.
*******************************************************************************/


function regenerate()
{
  window.location.reload();
}


function getCoordinates(e)
{

   //e is the event
   if (IE)
   {
      x_coor = event.clientX + document.body.scrollLeft;
      y_coor = event.clientY + document.body.scrollTop;
   }
   else
   {
      x_coor = e.pageX;
      y_coor = e.pageY;
   }
}
function showLayer(layer_id, definedSafe)
{
  
  var safeDistance = 300;
  var blnContinue  = false;
  
  if ( definedSafe )
    safeDistance = definedSafe;

   var layerWidth = 200;

    x_coor = x_coor - 100 ;
   /* ***************************************************
      This was written for SWBPI and since BVP has frames
      we don't change the x_coor
      
   if ( x_coor + layerWidth > safeDistance )
   {
      x_coor -= (x_coor + layerWidth) - safeDistance;
   }
   ******************************************************/

   if ( IE ) { 
   	if ( document.all.item(layer_id) != null ) { 
		blnContinue  = true;
	}
   } else { 
   	blnContinue  = true;
   }
   
   if ( blnContinue  == true ) { 
	   changeLayerCoors(x_coor, y_coor, layer_id);

	   if ( IE )
	   {
		document.all.item(layer_id).style.visibility = 'visible';	
	   }
	   if ( NS )
	   {
	      document.layers[layer_id].visibility = 'show';
	   }
	   if ( NN6 )
	      document.getElementById(layer_id).style.visibility="visible";
    }
}

function hideLayer (layer_id)
{

  var blnContinue  = false;


   if ( IE ) { 
   	if ( document.all.item(layer_id) != null ) { 
		blnContinue  = true;
	}
   } else { 
   	blnContinue  = true;
   }

   if ( blnContinue  == true ) { 
	   if ( IE )
	   {
	      document.all.item(layer_id).style.visibility = 'hidden';
	   }
	   if ( NS )
	   {
	       document.layers[layer_id].visibility = 'hide';
	   }
	   if ( NN6 )
	      document.getElementById(layer_id).style.visibility = 'hidden';
    }
}

function changeLayerCoors(x_coor, y_coor, layer_id)
{
   if ( IE )
   {
      document.all.item(layer_id).style.left = x_coor + 90;
      document.all.item(layer_id).style.top = y_coor + 15;
   }
   if ( NS )
   {
      document.layers[layer_id].moveTo(x_coor + 90, y_coor + 15);
   }
   if ( NN6 )
   {
      document.getElementById(layer_id).style.left = x_coor + 90;
      document.getElementById(layer_id).style.top = y_coor + 15 ;
   }
}


	var IE = false;
	var NS=false;
	var NN6=false;
	var browser_version = parseInt(navigator.appVersion);
	var browser_type = navigator.appName;

	if (browser_type == "Microsoft Internet Explorer" && (browser_version >= 4))
	{
		IE = true;
	}
	else if (browser_type == "Netscape" && (browser_version >= 4) && (browser_version < 6))
	{
		NS = true;
	}
	else if (browser_type == "Netscape" && (browser_version >= 6))
	{
		NN6 = true;
	}

	if(document.layers){
	    NS = true;
	}
	if(document.all){
	    IE = true;
	}
	if(!document.all && document.getElementById){
	    NN6 = true; NS = false;
	}


	if ( NS ) {  	

		document.captureEvents(Event.MOUSEMOVE);
	}
	document.onmousemove = getCoordinates;

	if ( NS ) {
	//  if (window.document.layers)
		window.onresize = regenerate;
	}

	var x_coor = 0;
	var y_coor = 0;

