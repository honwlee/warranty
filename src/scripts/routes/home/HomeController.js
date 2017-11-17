define([
    "jquery",
    "skylarkjs",
    "toastr",
    "scripts/helpers/DealerSearch",
    "scripts/helpers/ProductSearch",
    "scripts/helpers/WarrantySearch",
    "text!scripts/routes/home/home.html"
], function($, skylarkjs, toastr, DealerSearch, ProductSearch, WarrantySearch, homeTpl) {

    function get_inputs(id) {
        document.getElementById('div1').style.display = "none";
        if (id != 0) {
            document.getElementById('input_div').innerHTML = '<img style="margin:10px;" src="https://warranty.xpelfilms.com.cn//assets/images/ajax_loading.gif">';
            // var dataString = 'id='+ id;
            var dataString = 'input_id=' + id;
            $.ajax({
                type: "GET",
                url: "https://warranty.xpelfilms.com.cn/front/getInputsByID",
                data: dataString,
                success: function(msg) {
                    document.getElementById('input_div').innerHTML = msg;
                }
            });
        }
    }

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
            product.getDom().appendTo(selector.find("#sProductT .portlet-body").empty());
            warranty.getDom().appendTo(selector.find("#sWarrantyT .portlet-body").empty());
            e.result = dealer.preparing().then(function() {
                dealer.getDom().appendTo(selector.find("#sDealerT .portlet-body").empty());
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
