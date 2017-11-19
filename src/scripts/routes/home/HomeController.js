define([
    "jquery",
    "skylarkjs",
    "toastr",
    "scripts/helpers/DealerSearch",
    "scripts/helpers/ProductSearch",
    "scripts/helpers/WarrantySearch",
    "text!scripts/routes/home/home.html"
], function($, skylarkjs, toastr, DealerSearch, ProductSearch, WarrantySearch, homeTpl) {

    var spa = skylarkjs.spa,
        langx = skylarkjs.langx,
        selector = $(langx.trim(homeTpl));
    return spa.RouteController.inherit({
        klassName: "HomeController",
        provinces: null,
        preparing: function(e) {
            var dealer = new DealerSearch(),
                product = new ProductSearch(),
                warranty = new WarrantySearch();
            product.getDom().appendTo(selector.find("#sProductT .content").empty());
            warranty.getDom().appendTo(selector.find("#sWarrantyT .content").empty());
            e.result = dealer.preparing().then(function() {
                dealer.getDom().appendTo(selector.find("#sDealerT .content").empty());
            });
        },

        rendering: function(e) {
            e.content = selector;
        },

        rendered: function() {
            selector.find('#tabUl a[href="#sWarrantyT"]').tab('show');
        },

        entered: function() {

        },
        exited: function() {}
    });
});
