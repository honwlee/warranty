/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","server","toastr","skylarkjs","scripts/helpers/list","scripts/helpers/formModal","scripts/helpers/DealerSearch","scripts/helpers/ProductSearch","scripts/helpers/WarrantySearch","text!scripts/routes/admin/admin.html"],function(e,r,t,n,a,i,s,o,l,c){var d=n.spa,f=n.langx,u=e(f.trim(c));return d.RouteController.inherit({klassName:"AdminController",preparing:function(t){var n=new f.Deferred;require(["bootstrapTb"],function(){require(["bootstrapTbZh"],function(){r().connect("auth","get","check").then(function(r){r?(u.delegate(".add-btn","click",function(r){var t=e(r.currentTarget).data("type");i.show(t,{},function(e){u.find("#"+t+"Table").bootstrapTable("refresh")})}),u.find(".admin-nav a").on("shown.bs.tab",function(r){var t=e(r.currentTarget).data("type");a.initTable(t,u.find("#"+t+"Table"),!0)})):window.go("/signin"),n.resolve()})})}),t.result=n.promise},fill:function(){},rendering:function(e){e.content=u},rendered:function(){u.find(".admin-nav a:first").tab("show")},entered:function(){e("#headerNav").html('<li><a class="nav-item" data-spa-router="false" href="/logout">退出</a></li><li><a class="nav-item" data-spa-router="false" href="/password">更改密码</a></li>')},exited:function(){}})});