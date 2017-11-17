define([
    "skylarkjs"
], function(skylarkjs) {
    var spa = skylarkjs.spa,
        router = skylarkjs.router,
        langx = skylarkjs.langx,
        velm = skylarkjs.velm;

    function createEvent(type, props) {
        var e = new CustomEvent(type, props);
        return langx.safeMixin(e, props);
    }
    spa.Application = spa.Application.inherit({
        showPopPage: function(node) {
            this.getPlugin("popPage").controller.show(node);
        },

        hidePopPage: function() {
            this.getPlugin("popPage").controller.hide();
        },

        getPlugin: function(key) {
            return key ? this._plugins[key] : this._plugins;
        }
    });
    spa.Page = spa.Page.inherit({
        init: function(params) {
            params = langx.mixin({
                "routeViewer": "body"
            }, params);

            this._params = params;
            this._$rvc = velm.find(params.routeViewer);
            this._router = router;

            router.on("routed", langx.proxy(this, "refresh"));
        },
        refresh: function() {
            var curCtx = router.current(),
                prevCtx = router.previous(),
                content = curCtx.route.render(curCtx);
            this._$rvc.html(content);
            curCtx.route.trigger(createEvent("rendered", {
                route: curCtx.route,
                content: content
            }));
        }
    });
    return spa;
});
