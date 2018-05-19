/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","scripts/helpers/Partial","server","handlebars","skylarkjs"],function(r,e,t,n,l){var a,o=l.spa;l.noder,l.langx,l.router;return o.PluginController.inherit({klass:"CheckController",preparing:function(r){r.result=t().connect("system","get","check").then(function(r){a=r.checked})},starting:function(t){if(a){e.get("error-partial");var l=r("<div>").attr({"class":"container"}).html(n.compile("{{> error-partial}}")({})),o=r("#contentModal");o.find(".modal-body").html(l),o.find(".modal-title").html("出错啦！"),o.modal("show")}}})});