/* Used in old UI MasterPage.master.cs */
jQuery.browser = {};
(function () {
    jQuery.browser.msie = false;
    jQuery.browser.version = 0;
    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
        jQuery.browser.msie = true;
        jQuery.browser.version = RegExp.$1;
    }
})();
//Allows user to tab out of rich text box
function RadEditorLoadRemoveTabHold(editor, args) {

    editor.attachEventHandler("onkeydown", function (e) {
        editor.removeShortCut("InsertTab");
        if (e.keyCode == '9') {
            if ($telerik.isSafari) {
                $get("Button1").focus();
                e.preventDefault();
                e.preventBubble();
                e.stopPropagation();
            }
        }
    });
}

jQuery.fn.truncate = function (max, settings) {
    settings = jQuery.extend({
        chars: /\s/,
        trail: ["...", ""]
    }, settings);
    var myResults = {};
    //// $.browser was deprecated prior to 1.9, and has been REMOVED in 1.9
    var ie = $.browser.msie;
    //// I replaced it with this
    var myIE = navigator.appVersion.indexOf("MSIE") !== -1;
    function fixIE(o) {
        if (ie) {
            o.style.removeAttribute("filter");
        }
        if (myIE) {
            o.style.removeAttribute("filter");
        }
    }

    return this.each(function() {
        var $this = jQuery(this);
        var myStrOrig = $this.html().replace(/\r\n/gim, "");
        var myStr = myStrOrig;
        var myRegEx = /<\/?[^<>]*\/?>/gim;
        var myRegExArray;
        var myRegExHash = {};
        var myResultsKey = $("*").index(this);
        var orgMax = max;
        while ((myRegExArray = myRegEx.exec(myStr)) != null) {
            myRegExHash[myRegExArray.index] = myRegExArray[0];
        }
        myStr = jQuery.trim(myStr.split(myRegEx).join(""));
        if (myStr.length > max) {
            var c;
            while (max < myStr.length) {
                c = myStr.charAt(max);
                if (c.match(settings.chars)) {
                    myStr = myStr.substring(0, max);
                    break;
                }
                if (max == 0) {
                    myStr = myStrOrig.substring(0, orgMax); /*PFM-2316: Bug fix until a patch is made to fix this problem*/
                    break;
                }  
                max--;
            }
            if (myStrOrig.search(myRegEx) != -1) {
                var endCap = 0;
                for (eachEl in myRegExHash) {
                    myStr = [myStr.substring(0, eachEl), myRegExHash[eachEl], myStr.substring(eachEl, myStr.length)].join("");
                    if (eachEl < myStr.length) {
                        endCap = myStr.length;
                    }
                }
                $this.html([myStr.substring(0, endCap), myStr.substring(endCap, myStr.length).replace(/<(\w+)[^>]*>.*<\/\1>/gim, "").replace(/<(br|hr|img|input)[^<>]*\/?>/gim, "")].join(""));
            } else {
                $this.html(myStr);
            }
            myResults[myResultsKey] = myStrOrig;
            $this.html(["<span class='truncate_less'>", $this.html(), settings.trail[0], "</span>"].join(""))
            .find(".truncate_show", this).click(function () {
                if ($this.find(".truncate_more").length == 0) {
                	$this.append(["<span class='truncate_more' style='display: none;'>", myResults[myResultsKey], settings.trail[1], "</span>"].join(""))
                    .find(".truncate_hide").click(function () {
                        $this.find(".truncate_more").css("background", "#fff").fadeOut("fast", function() {
                            $this.find(".truncate_less").css("background", "#fff").fadeIn("fast", function() {
                                fixIE(this);
                                $(this).css("background", "none");
                            });
                            fixIE(this);
                            $this.find('.truncate_less > a').focus();
                        });
                        return false;
                    });
                }
                $this.find(".truncate_less").fadeOut("normal", function () {
                    
                    $this.find(".truncate_more").fadeIn("normal", function() {
                        fixIE(this);
                    });
                    fixIE(this);
                    $this.find('.truncate_more > a').focus();
                });
                jQuery(".truncate_show", $this).click(function () {
                    $this.find(".truncate_less").css("background", "#fff").fadeOut("normal", function() {
                        $this.find(".truncate_more").css("background", "#fff").fadeIn("normal", function() {
                            fixIE(this);
                            $this.find('.truncate_more > a').focus();
                            $(this).css("background", "none");
                        });
                        fixIE(this);
                        $this.find('.truncate_more > a').focus();
                    });
                    return false;
                });
                return false;
            });
        }
    });
};
