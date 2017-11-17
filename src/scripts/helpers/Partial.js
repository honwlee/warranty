define([
    "jquery",
    "skylarkjs",
    "text!./_partials.hbs",
    "handlebars"
], function($, skylarkjs, partialsTpl, handlebars) {
    var langx = skylarkjs.langx;
    var partials = {};
    var selector = $(langx.trim(partialsTpl));
    var _registryPartial = function(name, _selector) {
        selector = _selector || selector;
        selector.find("#" + name).each(function(index, partial) {
            handlebars.registerPartial(name, langx.trim($(partial).html()).replace(/\{\{&gt;/g, "{{>"));
            partials[name] = true;
        });
    }
    return {
        get: function(name, _selector) {
            if (!partials[name]) _registryPartial(name, _selector);
        }
    }
});
