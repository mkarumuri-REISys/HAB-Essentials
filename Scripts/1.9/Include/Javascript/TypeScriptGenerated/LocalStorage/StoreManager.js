/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../ExternalTS/store.d.ts" />
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var LocalStorage;
        (function (LocalStorage) {
            /**
             * Implementents loading and storing data in LocalStorage
             */
            var StoreManager = (function () {
                function StoreManager() {
                }
                /**
                 * Set value of specified key
                 * @throws - Error if key already exists and override is not permitted
                 * @param key
                 * @param value
                 * @param allowOverride
                 * @returns {}
                 */
                StoreManager.set = function (key, value, allowOverride) {
                    if (this.has(key) && !allowOverride)
                        throw Error("Key " + key + " already exists. Override is not permitted");
                    window.store.set(key, value);
                };
                /**
                 * Get value of specified key in cache
                 * @param key
                 * @returns {}
                 */
                StoreManager.get = function (key) {
                    return window.store.get(key);
                };
                /**
                 * Check if key exists in cache
                 * @param key
                 * @returns {}
                 */
                StoreManager.has = function (key) {
                    return window.store.has(key);
                };
                /**
                 * Remove key from cache
                 * @param key
                 * @returns {}
                 */
                StoreManager.remove = function (key) {
                    window.store.remove(key);
                };
                /**
                 * Clear all keys from cache
                 * @returns {}
                 */
                StoreManager.clear = function () {
                    window.store.clear();
                };
                return StoreManager;
            }());
            LocalStorage.StoreManager = StoreManager;
        })(LocalStorage = Platform.LocalStorage || (Platform.LocalStorage = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
