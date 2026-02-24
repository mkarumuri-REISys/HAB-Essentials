

// This is used to attach to form and activate the client side validation
// Sets up the settings for client side validation, initiates it to use groups, sets the look, etc

$(document).ready(function () {
    $("#aspnetForm").validate({
        errorClass: "fielderr_info",
        onsubmit: false,
        //onkeyup: false,
        //onfocusout: false,
        //onclick: false,
        errorPlacement: function (error, element) {
            var strng = error;
            strng.append("<span class='topicon_area'>" +
								"(<a href='#errortop' class='topicon tooltip'>" +
									"<img src='" + REISys.Platform.ImageRoot + "/errortop.png' alt='Go to top'>" +
								"</a>)" +
							"</span>");
            $("[id$=_Valid]").html(strng);
            //$("[id$='"+element.attr('id')+"_Valid']").html(strng);
        },
        highlight: function (element, errorClass) {
            $(element).addClass('fieldreq');
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('fieldreq');
        },
        showErrors: function (errorMap, errorList) {
            var errorMessages = { ctl00_MainContent_TextBox1: { message: 'stuff'} };
            var errors = this.errorList;
            for (var i = 0; i < errors.length; i++) {
                var error = errors[i];
                var ctl = errors[i].element;
                error.message = errorMessages[ctl.id].message;
            }
            $('#summary').html('<div id="valBase" class="showmsgiconintoolbar ">' +
	                        '<a name="errortop"></a><div id="msgHeader">' +
		                        '<img class="tooltip" alt="Validation Errors" src="' + REISys.Platform.ImageRoot + '/val_msgheader.png" alttemp="Validation Errors">' +
		                        '<span class="msgFail">Error:</span>' +
		                        '<span class="msgFailsub">One or more errors have occurred.</span>' +
	                        '</div><div id="val_msgarea">' +
		                        '<ul class="val_list">' +
			                        '<li><img alt="Rigid Error" class="valimg tooltip" src="' + REISys.Platform.ImageRoot + '/rigid.png">' +
			                        'Federal Share plus Non-Federal Share must equal Total Approved Budget' + '</li>' +
		                        '</ul>' +
	                        '</div>' +
                        '</div>');
            this.defaultShowErrors();
        }
        //    			,
        //    			messages :{
        //    				<%= TextBox1.ClientID %>:{
        //    					minlength:"stuff",
        //    					maxlength:"otherstuff"
        //    				}
        //    			}
    })
});
    	$("input").click(function(evt) {
    		// Validate the form and retain the result.
    		var isValid = $("#aspnetForm").valid();
    		// If the form didn't validate, prevent the
    		//  form submission.
    		if (!isValid)
    			evt.preventDefault();
    	});

//***********************************************
//  Adds validation methods and types like cRule
//***********************************************
$(document).ready(function() {
    //Validation Methods that are not standard in jQuery Validation Framework

    $.validator.addMethod(
				"clientRule",
				function(value, element, params) {
				    var op = params.op;
				    var bool;
				    bool = params.functionOne(this);
				    return bool;
				},
				"Please check your input."
		);

    //Validates based on cRule bool values
				$.validator.addMethod(
				"cRule",
				function(value, element, params) {
				    var op = params.op;
				    var bool;
				    var rules = params.functions;
				    switch (op.toLowerCase()) {
				        case 'and':
				            bool = true;
				            for (var i = 0; i < rules.length; i++) {
				                bool = params.functions[i](this);
				                if (!bool)
				                    break;
				            }
				            //bool=params.functionOne(this)&&params.functionTwo(this);
				            break;
				        case 'or':
				            bool = false;
				            for (var i = 0; i < rules.length; i++) {
				                bool = params.functions[i](this);
				                if (bool)
				                    break;
				            }
				            break;
				        case 'xor':
				            var nrTrue = 0;
				            bool = false;
				            for (var i = 0; i < rules.length; i++) {
				                bool = params.functions[i](this);
				                if (bool)
				                    nrTrue++;
				            }
				            if (nrTrue == 1)
				                bool = true;
				            else
				                bool = false;
				            break;
				        case 'nor':
				            bool = false;
				            for (var i = 0; i < rules.length; i++) {
				                bool = !params.functions[i](this);
				                if (!bool)
				                    break;
				            }
				            break;
				        case 'nand':
				            bool = false;
				            for (var i = 0; i < rules.length; i++) {
				                bool = !params.functions[i](this);
				                if (bool)
				                    break;
				            }
				            break;
				        case 'then':
				            bool = false;
				            for (var i = 0; i < rules.length; i++) {
				                bool = params.functions[i](this);
				                if (!bool)
				                    break;
				            }
				            break;
				    }
				    return bool;
				},
				"Please check your input."
		);


    //Regex Validation Method
    $.validator.addMethod(
				"regex",
				function(value, element, regexp) {
				    if (regexp.constructor != RegExp)
				        regexp = new RegExp(regexp);
				    else if (regexp.global)
				        regexp.lastIndex = 0;
				    return regexp.test(value);
				},
				"Please check your input."
		);



    //Equal method
    $.validator.addMethod(
			"equal",
			function(value, element, comparison) {
			    return value == comparison;
			},
			jQuery.format("This does not equal {0}.")
		);

    //Not Equal method
    $.validator.addMethod(
			"notEqual",
			function(value, element, comparison) {
			    return value != comparison;
			},
			jQuery.format("This should not equal {0}.")
		);
    //SSN method
    $.validator.addMethod(
			"ssn",
			function(value, element) {
			    var regexp = "[0-9]{3}-[0-9]{2}-[0-9]{4}";
			    var re = new RegExp(regexp);
			    return re.test(value);
			},
			jQuery.format("This is not a ssn.")
		);

    //USD method
    $.validator.addMethod(
			"USD",
			function(value, element) {
			    var regexp = "[0-9]*//.[0-9]*{2}";
			    var re = new RegExp(regexp);
			    return re.test(value);
			},
			jQuery.format("This is not in a monetary format(USD).")
		);

    //Password validator, ensures one uppercase, one lowercase, one number, one special character, and more than 6 chars
    $.validator.addMethod(
			"password",
			function(value, element) {

			    var regexp = ".*(?=.{8,20}$)(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&amp;+=]).*$";
			    var re = new RegExp(regexp);
			    return re.test(value);
			},
			jQuery.format("This is not a valid password.  A password must contain at least one special character, one number, one alpha, and must be more than 6 characters long.")
		);
});