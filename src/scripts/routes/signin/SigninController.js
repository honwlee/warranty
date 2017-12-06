define([
    "jquery",
    "server",
    "skylarkjs",
    "toastr",
    "text!scripts/routes/signin/signin.html"
], function($, server, skylarkjs, toastr, signinTpl) {
    var spa = skylarkjs.spa;
    return spa.RouteController.inherit({
        klassName: "SigninController",
        preparing: function(e) {
            e.result = server().connect("auth", "get", "check", null, {
                noMsg: true
            }).then(function(result) {
                if (result) window.go("/admin");
            });
        },
        rendering: function(e) {
            e.content = signinTpl;
        },

        rendered: function(e) {
            var signin = function() {
                $.post("/login", {
                    username: $("#loginForm input.username").val(),
                    password: $("#loginForm input.password").val(),
                }, function(data) {
                    if (data.status) {
                        window.go("/admin", true);
                    } else {
                        toastr.error(data.msg || "用户名或密码错误！");
                    }
                })
            };
            $("#loginBtn").on("click", signin);
            $(".signin-container").off('keypress').on('keypress', function(e) {
                if (e.keyCode === 13) signin();
            });
        },

        entered: function() {},

        exited: function() {}
    });
});