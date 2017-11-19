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
            e.result = server().connect("auth", "get", "check").then(function(result) {
                if (result) {
                    window.go("/admin");
                } else {
                    toastr.error("请登录！");
                }
            });
        },
        rendering: function(e) {
            e.content = signinTpl;
        },

        rendered: function(e) {
            $("#loginBtn").on("click", function() {
                $.post("/login", {
                    username: $("#loginForm input.username").val(),
                    password: $("#loginForm input.password").val(),
                }, function(data) {
                    if (data.status) {
                        window.go("/admin", true);
                    } else {
                        toastr.error(data.msg);
                    }
                })
            })
        },

        entered: function() {},
        exited: function() {}
    });
});
