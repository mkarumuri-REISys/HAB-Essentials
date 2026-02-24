var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var ExceptionManagement;
        (function (ExceptionManagement) {
            var ErrorModel = (function () {
                function ErrorModel() {
                }
                return ErrorModel;
            })();
            var WebWorkerLogger = (function () {
                function WebWorkerLogger(interval, serviceUrl, configServiceUrl) {
                    var _this = this;
                    this.HttpQueueWorkerJs = 'E8FDC20D-02D5-4CC5-8AA4-2235B7034F53';
                    this.Log = function (message) {
                        if (_this.pollInternal > 0)
                            _this.Logger.postMessage({ action: "enqueue", message: message });
                        else
                            _this.SendToServer(message);
                    };
                    this.SendToServer = function (message) {
                        _this.Logger.postMessage({ action: "sendToServer", message: (message ? message : null) });
                    };
                    this.pollInternal = interval;
                    this.serviceUrl = serviceUrl;
                    this.configServiceUrl = configServiceUrl;
                    var item = { 'Key': this.HttpQueueWorkerJs };
                    ExceptionManager.SendXmlHttpRequest(item, this.configServiceUrl, function (data) {
                        _this.Logger = new Worker(JSON.parse(data).Value);
                        _this.Logger.onmessage = function (event) {
                            var url = JSON.parse(event.data).Url;
                            if (url && url != '')
                                ExceptionManager.ProcessResponse(url);
                        };
                        _this.Logger.postMessage({
                            action: "setHeader",
                            header: {
                                url: _this.serviceUrl,
                                pollInterval: _this.pollInternal
                            }
                        });
                    });
                }
                return WebWorkerLogger;
            })();
            var InPageLogger = (function () {
                function InPageLogger(interval, serviceUrl) {
                    var _this = this;
                    this.localQueue = [];
                    this.Log = function (input) {
                        if (_this.pollInternal > 0)
                            _this.localQueue.push(input);
                        else
                            _this.SendToServer(input);
                    };
                    this.SendToServer = function (message) {
                        if (_this.pollInternal < 1 && message) {
                            var msg;
                            if (!(message instanceof Array))
                                msg = [message];
                            else
                                msg = message;
                            ExceptionManager.SendXmlHttpRequest(msg, _this.serviceUrl, function (data) {
                                var url = JSON.parse(data).Url;
                                if (url && url != '')
                                    ExceptionManager.ProcessResponse(url);
                            });
                        }
                        else if (_this.localQueue && _this.localQueue.length > 0) {
                            ExceptionManager.SendXmlHttpRequest(_this.localQueue, _this.serviceUrl, function (data) {
                                var url = JSON.parse(data).Url;
                                if (url && url != '')
                                    ExceptionManager.ProcessResponse(url);
                            });
                            _this.localQueue = [];
                        }
                    };
                    this.pollInternal = interval;
                    this.serviceUrl = serviceUrl;
                    this.Logger = setInterval(this.SendToServer, this.pollInternal);
                }
                return InPageLogger;
            })();
            var ExceptionManager = (function () {
                function ExceptionManager() {
                }
                ExceptionManager.Init = function (enableRedirectAfterLogging, exceptionLoggerPollInterval) {
                    if (parseInt(exceptionLoggerPollInterval))
                        ExceptionManager.ExceptionLoggerPollInterval = parseInt(exceptionLoggerPollInterval) * 1000;
                    ExceptionManager.EnableRedirectAfterLogging = (enableRedirectAfterLogging == '1') ? true : false;
                    if (window.Worker) {
                        ExceptionManager.Logger = new WebWorkerLogger(ExceptionManager.ExceptionLoggerPollInterval, ExceptionManager.serviceUrl, ExceptionManager.configServiceUrl);
                    }
                    else {
                        ExceptionManager.Logger = new InPageLogger(ExceptionManager.ExceptionLoggerPollInterval, ExceptionManager.serviceUrl);
                    }
                    window.onerror = ReiSys.Platform.ExceptionManagement.ExceptionManager.LogError;
                    window.onunload = function () {
                        if (ExceptionManager.ExceptionLoggerPollInterval > 0)
                            ExceptionManager.Logger.SendToServer();
                    };
                };
                ExceptionManager.ProcessResponse = function (url) {
                    PlatformConsole.log(url);
                    if (ExceptionManager.IsPublishException === true) {
                        if (ExceptionManager.EnableRedirectAfterPublish)
                            document.location.href = url;
                    }
                    else if (ExceptionManager.EnableRedirectAfterLogging)
                        document.location.href = url;
                };
                // Catch unhandled errors.
                ExceptionManager.LogError = function (message, filename, lineno, colno, error) {
                    ExceptionManager.IsPublishException = false;
                    var errorObject = new ErrorModel();
                    errorObject.message = message ? message : '';
                    errorObject.stack = printStackTrace(error);
                    errorObject.filename = filename ? filename : '';
                    errorObject.lineno = lineno ? lineno : '';
                    errorObject.colno = colno ? colno : '';
                    ExceptionManager.Logger.Log(errorObject);
                };
                ExceptionManager.PublishException = function (error, redirect) {
                    ExceptionManager.IsPublishException = true;
                    ExceptionManager.EnableRedirectAfterPublish = (redirect && redirect === true);
                    var errorObject = new ErrorModel();
                    errorObject.message = '';
                    errorObject.stack = printStackTrace(error);
                    if (typeof error == "string") {
                        errorObject.message = error;
                    }
                    else if ((error && error.message) && error instanceof Error) {
                        errorObject.message = error.message;
                    }
                    ExceptionManager.Logger.Log(errorObject);
                };
                ExceptionManager.SendXmlHttpRequest = function (dataToSend, url, successCallback, errorCallback, method) {
                    if (method === void 0) { method = "POST"; }
                    // Compatibility: IE7+, Firefox, Chrome, Opera, Safari
                    var xmlhttp = new XMLHttpRequest();
                    xmlhttp.onreadystatechange = function () {
                        if (xmlhttp.readyState === (XMLHttpRequest.DONE || 4)) {
                            if (xmlhttp.status === 200) {
                                if (successCallback && typeof successCallback === "function")
                                    successCallback(xmlhttp.responseText);
                            }
                            else if (xmlhttp.status === 400) {
                                if (errorCallback && typeof errorCallback === "function")
                                    errorCallback(xmlhttp.responseText);
                            }
                        }
                    };
                    xmlhttp.open(method, url, true);
                    xmlhttp.setRequestHeader('Content-type', "application/json");
                    xmlhttp.setRequestHeader('Accept', '*/*');
                    xmlhttp.send(JSON.stringify(dataToSend));
                };
                ExceptionManager.Logger = {};
                ExceptionManager.serviceUrl = REISys.Platform.WebRoot + "api/Platform/ExceptionManagement/Logger";
                ExceptionManager.configServiceUrl = REISys.Platform.WebRoot + "api/Platform/ConfigurationManagement/GetUrl";
                ExceptionManager.ExceptionLoggerPollInterval = 0; // Default to 0 seconds, immediatly log errors.
                ExceptionManager.EnableRedirectAfterLogging = true;
                ExceptionManager.IsPublishException = false;
                ExceptionManager.EnableRedirectAfterPublish = true;
                return ExceptionManager;
            })();
            ExceptionManagement.ExceptionManager = ExceptionManager;
        })(ExceptionManagement = Platform.ExceptionManagement || (Platform.ExceptionManagement = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=ExceptionManager.js.map