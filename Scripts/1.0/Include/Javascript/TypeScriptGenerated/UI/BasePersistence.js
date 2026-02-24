/// <reference path="../ExternalTS/jquery.d.ts" />
/// <reference path="../LocalStorage/StoreManager.ts"/>
var ReiSys;
(function (ReiSys) {
    var Platform;
    (function (Platform) {
        var UI;
        (function (UI) {
            var StoreManager = ReiSys.Platform.LocalStorage.StoreManager;
            /**
             * Defines the Persist Data Model
             */
            var PersistItemModel = (function () {
                function PersistItemModel(type, value) {
                    this.type = type;
                    this.value = value;
                }
                return PersistItemModel;
            }());
            UI.PersistItemModel = PersistItemModel;
            /**
             * Base class for persisting the data within the page on client side
             * By default, the utility will use sessionId & pathname as the key for storing data to localStorage
             */
            var BasePersistenceUtility = (function () {
                function BasePersistenceUtility() {
                }
                Object.defineProperty(BasePersistenceUtility, "includeQueryString", {
                    /**
                     * Determine if url query string should be added as part of the key
                     * This is meaningful if uniqueKey (custom key) is not defined
                     * @param val
                     * @returns {}
                     */
                    set: function (val) {
                        BasePersistenceUtility._includeQueryString = val;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BasePersistenceUtility, "key", {
                    /**
                     * Overrides the default key
                     * @param uniqueKey
                     * @returns {}
                     */
                    set: function (uniqueKey) {
                        if (uniqueKey)
                            BasePersistenceUtility._uniqueKey = uniqueKey;
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Gets the key used to store the page data/state in cache
                 */
                BasePersistenceUtility.getKey = function () {
                    var key = [REISys.Platform.CurrentSessionID];
                    if (BasePersistenceUtility._uniqueKey) {
                        // use custom key provided by caller or sub class
                        key.push(BasePersistenceUtility._uniqueKey);
                    }
                    else {
                        if (BasePersistenceUtility.includeQueryString)
                            key.push(location.href.split("/").slice(-1).toString());
                        else
                            key.push(location.pathname.split("/").slice(-1).toString());
                    }
                    return key.join("_");
                };
                /**
                 * Gets all the page data stored in cache
                 */
                BasePersistenceUtility.getAll = function () {
                    return StoreManager.get(this.getKey());
                };
                /**
                 * Gets a speficic page data stored in cache
                 * @param type
                 */
                BasePersistenceUtility.getItem = function (type) {
                    var items = StoreManager.get(this.getKey());
                    if (items === undefined || items === null)
                        return null;
                    var index = items.length;
                    for (var i = 0; i < index; i++) {
                        if (items[i].type === type) {
                            return items[i].value;
                        }
                    }
                    return null;
                };
                /**
                 * Saves a page item data in cache
                 * @param type
                 * @param value
                 */
                BasePersistenceUtility.saveItem = function (type, value) {
                    // save to cache only if session exists
                    if (REISys.Platform.CurrentSessionID === undefined || REISys.Platform.CurrentSessionID === null)
                        return;
                    var key = this.getKey();
                    var items = [];
                    items.push(new PersistItemModel(type, value));
                    if (StoreManager.has(key)) {
                        var storedItems = StoreManager.get(key);
                        storedItems.forEach(function (item, index) {
                            if (item.type !== type)
                                items.push(new PersistItemModel(item.type, item.value));
                        });
                    }
                    StoreManager.set(this.getKey(), items, true);
                };
                /**
                 * Removes a page item data from cache
                 * @param type
                 */
                BasePersistenceUtility.removeItem = function (type) {
                    var items = StoreManager.get(this.getKey());
                    if (items === undefined || items === null)
                        return;
                    var index = items.length;
                    for (var i = 0; i < index; i++) {
                        if (items[i].type === type) {
                            items.splice(i);
                            break;
                        }
                    }
                    StoreManager.set(this.getKey(), items, true);
                };
                /**
                 * Removes all page data from cache
                 */
                BasePersistenceUtility.removeAll = function () {
                    StoreManager.remove(this.getKey());
                };
                return BasePersistenceUtility;
            }());
            UI.BasePersistenceUtility = BasePersistenceUtility;
        })(UI = Platform.UI || (Platform.UI = {}));
    })(Platform = ReiSys.Platform || (ReiSys.Platform = {}));
})(ReiSys || (ReiSys = {}));
//# sourceMappingURL=BasePersistence.js.map