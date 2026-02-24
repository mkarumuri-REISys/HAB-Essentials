define(["require", "exports"], function (require, exports) {
    //component level refernce for the template engine
    var templateEngine = new ko.nativeTemplateEngine();
    function IntializeTemplate(templateName) {
        var d = $.Deferred();
        addTemplate(templateName).then(function () {
            //initialize generic template binder if not already present
            if (!ko.bindingHandlers.genericTemplateBinder) {
                ko.bindingHandlers.genericTemplateBinder = {
                    init: function () {
                        //do not bind decendant elements. That will be done in update
                        return { 'controlsDescendantBindings': true };
                    },
                    // This method is called to initialize the node, and will also be called again if you change what the grid is bound to
                    update: function (element, viewModelAccessor, allBindings) {
                        var viewModel = ko.utils.unwrapObservable(viewModelAccessor());
                        if (!viewModel.templateName) {
                            throw new Error('templateName not defined');
                        }
                        while (element.firstChild)
                            ko.removeNode(element.firstChild);
                        ko.renderTemplate(viewModel.templateName, viewModelAccessor(), { templateEngine: templateEngine }, element, "replaceNode");
                    }
                };
            }
            d.resolve();
        });
        return d;
    }
    exports.IntializeTemplate = IntializeTemplate;
    function addTemplate(templateName) {
        var d = $.Deferred();
        if (document.getElementById(templateName) !== null) {
            d.resolve();
        }
        else {
            require(['text!ko_templates/' + templateName + '.htm'], function (markup) {
                var s;
                //script tags and KO are not compatible for KO 2.2.1
                //try {
                //    s = document.createElement('script');
                //    s.id = templateName;
                //    s.type = 'text/html';
                //    s.innerHTML += markup;
                //} catch (e) {
                s = document.createElement('div');
                s.id = templateName;
                //s.type = 'text/html';
                s.style.display = 'none';
                s.innerHTML += markup;
                //}
                document.body.appendChild(s);
                d.resolve();
            });
        }
        return d;
    }
});
//# sourceMappingURL=KoTemplateManager.js.map