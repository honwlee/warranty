/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","server","skylarkjs","toastr","text!scripts/routes/signin/signin.html"],function(n,e,o,t,i){var r=o.spa;return r.RouteController.inherit({klassName:"SigninController",preparing:function(n){n.result=e().connect("auth","get","check",null,{noMsg:!0}).then(function(n){n&&window.go("/adminacme")})},rendering:function(n){n.content=i},rendered:function(e){var o=function(){n.post("/login",{username:n("#loginForm input.username").val(),password:n("#loginForm input.password").val()},function(n){n.status?window.go("/adminacme",!0):t.error(n.msg||"用户名或密码错误！")})};n("#loginBtn").on("click",o),n(".signin-container").off("keypress").on("keypress",function(n){13===n.keyCode&&o()})},entered:function(){},exited:function(){}})});