function Hide(controlId)
{
    document.getElementById(controlId).style.display='none';
    RestoreFromCache(document.getElementById(controlId));
}
function Show(controlId)
{
    document.getElementById(controlId).style.display='';
}
if (!(controlRenderingsCache))
{
    var controlRenderingsCache= new Object();
}
function ToggleVisibility(controlId,useCache,hideOthers)
{
    var elementToToggle=document.getElementById(controlId);
    if (elementToToggle.style.display=='')
    {
        if (useCache)
        {
            RestoreFromCache(elementToToggle);
            
        }
        ClearElementPositioning(elementToToggle);
        elementToToggle.style.display='none';    
    }
    else
    {
        if (hideOthers)
        {
            //We are showing an editable popout.
            var top;
            var bottom;
            var left;
            var right;
            HideAll(controlId);
            //Gather the bounds since they could change after the popout.
            top=TopBound();
            bottom=BottomBound();
            left=LeftBound();
            right=RightBound();
            //Show the element.
            elementToToggle.style.display='';
            PositionJustOpenedElementAppropriately(elementToToggle,left,right,top,bottom);
        }
        else
        {
            elementToToggle.style.display='';
        }
    }
}
function Cache(controlReference)
{
    controlRenderingsCache[controlReference.id]=controlReference.innerHTML;
}
function RestoreFromCache(controlReference)
{
    if (controlRenderingsCache[controlReference.id])
    {
        controlReference.innerHTML=controlRenderingsCache[controlReference.id];
    }
}