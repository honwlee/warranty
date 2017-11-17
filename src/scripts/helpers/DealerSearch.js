define([
    "skylarkjs",
    "server",
    "./Partial",
    "./formModal",
    "toastr",
    "jquery",
    "handlebars"
], function(skylarkjs, server, partial, formModal, toastr, $, handlebars) {
    var langx = skylarkjs.langx;
    var __provinces;

    return langx.Evented.inherit({
        klassName: "DealerSearch",
        init: function(config) {

        },
        search: function(cityId, selector) {
            var self = this;
            server().connect("dealers", "get", "index?cityId=" + cityId).then(function(dealers) {
                var table = selector.find("#dealerData").find("table").empty(),
                    tbody = $("<tbody>").appendTo(table);
                $("<tr>").html("<th>公司名称</th>" +
                    "<th>地址</th>"
                ).appendTo(tbody);
                partial.get("dealer-tr-partial");

                dealers.forEach(function(d) {
                    var tpl = handlebars.compile("{{> dealer-tr-partial}}"),
                        tr = $($(tpl(d)[0].firstChild));
                    tr.appendTo(tbody).delegate("td.td-action", "click", function() {
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
                });
            });
        },
        preparing: function(e) {
            var deferred = new langx.Deferred(),
                self = this;
            server().connect("provinces", "get", "index").then(function(data) {
                __provinces = data;
                deferred.resolve(self._buildDom(data));
            });
            return deferred.promise;
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
            partial.get("dealer-search-partial");
            var self = this,
                tpl = handlebars.compile("{{> dealer-search-partial}}"),
                div = $("<div>").html(tpl({
                    provinces: provinces
                })),
                selector = this.selector = $(div[0].firstChild),
                _cs = selector.find("#cityS");

            selector.find("#provinceS").on("change", function() {
                if (!this.value) toastr.warning("请选择省份！");
                server().getCities(this.value, _cs);
            });
            selector.find("#searchDealerBtn").on("click", function() {
                var val = _cs.val();
                if (!val) toastr.warning("请选择城市！");
                self.search(val, selector);
            });
            return this.selector;
        },

        getDom: function() {
            return this.selector;
        }
    });
});
