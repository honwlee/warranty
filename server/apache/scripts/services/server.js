/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","toastr","skylarkjs"],function(e,r,n){var t,i=n.spa,o=n.langx,s=o.klass({klassName:"SpaService",memory:{},init:function(e){this.memory={products:{},users:{},warranties:{},dealers:{},cities:{},provinces:{}}},start:function(r){if(this.memory.data)return o.Deferred.when(this.memory.data);var n=new o.Deferred,t=this,s=i().getConfig("backendApi");i().getConfig("tokenApi");return e.get(s,function(e){t.memory.data=e,n.resolve(e)}),n.promise},getProvinces:function(){var e=this;return this.memory.provinces.index?o.Deferred.when(this.memory.provinces.index):this.connect("provinces","get","index").then(function(r){return e.memory.provinces.index=r,r})},getProvincesByCity:function(e){var r=this.memory.cities.index.filter(function(r){return r.id===e})[0];return r?this.memory.provinces.filter(function(e){return e.id===r.provinceId})[0]:null},getCities:function(r,n){return n.empty(),this.connect("cities","get","index?provinceId="+r).then(function(r){e('<option value="0" class="--i18n--" data-i18n-key="select">选择</option>').appendTo(n),r.forEach(function(r){e("<option>").attr({"class":"--i18n--","data-i18n-key":r.pinyin,value:r.id}).html(r.name).appendTo(n)})})},startServer:function(){var r=new o.Deferred;return e.get("/api/start",function(e){r.resolve(e)}),r.promise},connect:function(n,t,i,s,a){var c=e("#main")[0],u=this,m=new o.Deferred,f=window.addThrob(c,function(){s?e[t]("/api/"+n+"/"+i,s,function(e){if(f.remove(),c.style.opacity=1,0==e.status){if(m.resolve(null,e),a&&a.noMsg)return;e.auth?r.error("未登录或者session失效，请登录后再操作！"):e.validate?r.error("数据已存在：("+e.key+":"+e.value+")"):e.system&&r.error("系统错误，请截图并联系管理员，谢谢合作！")}else u.memory[n][i]=e,m.resolve(e)}):e[t]("/api/"+n+"/"+i,function(e){if(f.remove(),c.style.opacity=1,0==e.status){if(m.resolve(null,e),a&&a.noMsg)return;e.auth?r.error("未登录或者session失效，请登录后再操作！"):e.validate?r.error("数据已存在：("+e.key+":"+e.value+")"):e.system&&r.error("系统错误，请截图并联系管理员，谢谢合作！")}else u.memory[n]&&(u.memory[n][i]=e),m.resolve(e)})});return m.promise}}),a=function(e){return t||(window.spaServer=t=new s(e)),t};return a});