define([
    "jquery",
    "server",
    "toastr",
    "skylarkjs",
    "scripts/helpers/list",
    "scripts/helpers/formModal",
    "scripts/helpers/DealerSearch",
    "scripts/helpers/ProductSearch",
    "scripts/helpers/WarrantySearch",
    "text!scripts/routes/admin/admin.html"
], function($, server, toastr, skylarkjs, list, formModal, DealerSearch, ProductSearch, WarrantySearch, adminTpl) {
    var spa = skylarkjs.spa,
        langx = skylarkjs.langx;

    var selector = $(langx.trim(adminTpl));
    return spa.RouteController.inherit({
        klassName: "AdminController",
        preparing: function(e) {
            var self = this,
                deferred = new langx.Deferred();
            require(["bootstrapTb"], function() {
                require(["bootstrapTbZh"], function() {
                    server().connect("auth", "get", "check").then(function(result) {
                        if (result) {
                            selector.delegate(".add-btn", "click", function(e) {
                                var type = $(e.currentTarget).data("type");
                                formModal.show(type, {}, function(data) {
                                    selector.find("#" + type + "Table").bootstrapTable('refresh');
                                });
                            });
                            selector.find('.admin-nav a').on('shown.bs.tab', function(e) {
                                var type = $(e.currentTarget).data("type");
                                list.initTable(type, selector.find("#" + type + "Table"), true);
                            });
                        } else {
                            window.go("/signin");
                        }
                        deferred.resolve();
                    });
                });
            });
            e.result = deferred.promise;
        },

        fill: function() {

        },

        rendering: function(e) {
            e.content = selector;
        },

        rendered: function() {
            selector.find('.admin-nav a:first').tab('show');
        },

        entered: function() {
            $("#headerNav").html(
                '<li><a class="nav-item" data-spa-router="false" href="/logout">退出</a></li>' +
                '<li><a class="nav-item" data-spa-router="false" href="/password">更改密码</a></li>'
            );
        },
        exited: function() {}
    });
});