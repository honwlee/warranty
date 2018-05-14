define([
    "skylarkjs",
    "server",
    "./Partial",
    "./itemActions",
    "./formModal",
    "toastr",
    "jquery",
    "handlebars"
], function(skylarkjs, server, partial, itemActions, formModal, toastr, $, handlebars) {
    var langx = skylarkjs.langx;

    function formatDate(d) {
        var date = new Date(d);
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
    }

    return langx.Evented.inherit({
        klassName: "ProductSearch",
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
            server().connect("products", "get", "show?" + dataString).then(function(products) {
                selector.find("#productData").empty();
                if (products && products.length > 0) {
                    products.forEach(function(product) {
                        self.fillItem(product, selector);
                    });
                    selector.find(".no-result").addClass("hide");
                    selector.find(".thanks").removeClass("hide");
                } else {
                    selector.find(".thanks").addClass("hide");
                    selector.find(".no-result").removeClass("hide");
                }
                self.trigger("searched");
            });
        },

        getPrepareData: function() {},

        fillItem: function(product, selector) {
            var self = this,
                container = selector.find("#productData");
            itemActions.productItem(container, product);
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
                    formModal.show("product", product, function(_p) {
                        self.fillItem(_p, selector);
                    });
                });
            }
        },

        remove: function(product, callback) {
            itemActions.removeProduct(product, callback);
        },

        _buildDom: function(provinces) {
            partial.get("product-search-partial");
            var self = this,
                tpl = handlebars.compile("{{> product-search-partial}}"),
                div = $("<div>").html(tpl()),
                selector = this.selector = $(div[0].firstChild);
            self.searchKey = selector.find("#productS").val();
            selector.find("#productS").on("change", function() {
                self.searchKey = this.value;
            });
            var _searchFunc = function() {
                var searchVal = selector.find("#prodValue").val();
                if (!self.searchKey) return toastr.warning("请选择查询选项！");
                if (!searchVal) return toastr.warning("请填写查询值！");
                var dataString = "key=" + self.searchKey + "&value=" + searchVal;
                self.search(selector, dataString);
                selector.find(".panel-heading").removeClass("hide");
            };
            selector.find("#searchProductBtn").on("click", _searchFunc);
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
