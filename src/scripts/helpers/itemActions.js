define([
    "jquery",
    "server",
    "skylarkjs",
    "./Partial",
    "toastr",
    "text!./_partials.hbs",
    "handlebars"
], function($, server, skylarkjs, partial, toastr, partialsTpl, handlebars) {
    var langx = skylarkjs.langx;
    return {
        formatPData: function(product) {
            return {
                id: product.id,
                imagePath: product.file ? product.file.path : null,
                modelNum: product.modelNum,
                createdDate: product.createdDate,
                createdAddress: product.createdAddress,
                saleAddress: product.saleAddress,
                prodNumber: product.prodNumber,
                checker: product.checker,
                checkAddress: product.checkAddress
            }
        },

        productItem: function(container, product) {
            product = this.formatPData(product);
            partial.get("product-result-partial");
            var tpl = handlebars.compile("{{> product-result-partial}}");
            $("<div>").attr({
                class: "row featurebox"
            }).html(tpl(product)).appendTo(container.empty());
        },

        removeProduct: function(product, callback) {
            $("#confirmDeleteModal").modal('show').find(".btn-ok").off('click').on('click', function(e) {
                server().connect("products", "post", "delete", {
                    id: product.id
                }).then(function() {
                    callback();
                    $("#confirmDeleteModal").modal('hide');
                });
            });
        },

        formatDData: function(dealer) {
            return {
                id: dealer.id,
                company: dealer.company,
                address: dealer.address
            };
        },

        dealerItem: function(container, dealer) {
            dealer = this.formatDData(dealer);
            partial.get("dealer-result-partial");
            var tpl = handlebars.compile("{{> dealer-result-partial}}");
            $("<div>").attr({
                class: "row featurebox"
            }).html(tpl(dealer)).appendTo(container.empty());
        },

        removeDealer: function(dealer, callback) {
            $("#confirmDeleteModal").modal('show').find(".btn-ok").off('click').on('click', function(e) {
                server().connect("dealers", "post", "delete", {
                    id: dealer.id
                }).then(function() {
                    callback();
                    $("#confirmDeleteModal").modal('hide');
                });
            });
        },

        formatWData: function(warranty) {
            return {
                id: warranty.id,
                imagePath: warranty.file ? warranty.file.path : null,
                type: warranty.type,
                exeDate: warranty.exeDate,
                shop: warranty.shop,
                carNumber: warranty.carNumber,
                prodNumber: warranty.prodNumber,
                engineer: warranty.engineer,
                proDate: warranty.proDate
            }
        },

        warrantyItem: function(container, warranty) {
            warranty = this.formatWData(warranty);
            partial.get("warranty-result-partial");
            var tpl = handlebars.compile("{{> warranty-result-partial}}");
            $("<div>").attr({
                class: "row featurebox"
            }).html(tpl(warranty)).appendTo(container.empty());
        },

        removeWarranty: function(warranty, callback) {
            $("#confirmDeleteModal").modal('show').find(".btn-ok").off('click').on('click', function(e) {
                server().connect("warranties", "post", "delete", {
                    id: warranty.id
                }).then(function() {
                    callback();
                    $("#confirmDeleteModal").modal('hide');
                });
            });
        }
    };
});
