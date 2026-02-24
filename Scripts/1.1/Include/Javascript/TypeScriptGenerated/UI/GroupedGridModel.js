define(["require", "exports", 'KoTemplateManager'], function (require, exports, handler) {
    //polyfil (move to a centeral location!!
    (function () {
        if (!Array.prototype.map) {
            Array.prototype.map = function (callback, thisArg) {
                var T, A, k;
                if (this == null) {
                    throw new TypeError(' this is null or not defined');
                }
                // 1. Let O be the result of calling ToObject passing the |this| 
                //    value as the argument.
                var O = Object(this);
                // 2. Let lenValue be the result of calling the Get internal 
                //    method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0;
                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: http://es5.github.com/#x9.11
                if (typeof callback !== 'function') {
                    throw new TypeError(callback + ' is not a function');
                }
                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length > 1) {
                    T = thisArg;
                }
                // 6. Let A be a new array created as if by the expression new Array(len) 
                //    where Array is the standard built-in constructor with that name and 
                //    len is the value of len.
                A = new Array(len);
                // 7. Let k be 0
                k = 0;
                while (k < len) {
                    var kValue, mappedValue;
                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal 
                    //    method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (k in O) {
                        // i. Let kValue be the result of calling the Get internal 
                        //    method of O with argument Pk.
                        kValue = O[k];
                        // ii. Let mappedValue be the result of calling the Call internal 
                        //     method of callback with T as the this value and argument 
                        //     list containing kValue, k, and O.
                        mappedValue = callback.call(T, kValue, k, O);
                        // iii. Call the DefineOwnProperty internal method of A with arguments
                        // Pk, Property Descriptor
                        // { Value: mappedValue,
                        //   Writable: true,
                        //   Enumerable: true,
                        //   Configurable: true },
                        // and false.
                        // In browsers that support Object.defineProperty, use the following:
                        // Object.defineProperty(A, k, {
                        //   value: mappedValue,
                        //   writable: true,
                        //   enumerable: true,
                        //   configurable: true
                        // });
                        // For best browser support, use the following:
                        A[k] = mappedValue;
                    }
                    // d. Increase k by 1.
                    k++;
                }
                // 9. return A
                return A;
            };
        }
        if (!Array.prototype.filter) {
            Array.prototype.filter = function (fun /*, thisArg*/) {
                'use strict';
                if (this === void 0 || this === null) {
                    throw new TypeError();
                }
                var t = Object(this);
                var len = t.length >>> 0;
                if (typeof fun !== 'function') {
                    throw new TypeError();
                }
                var res = [];
                var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
                for (var i = 0; i < len; i++) {
                    if (i in t) {
                        var val = t[i];
                        // NOTE: Technically this should Object.defineProperty at
                        //       the next index, as push can be affected by
                        //       properties on Object.prototype and Array.prototype.
                        //       But that method's new, and collisions should be
                        //       rare, so use the more-compatible alternative.
                        if (fun.call(thisArg, val, i, t)) {
                            res.push(val);
                        }
                    }
                }
                return res;
            };
        }
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (searchElement, fromIndex) {
                var k;
                // 1. Let O be the result of calling ToObject passing
                //    the this value as the argument.
                if (this == null) {
                    throw new TypeError('"this" is null or not defined');
                }
                var O = Object(this);
                // 2. Let lenValue be the result of calling the Get
                //    internal method of O with the argument "length".
                // 3. Let len be ToUint32(lenValue).
                var len = O.length >>> 0;
                // 4. If len is 0, return -1.
                if (len === 0) {
                    return -1;
                }
                // 5. If argument fromIndex was passed let n be
                //    ToInteger(fromIndex); else let n be 0.
                var n = +fromIndex || 0;
                if (Math.abs(n) === Infinity) {
                    n = 0;
                }
                // 6. If n >= len, return -1.
                if (n >= len) {
                    return -1;
                }
                // 7. If n >= 0, then Let k be n.
                // 8. Else, n<0, Let k be len - abs(n).
                //    If k is less than 0, then let k be 0.
                k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
                while (k < len) {
                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the
                    //    HasProperty internal method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    //    i.  Let elementK be the result of calling the Get
                    //        internal method of O with the argument ToString(k).
                    //   ii.  Let same be the result of applying the
                    //        Strict Equality Comparison Algorithm to
                    //        searchElement and elementK.
                    //  iii.  If same is true, return k.
                    if (k in O && O[k] === searchElement) {
                        return k;
                    }
                    k++;
                }
                return -1;
            };
        }
    })();
    //export module GroupedGrid {
    /*Column Configuration*/
    var ColumnConfiguration = (function () {
        //private _headerText: string;
        //private _itemExp: any;
        //private _filter: boolean;
        //private _colClass: string;
        function ColumnConfiguration(headerText, itemExp, filter, width, colClass) {
            if (filter === void 0) { filter = false; }
            if (width === void 0) { width = 0; }
            if (colClass === void 0) { colClass = null; }
            this.headerText = headerText;
            this.itemExp = itemExp;
            this.filter = filter;
            this.width = width;
            this.colClass = colClass;
        }
        return ColumnConfiguration;
    })();
    exports.ColumnConfiguration = ColumnConfiguration;
    /*Groupby Configuration*/
    var GroupbyConfiguration = (function () {
        //private _headerText: string;
        //private _itemExp: any;
        //private _filter: boolean;
        function GroupbyConfiguration(headerText, itemExp, filter) {
            if (filter === void 0) { filter = false; }
            this.headerText = headerText;
            this.itemExp = itemExp;
            this.filter = filter;
            //this._headerText = headerText;
            //this._itemExp = itemExp;
            //this._filter = filter;
        }
        return GroupbyConfiguration;
    })();
    exports.GroupbyConfiguration = GroupbyConfiguration;
    /*Grouped Grid ViewModel*/
    var ViewModel = (function () {
        function ViewModel(arr, columns, groupBy) {
            this.columns = columns;
            this.groupBy = groupBy;
            //Get value of an object's property from an expression
            this.GetValue = function (obj, expr) {
                return this.GetValueByExpression(obj, expr);
            };
            this._self = this;
            //todo - infer columns from first data element if not configured
            if (columns.length == 0) {
                throw new Error('atleast one column must be defined');
            }
            //make it observable if not already
            if (ko.isObservable(arr)) {
                this.data = arr;
            }
            else {
                this.data = ko.observableArray(arr);
            }
            //initialize settings
            this.InitializeColumns(columns);
            //this.groupedItems = ko.computed(this.CalculateGroupedItems, this)
            ////set rate limit to avoid multiple renderings when individual dependencies are changed
            ////.extend({ rateLimit: 0 }); //for newer version of knockout
            //    .extend({ throttle: 5 });
            this.groupedItems = ko.observableArray(this.CalculateGroupedItems());
            //this.ToggleGroupAction.bind(this);
            this._self.ToggleGroupAction = function (computedVal) {
                var list = this.groupedItems(), item = null;
                for (var i = 0; i < list.length; i++) {
                    if (computedVal.gid === list[i].gid) {
                        item = list[i];
                        break;
                    }
                }
                if (item !== null) {
                    item.expanded(!item.expanded());
                }
            }.bind(this);
        }
        //Compute items that would be rendered
        ViewModel.prototype.CalculateGroupedItems = function () {
            var i, j, arr = this.data(), arrFinal = [], col = null, filtered = false, selectedFilterVal = null;
            //apply filters if any
            if (this.hasFilters) {
                for (i = 0; i < arr.length; i++) {
                    filtered = true;
                    for (j = 0; j < this.columns.length; j++) {
                        col = this.columns[j];
                        selectedFilterVal = col.selectedFilter();
                        //do not filter on function columns
                        if (!col.filter || typeof col.itemExp === 'function' || selectedFilterVal === '') {
                            continue;
                        }
                        if (selectedFilterVal !== this.GetValueByExpression(arr[i], col.itemExp)) {
                            filtered = false;
                            break;
                        }
                    }
                    if (filtered) {
                        arrFinal.push(arr[i]);
                    }
                }
            }
            else {
                arrFinal = arr;
            }
            //group filtered data
            arrFinal = this.GroupDataBy(arrFinal, this.groupBy.itemExp);
            return arrFinal;
        };
        //group data by expression
        ViewModel.prototype.GroupDataBy = function (data, groupByExpr) {
            var hash = {};
            var groupByVal;
            for (var i = 0; i < data.length; i++) {
                groupByVal = this.GetValueByExpression(data[i], groupByExpr);
                if (!hash.hasOwnProperty(groupByVal)) {
                    hash[groupByVal] = {
                        gid: groupByVal.split(' ').join('_'),
                        groupBy: groupByExpr,
                        groupName: ko.observable(groupByVal),
                        expanded: ko.observable(true),
                        data: []
                    };
                }
                hash[groupByVal].data.push(data[i]);
            }
            data = [];
            for (var property in hash) {
                if (hash.hasOwnProperty(property)) {
                    data.push(hash[property]);
                }
            }
            return data;
        };
        //todo - move this somewhere central
        //Utility method to get value on an object to an express
        ViewModel.prototype.GetValueByExpression = function (o, s) {
            s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, ''); // strip a leading dot
            var a = s.split('.');
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (k in o) {
                    o = o[k];
                }
                else {
                    return;
                }
            }
            return o;
        };
        //Intialize Comlums, including computing filters and making sure that all the properties are there
        ViewModel.prototype.InitializeColumns = function (columns) {
            var col, list = this.data(), colWithoutWidthList = [], definedWidth = 0, i = 0;
            this.hasFilters = false;
            for (var i = 0; i < columns.length; i++) {
                col = columns[i];
                if (col.filter && col.filter === true && this.data().length > 0) {
                    this.hasFilters = true;
                    col.filterItems = this.GetUniqueItems(list, col.itemExp);
                }
                else {
                    col.filterItems = null;
                }
                //making sure that all properties are present
                if (!col.colClass)
                    col.colClass = null;
                if (!col.filter)
                    col.filter = false;
                if (!col.width || col.width <= 0) {
                    col.width = 0;
                    colWithoutWidthList.push(col);
                }
                else {
                    definedWidth += col.width;
                }
                col.selectedFilter = ko.observable('');
                //filtering should also expand everything
                col.selectedFilter.subscribe(function (newValue) {
                    this.groupedItems(this.CalculateGroupedItems());
                }, this);
            }
            if (colWithoutWidthList.length > 0 && definedWidth < 100) {
                var avgWidth = (100 - definedWidth) / colWithoutWidthList.length;
                for (i = 0; i < colWithoutWidthList.length; i++) {
                    col = colWithoutWidthList[i];
                    col.width = avgWidth;
                }
            }
        };
        //Get a list of unique items from an object list using an expression
        ViewModel.prototype.GetUniqueItems = function (list, expr) {
            var vm = this;
            var arr = list.map(function (o) {
                return vm.GetValueByExpression(o, expr);
            }).filter(function (value, index, self) {
                return self.indexOf(value) === index;
            });
            arr.unshift('');
            return arr;
        };
        return ViewModel;
    })();
    //define templateName against the prototype
    ViewModel.prototype.templateName = 'groupedGridView';
    function generateViewModel(arr, columns, groupBy) {
        var initDeffered = $.Deferred();
        handler.IntializeTemplate(ViewModel.prototype.templateName).then(function () {
            initDeffered.resolve(new ViewModel(arr, columns, groupBy));
        });
        return initDeffered;
    }
    exports.generateViewModel = generateViewModel;
});
//} 
//# sourceMappingURL=GroupedGridModel.js.map