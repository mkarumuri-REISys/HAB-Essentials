/// Global search

GlobalSearch = {
    ResultUrl: null
    , AutoCompleteUrl: null
    , Cache: {}
    , LastXhr: null
    , RegisterControl: function(location) {
        $("input#queryText" + location).autocomplete({
            source: function(request, response) {
                var term = request.term;
                if (term in GlobalSearch.Cache) {
                    response(GlobalSearch.Cache[term]);
                    return;
                }
                //console.log("select[id$='categoryList" + location + "'] :selected");
                //console.log($("select[id$='categoryList" + location + "'] :selected").val());
                //console.log($("select[id$='categoryList" + location + "'] :selected"));
                var ServiceUrl = GlobalSearch.AutoCompleteUrl + (GlobalSearch.AutoCompleteUrl.indexOf("?") === -1 ? "?" : "&") + "query=" + escape($("input#queryText" + location).val())
                                                     + "&categoryVal=" + escape($("select[id$='categoryList" + location + "'] :selected").val())
                                                     + "&categoryText=" + escape($("select[id$='categoryList" + location + "'] :selected").text())
                                                       + "&UserId=" + REISys.Platform.CurrentUserId;
                GlobalSearch.LastXhr =
                $.ajax({
                    type: "GET",
                    url: ServiceUrl,
                    dataType: "text",
                    success: function(data, status, xhr) {
                        var obj = JSON.parse(data);
                        GlobalSearch.Cache[term] = data;
                        if (xhr === GlobalSearch.LastXhr) {
                            response(obj);
                        }
                    }
                });

                //                $.getJSON(ServiceUrl, request, function(data, status, xhr) {
                //                    GlobalSearch.Cache[term] = data;
                //                    if (xhr === GlobalSearch.LastXhr) {
                //                        response(data);
                //                    }
                //                });
            }
        , appendTo: "#disableStyles" + location
        , minLength: 3
        , delay: 500
        , open: function(event, ui) {
            $("div#disableStyles" + location + " li").css('list-style', 'none');
            $("div#disableStyles" + location + " li").css('float', 'none');
            $("div#disableStyles" + location + " a").css('float', 'none');
            $("div#disableStyles" + location + " ul").css("padding-left", "10px");
            if (location === "Bottom")
                $("div#disableStyles" + location).css("bottom", "36px");
        }
            //, select: function(event, ui) { alert(ui.item.value); }
        });
        //console.log($("input#searchbtn" + location));
        $("input#searchBtn" + location).click(function(event) {
            //console.log("select[id$='categoryList" + location + "'] :selected");
            event.preventDefault();
            window.location = GlobalSearch.ResultUrl + ( GlobalSearch.ResultUrl.indexOf("?") === -1 ? "?" : "&") +"query="+ escape($("input#queryText" + location).val())
                                                     + "&categoryVal=" + escape($("select[id$='categoryList" + location + "'] :selected").val())
                                                     + "&categoryText=" + escape($("select[id$='categoryList" + location + "'] :selected").text())
                                                     + "&UserId=" + REISys.Platform.CurrentUserId ;
        });
    }
}

// Function to create namespaces.
function searchnamespace(namespaceString) {
    var parts = namespaceString.split('.'),
        parent = window,
        currentPart = '';
    for (var i = 0, length = parts.length; i < length; i++) {
        currentPart = parts[i];
        parent[currentPart] = parent[currentPart] || {};
        parent = parent[currentPart];
    }
    return parent;
}

///////////////////////////////////////////////////////////////////////////////////////
// creates the name space for contributions
