var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var Model;
        (function (Model) {
            var BaseModel = (function () {
                function BaseModel(instanceName) {
                    this.InstanceId = instanceName + "_" + BaseModel.UniqueInstanceId++;
                }
                BaseModel.UniqueInstanceId = 1;
                return BaseModel;
            }());
            Model.BaseModel = BaseModel;
        })(Model = Platform.Model || (Platform.Model = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
