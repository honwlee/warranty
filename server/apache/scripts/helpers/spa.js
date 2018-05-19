/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","skylarkjs"],function(e,n){function r(e,n){var r=new CustomEvent(e,n);return o.safeMixin(r,n)}var t=n.spa,i=n.router,o=n.langx;n.velm;return t.Application=t.Application.inherit({showPopPage:function(e){this.getPlugin("popPage").controller.show(e)},hidePopPage:function(){this.getPlugin("popPage").controller.hide()},getPlugin:function(e){return e?this._plugins[e]:this._plugins}}),t.Page=t.Page.inherit({refresh:function(){var n=i.current(),t=(i.previous(),n.route.render(n));e(this._rvc).html(t),n.route.trigger(r("rendered",{route:n.route,content:t}))}}),t});