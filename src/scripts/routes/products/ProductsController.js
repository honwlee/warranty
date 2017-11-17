define([
    "skylarkjs",
    "text!scripts/routes/products/products.html"
], function(skylarkjs, productsTpl) {
    var spa = skylarkjs.spa,
        $ = skylarkjs.query;
    return spa.RouteController.inherit({
        klassName: "ProductsController",

        rendering: function(e) {
            e.content = productsTpl;
        },

        entered: function() {
        },
        exited: function() {
        }
    });
});
