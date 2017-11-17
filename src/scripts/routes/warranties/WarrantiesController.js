define([
    "skylarkjs",
    "text!scripts/routes/warranties/warranties.html"
], function(skylarkjs, warrantiesTpl) {
    var spa = skylarkjs.spa,
        $ = skylarkjs.query;
    return spa.RouteController.inherit({
        klassName: "WarrantiesController",

        rendering: function(e) {
            e.content = warrantiesTpl;
        },

        entered: function() {
        },
        exited: function() {
        }
    });
});
