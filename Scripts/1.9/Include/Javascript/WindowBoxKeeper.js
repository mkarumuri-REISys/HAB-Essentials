//Routines from Robert Andrews for keeping parameter boxes in the Search And List page's List view in the window.
//You should be able to reuse this code.

//precondition for module: jQuery must be installed.

function Width()
{
    return $(window).width();
}
function Height()
{
    return $(window).height();
}
function LeftBound()
{
    return $(window).scrollLeft();
}
function RightBound()
{
    return LeftBound() + Width();
}
function TopBound()
{
    return $(window).scrollTop();
}
function BottomBound()
{
    return TopBound() + Height();
}
function WidthOf(element)
{
    return $(element).outerWidth();
}
function HeightOf(element)
{
    return $(element).outerHeight();
}
function TopOf(element)
{
    return $(element).position().top;
}
function BottomOf(element)
{
    return TopOf(element) + HeightOf(element);
}
function LeftOf(element)
{
    return $(element).position().left;
}
function RightOf(element)
{
    return LeftOf(element) + WidthOf(element);
}
var currentParameterPopout;
function RepositionIfNecessary(newPos,bound,element,property,sign)
{
    var styleObject=element.style;
    if ((sign*newPos)>bound)
    {
        //alert('stylin ' + property + ' cuz ' + (sign*newPos) + '>' + bound);
        styleObject[property]=0;
    }
    else
    {
        //alert('aint stylin ' + property + ' cuz ' + (sign*newPos) + '<=' + bound);
    }
}
function PositionAppropriately(element, left, right, top, bottom)
//Pre: element is an object that implements all attributes and methods consumed below.
//Pre: left,right,top,bottom hold the dimensions of the viewport before element was made visible.
//Could be refactored for greater efficiency.
{
    //alert('repos');
    currentParameterPopout=element;
    RepositionIfNecessary(LeftOf(element),left,element,"left",-1);
    RepositionIfNecessary(RightOf(element),right,element,"right",1);
    RepositionIfNecessary(TopOf(element),top,element,"top",-1);
    RepositionIfNecessary(BottomOf(element),bottom,element,"bottom",1);
}

function PositionJustOpenedElementAppropriately(element, left, right, top, bottom)
{
    $(element.id).bind("resize",RepositionCurrentParameterPopout);
    ClearElementPositioning(element);
    PositionAppropriately(element, left, right, top, bottom);
}
function ClearElementPositioning(element)
{
    var elementStyle=element.style;
    elementStyle.left='';
    elementStyle.right='';
    elementStyle.top='';
    elementStyle.bottom='';
}
var alreadyPlanningAReposition=false;
function ArrangeForRepositioningOfCurrentParameterPopout()
{
    RepositionCurrentParameterPopout();
    //Set a timeout to adjust position again because I have not found a way to detect when an object such as a parameter bar is resized.
    window.setTimeout(RepositionCurrentParameterPopout,2000);
}
function RepositionCurrentParameterPopout()
{
    if (currentParameterPopout)
    {
        ClearElementPositioning(currentParameterPopout);
        PositionAppropriately(currentParameterPopout,LeftBound(),RightBound(),TopBound(),BottomBound());        
    }
}
function Test()
{
    alert('worked');
}
//Bind the window resize handler.  You may also want to bind another, such as a parameter bar.
$(window).bind("resize",ArrangeForRepositioningOfCurrentParameterPopout);