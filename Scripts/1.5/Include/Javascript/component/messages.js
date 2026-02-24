/// <reference path="../lib/PlatformLib.js" />
// Message Template
//Sys.Application.add_load
//$(document).ready(function () {
//    if (typeof messageJSONNote !== 'undefined') {
//        REISys.Platform.Layout.NoteMessages.__loadModel(messageJSONNote);
//    }
//    if (typeof messageJSONConfirmation !== 'undefined') {
//        REISys.Platform.Layout.ConfirmationMessages.__loadModel(messageJSONConfirmation);
//    }
//    if (typeof messageJSONSuccess !== 'undefined') {
//        REISys.Platform.Layout.SuccessMessages.__loadModel(messageJSONSuccess);
//    }
//    if (typeof messageJSONError !== 'undefined') {
//        REISys.Platform.Layout.ErrorMessages.__loadModel(messageJSONError);
//    }
//    if (typeof messageJSONWarning !== 'undefined') {
//        REISys.Platform.Layout.WarningMessages.__loadModel(messageJSONWarning);
//    }
//});
var messagesNameSpace = Namespace("REISys.Platform.Layout");
function MessageModel(data) {
    var self = this;
    self.Model = data;
    self.messages = ko.observableArray(self.Model[0].Messages);
    self.caption = ko.observable(self.Model[0].Caption);
    self.visible = ko.observable(self.Model[0].Visible);
    self.mainClass = self.Model[0].MainClass;
    self.imgSrc = self.Model[0].ImgSrc;
    self.headerClass = self.Model[0].HeaderClass;
    self.headerText = self.Model[0].HeaderText;
    self.captionClass = self.Model[0].CaptionClass;
    self.messageClass = self.Model[0].MessageClass;
}
messagesNameSpace.BindMessagesModel = function (viewModel, viewId) {
    try {
        ko.applyBindings(viewModel, viewId);
    }
    catch (e) {
        PlatformConsole.log('Error occured in bind the messages for ' + viewId);
    }
}
messagesNameSpace.NoteMessages = (function () {
    function getModel(controlId) {
        if (controlId)
            return ko.dataFor($('#' + controlId + '')[0]);
        else
            return ko.dataFor($('div.notesbase.showmsgiconintoolbar.dummyNoteMessage')[0]);
    }
    this.removeAll = function (controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.removeAll();
    }
    this.getLength = function (controlId) {
        var viewModel = getModel(controlId);
        return viewModel.messages().length;
    }
    this.addMessages = function (msg, controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.push(msg);
    }
    this.setVisible = function (flag, controlId) {
        var viewModel = getModel(controlId);
        viewModel.visible(flag);
    }
    this.setCaption = function (caption, controlId) {
        var viewModel = getModel(controlId);
        viewModel.caption(caption);
    }
    this.LoadModel = function (data, viewId) {
        //var domElement = $('#clientsideNoteMessages');
        //var domElement = $('#' + viewId);
        //alert(domElement);
        //alert('#' + viewId);
        //var notePlaceHolder = domElement[0];
        //if (notePlaceHolder) {
        var viewModel = new MessageModel(data);
        //ko.applyBindings(viewModel, viewId);
        var mymodel = $('#' + viewId + '')[0];
        if (mymodel)
            REISys.Platform.Layout.BindMessagesModel(viewModel, mymodel);
        // Below code is specific to handle 508 scenario.
        //if (viewModel.visible() === false) viewId.html('');
        //}
    }
    return {
        __loadModel: LoadModel,
        addMessages: addMessages,
        getMessageLength: getLength,
        removeAllMessages: removeAll,
        setVisible: setVisible,
        setCaption: setCaption
    }
})();
messagesNameSpace.SuccessMessages = (function () {
    function getModel(controlId) {
        if (controlId)
            return ko.dataFor($('#' + controlId + '')[0]);
        else
            return ko.dataFor($('div.successbase.showmsgiconintoolbar.dummySuccessMessage')[0]);
    }
    this.removeAll = function (controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.removeAll();
    }
    this.getLength = function (controlId) {
        var viewModel = getModel(controlId);
        return viewModel.messages().length;
    }
    this.addMessages = function (msg, controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.push(msg);
    }
    this.setVisible = function (flag, controlId) {
        var viewModel = getModel(controlId);
        viewModel.visible(flag);
        if (flag) {

            $('.dummySuccessMessage').attr('aria-live', 'polite');

        } else {
            $('.dummySuccessMessage').removeAttr('aria-live');
        }

        // Below code is specific to handle 508 scenario.
        //if (flag === false) $('#clientsideSuccessMessages').html('');
    }
    this.setCaption = function (caption, controlId) {
        var viewModel = getModel(controlId);
        viewModel.caption(caption);
    }
    //this.LoadModel = function (data) {
    //    var successPlaceHolder = $('#clientsideSuccessMessages')[0];
    //    if (successPlaceHolder) {
    //        viewModel = new MessageModel(data);
    //        ko.applyBindings(viewModel, $('#clientsideSuccessMessages')[0]);
    //        // Below code is specific to handle 508 scenario.
    //        if (viewModel.visible() === false) $('#clientsideSuccessMessages').html('');
    //    }
    //}
    this.LoadModel = function (data, viewId) {
        var viewModel = new MessageModel(data);
        var mymodel = $('#' + viewId + '')[0];
        if (mymodel)
            REISys.Platform.Layout.BindMessagesModel(viewModel, mymodel);
    }
    return {
        __loadModel: LoadModel,
        addMessages: addMessages,
        getMessageLength: getLength,
        removeAllMessages: removeAll,
        setVisible: setVisible,
        setCaption: setCaption
    }
})();
messagesNameSpace.WarningMessages = (function () {
    function getModel(controlId) {
        if (controlId)
            return ko.dataFor($('#' + controlId + '')[0]);
        else
            return ko.dataFor($('div.warningbase.dummyWarningMessage')[0]);
    }
    this.removeAll = function (controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.removeAll();
    }
    this.getLength = function (controlId) {
        var viewModel = getModel(controlId);
        return viewModel.messages().length;
    }
    this.addMessages = function (msg, controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.push(msg);
    }
    this.setVisible = function (flag, controlId) {
        var viewModel = getModel(controlId);
        viewModel.visible(flag);
        if (flag) {
            $('.dummyWarningMessage').attr('aria-live', 'polite');

        } else {
            $('.dummyWarningMessage').removeAttr('aria-live');
        }
    }
    this.setCaption = function (caption, controlId) {
        var viewModel = getModel(controlId);
        viewModel.caption(caption);
    }
    this.LoadModel = function (data, viewId) {
        var viewModel = new MessageModel(data);
        var mymodel = $('#' + viewId + '')[0];
        if (mymodel)
            REISys.Platform.Layout.BindMessagesModel(viewModel, mymodel);
    }

    return {
        __loadModel: LoadModel,
        addMessages: addMessages,
        getMessageLength: getLength,
        removeAllMessages: removeAll,
        setVisible: setVisible,
        setCaption: setCaption
    }
})();
messagesNameSpace.ConfirmationMessages = (function () {
    function getModel(controlId) {
        if (controlId)
            return ko.dataFor($('#' + controlId + '')[0]);
        else
            return ko.dataFor($('div.confirmbase.showmsgiconintoolbar.dummyConfimMessage')[0]);
    }
    this.removeAll = function (controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.removeAll();
    }
    this.getLength = function (controlId) {
        var viewModel = getModel(controlId);
        return viewModel.messages().length;
    }
    this.addMessages = function (msg, controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.push(msg);
    }
    this.setVisible = function (flag, controlId) {
        var viewModel = getModel(controlId);
        viewModel.visible(flag);
        if (flag) {
            $('.dummyConfimMessage').attr('aria-live', 'polite');

        } else {
            $('.dummyConfimMessage').removeAttr('aria-live');
        }
    }
    this.setCaption = function (caption, controlId) {
        var viewModel = getModel(controlId);
        viewModel.caption(caption);
    }
    this.LoadModel = function (data, viewId) {
        var viewModel = new MessageModel(data);
        var mymodel = $('#' + viewId + '')[0];
        if (mymodel)
            REISys.Platform.Layout.BindMessagesModel(viewModel, mymodel);
    }
    return {
        __loadModel: LoadModel,
        addMessages: addMessages,
        getMessageLength: getLength,
        removeAllMessages: removeAll,
        setVisible: setVisible,
        setCaption: setCaption
    }
})();
messagesNameSpace.ErrorMessages = (function () {
    function getModel(controlId) {
        if (controlId)
            return ko.dataFor($('#' + controlId + '')[0]);
        else
            return ko.dataFor($('div.errorBase.showmsgiconintoolbar.dummyErrorMessage')[0]);
    }
    this.removeAll = function (controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.removeAll();
    }
    this.getLength = function (controlId) {
        var viewModel = getModel(controlId);
        return viewModel.messages().length;
    }
    this.addMessages = function (msg, controlId) {
        var viewModel = getModel(controlId);
        viewModel.messages.push(msg);
    }
    this.setVisible = function (flag, controlId) {
        var viewModel = getModel(controlId);
        viewModel.visible(flag);
        if (flag) {
            $('.dummyErrorMessage').attr('aria-live', 'assertive');
        } else {
            $('.dummyErrorMessage').removeAttr('aria-live');
        }

    }
    this.setCaption = function (caption, controlId) {
        var viewModel = getModel(controlId);
        viewModel.caption(caption);
    }
    this.LoadModel = function (data, viewId) {
        var viewModel = new MessageModel(data);
        var mymodel = $('#' + viewId + '')[0];
        if (mymodel)
            REISys.Platform.Layout.BindMessagesModel(viewModel, mymodel);
    }
    return {
        __loadModel: LoadModel,
        addMessages: addMessages,
        getMessageLength: getLength,
        removeAllMessages: removeAll,
        setVisible: setVisible,
        setCaption: setCaption
    }
})();
