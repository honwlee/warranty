/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["skylarkjs","server","./Partial","./formModal","./itemActions","toastr","jquery","handlebars"],function(n,e,a,t,r,i,o,s){var c=n.langx;return c.Evented.inherit({klassName:"WarrantySearch",searchKey:null,doAction:!1,searchValue:null,init:function(n){n=n||{},this.doAction=n.doAction,this._buildDom()},search:function(n,a){var t=this;e().connect("warranties","get","show?"+a).then(function(e){n.find("#warrantyData").empty(),e&&e.length>0?(e.forEach(function(e){t.fillItem(e,n)}),n.find(".no-result").addClass("hide"),n.find(".thanks").removeClass("hide")):(n.find(".no-result").removeClass("hide"),n.find(".thanks").addClass("hide")),t.trigger("searched")})},fillItem:function(n,e){var c=this,l=e.find("#warrantyData");r.warrantyItem(l,n),a.get("item-action-partial");var f=s.compile("{{> item-action-partial}}");if(this.doAction){var h=o(f()).appendTo(l);h.find(".del-btn").on("click",function(){c.remove(n,function(){l.empty(),i.success("删除成功！")})}),h.find(".edit-btn").on("click",function(){t.show("warranty",n,function(n){c.fillItem(n,e)})})}},getPrepareData:function(){},remove:function(n,e){r.removeWarranty(n,e)},_buildDom:function(n){a.get("warranty-search-partial");var e=this,t=s.compile("{{> warranty-search-partial}}"),r=o("<div>").html(t()),c=this.selector=o(r[0].firstChild);e.searchKey=c.find("#warrantyS").val(),c.find("#warrantyS").on("change",function(){e.searchKey=this.value});var l=function(){var n=c.find("#warrantyValue").val();if(!e.searchKey)return i.warning("请选择查询选项！");if(!n)return i.warning("请填写查询值！");var a="key="+e.searchKey+"&value="+n;e.search(c,a),c.find(".panel-heading").removeClass("hide")};return c.find("#searchWarrentyBtn").on("click",l),c.off("keypress").on("keypress",function(n){13===n.keyCode&&l()}),this.selector},getDom:function(){return this.selector}})});