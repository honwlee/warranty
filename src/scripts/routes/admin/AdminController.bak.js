define([
    "jquery",
    "server",
    "toastr",
    "skylarkjs",
    "scripts/helpers/formModal",
    "scripts/helpers/DealerSearch",
    "scripts/helpers/ProductSearch",
    "scripts/helpers/WarrantySearch",
    "text!scripts/routes/admin/admin.html"
], function($, server, toastr, skylarkjs, formModal, DealerSearch, ProductSearch, WarrantySearch, adminTpl) {
    var spa = skylarkjs.spa,
        langx = skylarkjs.langx;

    function save(name, selector, file) {
        var action = "create",
            data = {};
        var formData = new FormData();
        selector.find("input").each(function() {
            if (this.type != "file") {
                var s = $(this);
                formData.append(s.attr("name"), s.val());
                data[s.attr("name")] = s.val();
            }
        });
        // data.file = file;
        if (data.id) action = "update";
        //将文件信息追加到其中
        if (file) formData.append('thumbnail', file);
        // //利用split切割，拿到上传文件的格式
        // var src = file.name,
        //     formart = src.split(".")[1];
        // //使用if判断上传文件格式是否符合
        // if (formart == "jpg" || formart == "png") {

        // }
        // server().connect(name, "post", action, formData).then(function(cbData) {
        //     if (data.id) {

        //     } else {

        //     }
        // });

        var url = "/api/" + name + "/" + action;
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                    toastr.success("添加成功");
                } else {
                    toastr.error(xhr.statusText);
                }
            }
        };
        xhr.send(formData);
    };

    var selector = $(langx.trim(adminTpl));
    return spa.RouteController.inherit({
        klassName: "AdminController",
        preparing: function(e) {
            var self = this;
            e.result = server().connect("auth", "get", "check").then(function(result) {
                if (result) {
                    var dealer = new DealerSearch({ doAction: true }),
                        product = new ProductSearch({ doAction: true }),
                        warranty = new WarrantySearch({ doAction: true });
                    product.getDom().appendTo(selector.find("#prodContentTab").empty());
                    warranty.getDom().appendTo(selector.find("#wContentTab").empty());
                    selector.delegate(".add-btn", "click", function(e) {
                        var type = $(e.currentTarget).data("type");
                        if (type === "dealer") {
                            formModal.show(type, {}, function() {

                            }, dealer.getPrepareData());
                        } else {
                            formModal.show(type, {}, function() {

                            });
                        }
                    });
                    return dealer.preparing().then(function() {
                        dealer.getDom().appendTo(selector.find("#dealerContentTab").empty());
                    });
                } else {
                    window.go("/signin");
                }
            });
        },

        fill: function() {

        },

        rendering: function(e) {
            e.content = selector;
        },

        rendered: function() {
            selector.find('.admin-nav a:first').tab('show');
        },

        entered: function() {},
        exited: function() {}
    });
});
