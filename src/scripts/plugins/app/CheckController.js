define([
    "jquery",
    "scripts/helpers/Partial",
    "server",
    "handlebars",
    "skylarkjs"
], function($, partial, server, handlebars, skylarkjs) {
    var spa = skylarkjs.spa,
        noder = skylarkjs.noder,
        langx = skylarkjs.langx,
        router = skylarkjs.router,
        __isDelayed;

    return spa.PluginController.inherit({
        klass: "CheckController",
        preparing: function(e) {
            e.result = server().connect("system", "get", "check").then(function(data) {
                __isDelayed = data.checked;
            });
        },

        starting: function(evt) {
            if (__isDelayed) {
                partial.get("error-partial");
                var error = $("<div>").attr({
                    class: "container"
                }).html(handlebars.compile("{{> error-partial}}")({}));
                var contentM = $("#contentModal");
                contentM.find(".modal-body").html(error);
                contentM.find(".modal-title").html("出错啦！");
                contentM.modal("show");
            }
        }

    })
});