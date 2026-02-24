var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var ExceptionManagement;
        (function (ExceptionManagement) {
            var Web;
            (function (Web) {
                var queue = [];
                var url;
                var method;
                var contentType;
                var inProgress = false;
                var pollInterval = 0;
                var kickStartHandle;
                var started = false;
                var QueueWorker = (function () {
                    function QueueWorker() {
                    }
                    QueueWorker.Enqueue = function (message) {
                        if (message) {
                            queue = queue || [];
                            queue.push(message);
                        }
                    };
                    QueueWorker.SendXmlHttpRequest = function (item, callback) {
                        // Compatibility: IE7+, Firefox, Chrome, Opera, Safari
                        var xmlhttp = new XMLHttpRequest();
                        xmlhttp.onreadystatechange = function () {
                            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                                if (xmlhttp.status === 200) {
                                    if (callback && typeof callback === "function")
                                        callback(xmlhttp.responseText);
                                }
                                else if (xmlhttp.status === 400) {
                                }
                            }
                        };
                        xmlhttp.open(method, url, false);
                        xmlhttp.setRequestHeader('Content-type', contentType);
                        xmlhttp.setRequestHeader('Accept', '*/*');
                        var strItems = JSON.stringify(item);
                        xmlhttp.send(strItems);
                    };
                    QueueWorker.sendToServer = function (msg) {
                        if (msg && pollInterval < 1) {
                            var data;
                            if (!(msg instanceof Array))
                                data = [msg];
                            else
                                data = msg;
                            QueueWorker.SendXmlHttpRequest(data, function (data) {
                                postMessage(data);
                            });
                        }
                        else if (!inProgress && queue.length > 0) {
                            inProgress = true;
                            var temp = queue.slice(0);
                            queue.length = 0;
                            QueueWorker.process(temp);
                            inProgress = false;
                        }
                    };
                    QueueWorker.process = function (q) {
                        if (q instanceof Array) {
                            QueueWorker.SendXmlHttpRequest(q, function (data) {
                                postMessage(data);
                            });
                        }
                    };
                    QueueWorker.Start = function () {
                        if (!started && pollInterval > 0) {
                            kickStartHandle = setInterval(QueueWorker.sendToServer, pollInterval);
                            started = true;
                        }
                    };
                    QueueWorker.SetHeader = function (data) {
                        url = data.url;
                        contentType = data.contentType || "application/json";
                        method = data.method || "POST";
                        pollInterval = data.pollInterval || pollInterval;
                    };
                    return QueueWorker;
                }());
                Web.QueueWorker = QueueWorker;
            })(Web = ExceptionManagement.Web || (ExceptionManagement.Web = {}));
        })(ExceptionManagement = Platform.ExceptionManagement || (Platform.ExceptionManagement = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
self.addEventListener('message', function (e) {
    ReiSys.Platform.ExceptionManagement.Web.QueueWorker.Start();
    switch (e.data.action) {
        case "setHeader":
            ReiSys.Platform.ExceptionManagement.Web.QueueWorker.SetHeader(e.data.header);
            break;
        case "enqueue":
            ReiSys.Platform.ExceptionManagement.Web.QueueWorker.Enqueue(e.data.message);
            break;
        case "sendToServer":
            ReiSys.Platform.ExceptionManagement.Web.QueueWorker.sendToServer(e.data.message);
            break;
    }
}, false);
