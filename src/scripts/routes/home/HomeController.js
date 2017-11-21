define([
    "jquery",
    "skylarkjs",
    "toastr",
    "scripts/i18n/i18n",
    "scripts/helpers/DealerSearch",
    "scripts/helpers/ProductSearch",
    "scripts/helpers/WarrantySearch",
    "text!scripts/routes/home/home.html"
], function($, skylarkjs, toastr, i18n, DealerSearch, ProductSearch, WarrantySearch, homeTpl) {

    var spa = skylarkjs.spa,
        langx = skylarkjs.langx,
        selector = $(langx.trim(homeTpl));
    return spa.RouteController.inherit({
        klassName: "HomeController",
        provinces: null,
        preparing: function(e) {
            var self = this,
                lang = navigator.language || navigator.userLanguage,
                dealer = new DealerSearch(),
                product = new ProductSearch(),
                warranty = new WarrantySearch();
            product.getDom().appendTo(selector.find("#sProductT .content").empty());
            warranty.getDom().appendTo(selector.find("#sWarrantyT .content").empty());
            e.result = dealer.preparing().then(function() {
                dealer.getDom().appendTo(selector.find("#sDealerT .content").empty());
                self.selectLanguage(lang);
                $("#headerNav").find('selector').val(lang);
            });
        },

        selectLanguage: function(name) {
            i18n.select(selector, name);
        },

        rendering: function(e) {
            e.content = selector;
        },

        rendered: function() {
            selector.find('#tabUl a[href="#sWarrantyT"]').tab('show');
        },

        entered: function() {
            var self = this;
            $("#headerNav").html('<li>' +
                '<select name="language" class="form-control">' +
                '<option value="en">English</option>' +
                '<option value="zh-TW"> 繁體 </option>' +
                '<option selected="" value="zh-CN"> 简体 </option>' +
                '</select>' +
                '</li>'
            ).find("select").off("change").on("change", function(e) {
                self.selectLanguage(this.value);
            });
        },
        exited: function() {}
    });
});
