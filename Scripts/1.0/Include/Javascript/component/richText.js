

function setPastedTextFontSize(sender, args, fontSize, fontFamily) {

    var value = args.get_value(); //this is the pasted content
    var newDiv = $('<div>' + value + '</div>');
    $('*', newDiv).css({ 'fontSize': fontSize, 'font-family': fontFamily });
    args.set_value(newDiv.html());
}