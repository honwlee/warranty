/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","skylarkjs","text!./_partials.hbs","handlebars"],function(t,n,r,e){var a=n.langx,i={},l=t(a.trim(r)),c=function(n,r){r=r||l,r.find("#"+n).each(function(r,l){e.registerPartial(n,a.trim(t(l).html()).replace(/\{\{&gt;/g,"{{>")),i[n]=!0})};return{get:function(t,n){i[t]||c(t,n)}}});