Sys.Application.add_load(function () {
    if (Sys.WebForms.PageRequestManager.getInstance().get_isInAsyncPostBack()) {
        TransactionValidation();
    }
});

$(document).ready(function () {
    jQuery(function () {
        if (jQuery("a[type='TranValdExists']").length > 0) {
            TransactionValidation();

        }
    }
);
});

function TransactionValidation() {
    $.get(REISys.Platform.WebRoot + 'Platform/Interface/Validation/overlayMarkup.html', function (data) {
        $('#overlayExplain').remove();
        $('#overlayIgnoreConfirm').remove();
        $('#ajaxMessage').remove();
        var formatedData = String.format(data, '{0}', REISys.Platform.WebRoot + '/Platform/Include/Skins/' + REISys.Platform.Theme + '/Images/loader2.GIF');
        $('body').append(formatedData);
        REISys.Platform.TransactionalValidator.Init();
    });
}

var expandMainAded = false;
REISys.Platform.TransactionalValidator =
{
    ValidationStatus: function (key) {
        var valStatus = new Array()
        valStatus["Fixed"] = 0;
        valStatus["Explained"] = 2;
        valStatus["Hidden"] = 3;
        valStatus["Pending_Review"] = 1;
        return valStatus[key];
    },
    oldHtml: '',
    overlayExplained: undefined,
    explainLink: undefined,
    baseUrl: REISys.Platform.WebRoot + 'Platform/WebServices/ValidationService.svc',
    Init: function () {
        // Collpase all of them intially
        //alert(this);

        var $j = $telerik.$;

        $j("a.expandValidation").each(function () {
            $j(this).click(function () {
                var item = $(this);

                if (item.html() === "[-]") {
                    item.html("[+]");
                    item.next().hide();
                } else {
                    item.html("[-]");
                    item.next().show();
                }
            })
        });

        if (!expandMainAded) {
            expandMainAded = true;
            $j('#showAllExplain').on('click', function () {
                var mainLink = $(this);
                var CurrentText = mainLink.html();
                if (CurrentText === 'Show All Explanations') {
                    mainLink.html("Hide All Explanations");
                    $j("a.expandValidation").each(
                function () {
                    var item = $(this);
                    if (item.html() === "[+]") {
                        item.html("[-]");
                        item.next().show();
                    }
                }
                );

                }
                else {

                    mainLink.html("Show All Explanations");
                    $j("a.expandValidation").each(
                function () {
                    var item = $(this);
                    if (item.html() === "[-]") {
                        item.html("[+]");
                        item.next().hide();
                    }
                }
            );


                }
            }

       );
        }
        // Attach the overlay to the explain Link
        $("a[type='explainLink']").overlay({
            mask: {
                color: '#000',
                loadSpeed: 200,
                opacity: 0.30
            },
            closeOnClick: false,
            closeOnEsc: true,
            onBeforeLoad: LoadContentFromServer
        });


        // When explain Link is clicked
        function LoadContentFromServer() {
            //PFM-7550 - Make close button (x mark) focusable
            this.getOverlay().find(".close").attr("tabindex", "0");
            this.getOverlay().find(".close").keydown(function (e) { if (e.keyCode === 13) { self.close() } });
            // grab wrapper element inside content
            var wrap = this.getOverlay().find(".contentWrapExplain");
            REISys.Platform.TransactionalValidator.overlayExplained = this;
            var loadingMessage = $("#ajaxMessage").html();
            var wrapHtml = String.format(loadingMessage, 'Loading....');
            wrap.html(wrapHtml);

            var self = this;
            self.onClose = function () { wrap.html(wrapHtml) };
            self.onError = function () { alert('there is an error'); };
            var queryObj = $.query.load(this.getTrigger().attr("href"));
            //alert($("div.#defaultGroup"+queryObj.get('id')).html());
            // load the page specified in the trigger
            //                var encodedStr=$("input.#"+queryObj.get('id')+"hidden").val();
            //                alert(encodedStr);
            explainLink = this.getTrigger();
            wrap.load(this.getTrigger().attr("href") + "&showOverlay=true #explainDivToLoad"
                          , function (response, status, xhr) {
                              if (status == "error") {
                                  wrap.html(response);
                                  return;
                              }
                              var divtag = $("div#" + queryObj.get('dId'));
                              $('.closeOverlay', this).click(function () { self.close() });
                              if (divtag.children('span[style]').length == 0)
                                  $('#validationMessage').html($('<div>').append(divtag.clone()).remove().html());
                              else
                                  $('#validationMessage').html($('<div>').append(divtag.clone().children('span[style]').empty().parent()).remove().html());
                              $('.valimg.tooltip', $('#validationMessage')).attr('title', valTitleattributes[queryObj.get('dId')]);
                              $('.valimg.tooltip', $('#validationMessage')).tipTip();
                              //Attach the click event of save
                              $('#valiMessage').hide();
                              REISys.Platform.TransactionalValidator.ExplainLoad(queryObj, explainLink);
                              $('a.close', '#overlayExplain').focus();//PFM-7550 - When the overlay is open, it should capture focus
                          }
                          );   // end wrap.load

        }

        //Preserve the Ignore message so that it can be reset after the ignore sucess or failure
        oldHtml = $('#messageDiv', $('#overlayIgnoreConfirm')).html();

        var triggers = $("a[type='ignoreLink']").overlay({
            // some expose tweaks suitable for modal dialogs
            mask: {
                color: '#000',
                loadSpeed: 200,
                opacity: 0.30
            },
            closeOnClick: false,
            closeOnEsc: true,
            onLoad: function () {
                // attach the events to the buttons on each load
                var self = this;
                var params = this.getTrigger().attr("href");
                // this is to close the overlay on button click
                $('.closeOverlay', $(this.getTrigger().attr("rel"))).click(
                                                                function () {
                                                                    self.close()
                                                                }
                                                    );
                //unBind all clicks of yes button
                $('.yesButton', $(this.getTrigger().attr("rel"))).unbind('click');
                // bind click of yes again.
                $('.yesButton', $(this.getTrigger().attr("rel")))
                                .click(
                                        function (event) {
                                            // click event of the yes button
                                            REISys.Platform.TransactionalValidator.ignoreValidationYes(this, self, params, event);
                                        }
                                       );

            }
        });

    },
    // When Yes is click in ignore confirmation box    
    ignoreValidationYes: function (btn, modal, params, event) {

        var linkObj = modal.getTrigger();
        var parentDiv = linkObj.attr("rel");
        var divMessage = $('#messageDiv', parentDiv);

        divMessage.html(String.format($("#ajaxMessage").html(), 'Processing ....'));

        $('input', parentDiv).hide();

        var queryVar = $.query.load(params);

        var tranObj = {
            validation: {
                ValidationId: queryVar.get('id'),
                GroupId: queryVar.get('gId'),
                PageId: queryVar.get('pId'),
                ResourceValue: queryVar.get('rv'),
                ResourceTypeCode: queryVar.get('rtc'),
                Status: REISys.Platform.TransactionalValidator.ValidationStatus("Hidden"),
                Explaination: '  ',
                UserId: REISys.Platform.CurrentUserId
            }
        };
        //alert(REISys.Platform.TransactionalValidator.ValidationStatus("Hidden"));
        REISys.Platform.TransactionalValidator.callProxy(linkObj, tranObj, divMessage, modal, parentDiv, queryVar);
        event.preventDefault();
    },
    //Function that actually ignores the validation
    callProxy: function (linkObj, tranObj, divMessage, modal, parentDiv, queryVar) {
        var divtag = $("div#" + queryVar.get('dId'));
        var Proxy = new REISys.Platform.Util.ServiceProxy(REISys.Platform.TransactionalValidator.baseUrl);
        Proxy.invoke('IgnoreValidation'
                    , tranObj,
                    function (result) {
                        // processing was successfull. In that case when modal is closed hide the row and parent row. 
                        //divMessage.html(result);
                        modal.onClose = function () {
                            divMessage.html(oldHtml);
                            // As of now state of drop down in not bein considered
                            //logic for Grid
                            var pageIdofGroup = queryVar.get('pId');
                            var pageIdExists = $('td[PageId="' + pageIdofGroup + '"]');
                            if (pageIdExists != undefined) {
                                linkObj.parents('tr').hide();
                                var groupHeaderRow = pageIdExists.parents('tr');
                                if (groupHeaderRow != undefined) {
                                    var headerSiblings = groupHeaderRow.nextUntil('.rgGroupHeader');
                                    headerSiblings = headerSiblings.filter(':visible');
                                    if (headerSiblings.length <= 0) {
                                        pageIdExists.parents('tr').hide();
                                    }
                                }
                            }
                            //logic for page
                            // validation summary
                            linkObj.parents('li').hide();
                            //field level error
                            linkObj.parents('div.fielderr_info').hide();
                            // Show the input buttons since message is gone.
                            $('input', parentDiv).show();
                            $(modal).unbind('onClose');
                        };
                        //$('#noButton', parentDiv).attr('value', 'Close');
                        //$('#noButton', parentDiv).show();
                        modal.close();
                        //alert(result);
                    },
                    function (message) {
                        // Something went wrong on server
                        if (message.WebIgnoreValidationResult == undefined)
                            divMessage.html("Error:: " + message.Message);
                        else
                            divMessage.html("Error:: " + message.WebIgnoreValidationResult);
                        modal.onClose = function () {

                            divMessage.html(oldHtml);
                            $('input', parentDiv).show();
                            $('#noButton', parentDiv).attr('value', 'No');
                            $(modal).unbind('onClose');

                        };
                        $('#noButton', parentDiv).attr('value', 'Close');
                        $('#noButton', parentDiv).show();
                    }
                    );
    },
    ExplainLoad: function (queryObj, explainLink) {
        //   $("#ctl00_MainContent_inputExplain_commentsRichTextbox_rEditorBottomResizer").hide();
        //<'%=commentsRichTextbox.RadEditor.ClientID %'>

        $("input[id$='saveContBtn']").click(function (event) {
            event.preventDefault();

            REISys.Platform.TransactionalValidator.TranObj = { validation: {
                ValidationId: queryObj.get("id"),
                GroupId: queryObj.get("gId"),
                PageId: queryObj.get("pId"),
                ResourceValue: queryObj.get("rv"),
                ResourceTypeCode: queryObj.get("rtc"),
                Explanation: '',
                Status: REISys.Platform.TransactionalValidator.ValidationStatus("Explained"),
                //Ignored: $('input[name$=ignoreValidation]:checked').val(),
                UserId: REISys.Platform.CurrentUserId
            }
            };
            var Proxy = new REISys.Platform.Util.ServiceProxy(REISys.Platform.TransactionalValidator.baseUrl);

            // get the value of the textbox rest will be there in querystring
            var commentsByUser = $("textarea[id$='commentsRichTextbox']").val();
            if (commentsByUser.length == 0) {
                $('#valiMessage').show();
                $('#valiMessage label').text("Provide Comments.");
                return;
            }
            else if (commentsByUser.length > 500) {
                $('#valiMessage').show();
                $('#valiMessage label').text("Provide up to 500 characters for comments.");
                return;
            }
            REISys.Platform.TransactionalValidator.TranObj.validation.Explanation = commentsByUser;

            Proxy.invoke('ExplainValidation',
                          REISys.Platform.TransactionalValidator.TranObj,
                          function (result) {
                              REISys.Platform.TransactionalValidator.overlayExplained.close();
                              //logic for the grid
                              var pageIdofGroup = queryObj.get('pId');
                              var pageIdExists = $('td[PageId="' + pageIdofGroup + '"]')
                              if (pageIdExists != undefined) {
                                  explainLink.parents('tr').hide();
                                  var groupHeaderRow = pageIdExists.parents('tr');
                                  if (groupHeaderRow != undefined) {
                                      var headerSiblings = groupHeaderRow.nextUntil('.rgGroupHeader');
                                      headerSiblings = headerSiblings.filter(':visible');
                                      if (headerSiblings.length <= 0) {
                                          pageIdExists.parents('tr').hide();
                                      }
                                  }
                              }
                              //logic for page
                              // validation summary
                              explainLink.parents('li').hide();
                              //field level error
                              explainLink.parents('div.fielderr_info').hide();

                          },
                          function (message) {
                              $(".contentWrapExplain").html(message.Message);
                              $('#closeExplained', $(".contentWrapExplain")).click(function () { REISys.Platform.TransactionalValidator.overlayExplained.close() });
                          })

            var loadingMessage = $("#ajaxMessage").html();
            var wrapHtml = String.format(loadingMessage, 'Processing....');
            $(".contentWrapExplain").html(wrapHtml);

            event.preventDefault();

        });

    }
}