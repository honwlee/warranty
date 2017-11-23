define([
    "skylarkjs",
    "server",
    "./Partial",
    "./formModal",
    "./itemActions",
    "toastr",
    "jquery",
    "handlebars"
], function(skylarkjs, server, partial, formModal, itemActions, toastr, $, handlebars) {
    var langx = skylarkjs.langx;
    var __provinces;

    return langx.Evented.inherit({
        klassName: "DealerSearch",
        doAction: false,
        init: function(config) {
            config = config || {};
            this.doAction = config.doAction;
        },
        search: function(cityId, selector) {
            var self = this;
            server().connect("dealers", "get", "list?cityId=" + cityId).then(function(dealers) {
                var table = selector.find("#dealerData").find("table").empty();
                if (dealers && dealers.length > 0) {
                    table.removeClass("hide");
                    var thead = $("<thead>").attr({
                            class: "text-center"
                        }).appendTo(table),
                        tbody = $("<tbody>").appendTo(table);
                    $("<tr>").html("<th class='--i18n--' data-i18n-key='company'>公司名称</th>" +
                        "<th class='--i18n--' data-i18n-key='address'>地址</th>" +
                        (this.doAction ? "<th class='--i18n--' data-i18n-key='operate'>操作</th>" : "")
                    ).appendTo(thead);
                    partial.get("dealer-tr-partial");
                    dealers.forEach(function(d) {
                        var tpl = handlebars.compile("{{> dealer-tr-partial}}"),
                            tr = $(tpl(d)).appendTo(tbody);
                        if (this.doAction) {
                            tr.delegate("td.td-action .btn", "click", function(e) {
                                var action = $(e.target).data("action");
                                if (action === "edit") {
                                    formModal.show("dealer", d, function(_d) {
                                        tr.find(".company").html(_d.company);
                                        tr.find(".address").html(_d.address);
                                    });
                                } else {
                                    self.remove(d, function() {
                                        tr.remove();
                                    });
                                }
                            });
                        } else {
                            tr.find("td.td-action").remove();
                        }
                    });
                    selector.find(".no-result").addClass("hide");
                } else {
                    selector.find(".no-result").removeClass("hide");
                }
                self.trigger("searched");
            });
        },
        preparing: function(e) {
            var self = this;
            return server().getProvinces().then(function(data) {
                self._buildDom(data)
            });
        },

        remove: function(dealer, callback) {
            $("#confirmDeleteModal").modal('show').on('click', '.btn-ok', function(e) {
                server().connect("dealer", "post", "delete", {
                    id: dealer.id
                }).then(function() {
                    callback();
                    $("#confirmDeleteModal").modal('hide');
                });
            });
        },

        getPrepareData: function() {
            return __provinces;
        },

        _buildDom: function(provinces) {
            // partial.get("search-no-result-partial");
            partial.get("dealer-search-partial");
            var self = this,
                tpl = handlebars.compile("{{> dealer-search-partial}}"),
                div = $("<div>").html(tpl({
                    provinces: provinces
                })),
                selector = this.selector = $(div[0].firstChild),
                _cs = selector.find("#cityS");

            selector.find("#provinceS").on("change", function() {
                if (!this.value) return toastr.warning("请选择省份！");
                server().getCities(this.value, _cs).then(function() {
                    self.trigger("citiesLoaded");
                });
            });
            var _searchFunc = function() {
                var val = _cs.val();
                if (!val) return toastr.warning("请选择城市！");
                self.search(val, selector);
                selector.find(".panel-heading").removeClass("hide");
            };
            selector.find("#searchDealerBtn").on("click", _searchFunc);
            selector.off('keypress').on('keypress', function(e) {
                if (e.keyCode === 13) _searchFunc();
            });
            return this.selector;
        },

        getDom: function() {
            return this.selector;
        }
    });
});