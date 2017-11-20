define([
    "jquery",
    "server",
    "skylarkjs",
    "./Partial",
    "toastr",
    "text!./_partials.hbs",
    "handlebars"
], function($, server, skylarkjs, partial, toastr, partialsTpl, handlebars) {
    var langx = skylarkjs.langx;

    function save(name, selector, opt, callback) {
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
        if (opt.file) {
            formData.append('thumbnail', opt.file);
            delete opt.file;
        }
        for (var key in opt) {
            formData.append(key, opt[key]);
        }
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
                    callback(JSON.parse(xhr.response || xhr.responseText));
                } else {
                    toastr.error(xhr.statusText);
                }
            }
        };
        xhr.send(formData);
    };

    return {
        files: {},
        _formatPData: function(product) {
            return {
                id: product.id,
                imagePath: product.file ? product.file.path : null,
                modelNum: product.modelNum,
                createdDate: product.createdDate,
                createdAddress: product.createdAddress,
                saleAddress: product.saleAddress,
                prodNumber: product.prodNumber,
                checker: product.checker,
                checkAddress: product.checkAddress
            }
        },
        _formatWData: function(warranty) {
            return {
                id: warranty.id,
                imagePath: warranty.file ? warranty.file.path : null,
                type: warranty.type,
                exeDate: warranty.exeDate,
                shop: warranty.shop,
                carNumber: warranty.carNumber,
                prodNumber: warranty.prodNumber,
                engineer: warranty.engineer,
                proDate: warranty.proDate
            }
        },
        show: function(type, data, callback, prepareData) {
            this.modal = $("#formModal");
            this["show_" + type](data, callback, prepareData);
            this.modal.modal('show');
            return this.modal;
        },

        show_product: function(data, callback) {
            data = this._formatPData(data);
            var self = this,
                modal = this.modal,
                text = data.id ? "编辑产品" : "添加产品";
            partial.get("product-form-partial");
            var prodTpl = handlebars.compile("{{> product-form-partial}}");
            modal.find(".modal-body").html(prodTpl(data));
            modal.find(".modal-title").html(text);
            modal.find(".save-btn").off("click").on("click", function() {
                save("products", modal, {
                    file: self.files.product
                }, function(product) {
                    self.files.product = null;
                    toastr.success("已保存！");
                    callback(product);
                    modal.modal('hide');
                });
            });
            modal.find("#prodForm input.thumbnail").on("change", function(e) {
                self.files.product = this.files[0];
            });
        },

        show_warranty: function(data, callback) {
            data = this._formatWData(data);
            var self = this,
                modal = this.modal,
                text = data.id ? "编辑质保" : "添加质保";
            partial.get("warranty-form-partial");
            var warrantyTpl = handlebars.compile("{{> warranty-form-partial}}");
            modal.find(".modal-body").html(warrantyTpl(data));
            modal.find(".modal-title").html(text);
            modal.find(".save-btn").off("click").on("click", function() {
                save("warranties", modal, {
                    file: self.files.warranty
                }, function(warranty) {
                    toastr.success("已保存！");
                    self.files.warranty = null;
                    callback(warranty);
                    modal.modal('hide');
                });
            });
            modal.find("#wForm input.thumbnail").on("change", function(e) {
                self.files.warranty = this.files[0];
            });
        },

        show_dealer: function(data, callback, prepareData) {
            var self = this,
                modal = this.modal,
                text = data.id ? "编辑经销商" : "添加经销商";
            server().getProvinces().then(function(prepareData) {
                partial.get("dealer-form-partial");
                var dealerTpl = handlebars.compile("{{> dealer-form-partial}}");
                modal.find(".modal-body").html(dealerTpl({
                    provinces: prepareData,
                    dealer: data
                }));
                var _cs = modal.find("#fCityS"),
                    _ps = modal.find("#fProvinceS");
                modal.find("#fProvinceS").on("change", function() {
                    if (!this.value) toastr.warning("请选择省份！");
                    server().getCities(this.value, _cs);
                });
                if (data.id) {
                    _ps.val(data.provinceId);
                    _ps.off('change').on('change', function() {
                        server().getCities(this.value, _cs).then(function() {
                            _cs.val(data.cityId);
                        });
                    });
                    _ps.change();
                }
                modal.find(".modal-title").html(text);
                modal.find(".save-btn").off("click").on("click", function() {
                    save("dealers", modal, {
                        provinceId: _ps.val(),
                        cityId: _cs.val()
                    }, function(dealer) {
                        toastr.success("已保存！");
                        callback(dealer);
                        modal.modal('hide');
                    });
                });
            });
        }
    }
});
