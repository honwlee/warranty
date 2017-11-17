define([
    "skylarkjs",
    "text!scripts/routes/dealers/dealers.html"
], function(skylarkjs, dealersTpl) {
    var spa = skylarkjs.spa,
        $ = skylarkjs.query;
    return spa.RouteController.inherit({
        klassName: "DealersController",

        rendering: function(e) {
            e.content = dealersTpl;
        },

        entered: function() {
        },
        exited: function() {
        }
    });
});
