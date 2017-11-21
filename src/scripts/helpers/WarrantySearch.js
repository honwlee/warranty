define([
    "skylarkjs",
    "server",
    "./Partial",
    "./formModal",
    "./itemActions",
    "toastr",
    "jquery",
    "handlebars"
], function(skylarkjs, server, partial, formModal, itemActions, toastr, $, handlebars) {
    var langx = skylarkjs.langx;

    function formatDate(d) {
        var date = new Date(d);
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
    }

    return langx.Evented.inherit({
        klassName: "WarrantySearch",
        searchKey: null,
        doAction: false,
        searchValue: null,
        init: function(config) {
            config = config || {};
            this.doAction = config.doAction;
            this._buildDom();
        },

        search: function(selector, dataString) {
            var self = this;
            server().connect("warranties", "get", "show?" + dataString).then(function(warranty) {
                if (warranty) {
                    self.fillItem(warranty, selector);
                } else {
                    toastr.warning("没有找到对应的结果！")
                }
            });
        },

        fillItem: function(warranty, selector) {
            var self = this,
                container = selector.find("#warrantyData");
            itemActions.warrantyItem(container, warranty);

            partial.get("item-action-partial");
            var actionTpl = handlebars.compile("{{> item-action-partial}}");
            if (this.doAction) {
                var actionSelector = $(actionTpl()).appendTo(container);
                actionSelector.find(".del-btn").on("click", function() {
                    self.remove(warranty, function() {
                        container.empty();
                        toastr.success("删除成功！");
                    });
                });
                actionSelector.find(".edit-btn").on("click", function() {
                    formModal.show("warranty", warranty, function(_w) {
                        self.fillItem(_w, selector);
                    });
                });
            }
        },

        getPrepareData: function() {},

        remove: function(warranty, callback) {
            itemActions.removeWarranty(warranty, callback);
        },

        _buildDom: function(provinces) {
            partial.get("warranty-search-partial");
            var self = this,
                tpl = handlebars.compile("{{> warranty-search-partial}}"),
                div = $("<div>").html(tpl()),
                selector = this.selector = $(div[0].firstChild);
            self.searchKey = selector.find("#warrantyS").val();
            selector.find("#warrantyS").on("change", function() {
                self.searchKey = this.value;
            });
            var _searchFunc = function() {
                var searchVal = selector.find("#warrantyValue").val();
                if (!self.searchKey) return toastr.warning("请选择查询选项！");
                if (!searchVal) return toastr.warning("请填写查询值！");
                var dataString = "key=" + self.searchKey + "&value=" + searchVal;
                self.search(selector, dataString);
                selector.find(".panel-heading").removeClass("hide");
            };
            selector.find("#searchWarrentyBtn").on("click", _searchFunc);
            selector.off('keypress').on('keypress', function(e) {
                if (e.keyCode === 13) _searchFunc();
            });
            return this.selector;
        },

        getDom: function() {
            return this.selector;
        }
    });
});
