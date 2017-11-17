define([
    "skylarkjs",
    "server",
    "./Partial",
    "./formModal",
    "toastr",
    "jquery",
    "handlebars"
], function(skylarkjs, server, partial, formModal, toastr, $, handlebars) {
    var langx = skylarkjs.langx;

    function formatDate(d) {
        let date = new Date(d);
        return date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getDate();
    }

    return langx.Evented.inherit({
        klassName: "ProductSearch",
        searchKey: null,
        searchValue: null,
        init: function(config) {
            this._buildDom();
        },

        search: function(selector, dataString) {
            var self = this;
            server().connect("products", "get", "show?" + dataString).then(function(product) {
                self.fillItem(self._formatData(product), selector);
            });
        },

        _formatData: function(product) {
            return {
                id: product.id,
                imagePath: product.file.path,
                modelNum: product.modelNum,
                createdDate: formatDate(product.createdDate),
                createdAddress: product.createdAddress,
                saleAddress: product.saleAddress,
                prodNumber: product.prodNumber,
                checker: product.checker,
                checkAddress: product.checkAddress
            }
        },

        getPrepareData: function() {},

        fillItem: function(product, selector) {
            var self = this;
            partial.get("product-result-partial");
            partial.get("item-action-partial");
            var container = selector.find("#productData").empty(),
                tpl = handlebars.compile("{{> product-result-partial}}"),
                actionTpl = handlebars.compile("{{> item-action-partial}}");
            $("<div>").attr({
                class: "row featurebox"
            }).html(tpl(product)).appendTo(container);
            $("<div>").attr({
                class: "actions"
            }).html(actionTpl()).appendTo(container);
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
        },

        remove: function(product, callback) {
            $("#confirmDeleteModal").modal('show').on('click', '.btn-ok', function(e) {
                server().connect("products", "post", "delete", {
                    id: product.id
                }).then(function() {
                    callback();
                    $("#confirmDeleteModal").modal('hide');
                });
            });
        },

        _buildDom: function(provinces) {
            partial.get("product-search-partial");
            var self = this,
                tpl = handlebars.compile("{{> product-search-partial}}"),
                div = $("<div>").html(tpl()),
                selector = this.selector = $(div[0].firstChild);

            selector.find("#productS").on("change", function() {
                self.searchKey = this.value;
            });
            selector.find("#searchProductBtn").on("click", function() {
                var searchVal = selector.find("#prodValue").val();
                if (!self.searchKey) return toastr.warning("请选择查询选项！");
                if (!searchVal) return toastr.warning("请填写查询值！");
                var dataString = "key=" + self.searchKey + "&value=" + searchVal;
                search(selector, dataString);
            });
            return this.selector;
        },

        getDom: function() {
            return this.selector;
        }
    });
});
