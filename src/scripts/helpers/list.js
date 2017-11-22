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

    function totalTextFormatter(data) {
        return data ? data : "-";
    };

    function operateFormatter(value, row, index) {
        return [
            '<a class="view" href="javascript:void(0)" title="查看">',
            '<i class="glyphicon glyphicon-eye-open"></i>',
            '</a>',

            '<a class="remove" href="javascript:void(0)" title="删除">',
            '<i class="glyphicon glyphicon-remove"></i>',
            '</a>',

            '<a class="edit" href="javascript:void(0)" title="编辑">',
            '<i class="glyphicon glyphicon-edit"></i>',
            '</a>  '
        ].join('');
    };

    function imageFormatter(value, row, index) {
        return value && value.path ? "<img src='" + value.path + '">' : "-";
    }

    function _initProdTable(selector, operate) {
        var columns = [{
            field: 'id',
            title: '标识符',
            visible: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'prodNumber',
            title: '产品卷号',
            formatter: totalTextFormatter
        }, {
            field: 'createdDate',
            title: '生产时间',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'createdAddress',
            title: '生产地',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'checker',
            title: '检验人员',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'checkAddress',
            title: '检验地',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'modelNum',
            title: '型号',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'saleAddress',
            title: '销售地',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }];
        if (operate) {
            columns.push({
                field: 'operate',
                title: '操作',
                align: 'center',
                events: {
                    'click .view': function(e, value, row, index) {
                        var modal = $("#contentModal");
                        itemActions.productItem(modal.find(".modal-body"), row);
                        modal.modal('show');
                    },
                    'click .edit': function(e, value, row, index) {
                        formModal.show("product", row, function(_p) {
                            // selector.bootstrapTable('updateRow', { index: index, row: _p });
                            selector.bootstrapTable('refresh', {
                                url: '/api/products/index'
                            });
                        });
                    },
                    'click .remove': function(e, value, row, index) {
                        itemActions.removeProduct(row, function() {
                            // selector.bootstrapTable('remove', { field: 'id', values: [row.id] });
                            selector.bootstrapTable('refresh', {
                                url: '/api/products/index'
                            });
                        });
                    }
                },
                formatter: operateFormatter
            });
        }
        selector.empty().bootstrapTable({
            responseHandler: function(res) {
                return res;
            },
            uniqueId: "id",
            search: true,
            sortName: "prodNumber",
            showRefresh: true,
            sortOrder: "desc",
            url: '/api/products/index',
            method: 'get',
            sidePagination: "server",
            pagination: true,
            pageList: "[5, 10, 20, 50, 100, 200]",
            columns: columns
        });
    };

    function _initDealerTable(selector, operate) {
        var columns = [{
            field: 'id',
            title: '标识符',
            visible: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'company',
            title: '公司名称',
            formatter: totalTextFormatter
        }, {
            field: 'address',
            title: '地址',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }];
        if (operate) {
            columns.push({
                field: 'operate',
                title: '操作',
                align: 'center',
                events: {
                    'click .view': function(e, value, row, index) {
                        var modal = $("#contentModal");
                        itemActions.dealerItem(modal.find(".modal-body"), row);
                        modal.modal('show');
                    },
                    'click .edit': function(e, value, row, index) {
                        formModal.show("dealer", row, function(_p) {
                            selector.bootstrapTable('refresh', {
                                url: '/api/dealers/index'
                            });
                            // selector.bootstrapTable('updateRow', { index: index, row: _p });
                        });
                    },
                    'click .remove': function(e, value, row, index) {
                        itemActions.removeDealer(row, function() {
                            selector.bootstrapTable('refresh', {
                                url: '/api/dealers/index'
                            });
                            // selector.bootstrapTable('remove', { field: 'id', values: [row.id] });
                        });
                    }
                },
                formatter: operateFormatter
            });
        }
        selector.empty().bootstrapTable({
            responseHandler: function(res) {
                return res;
            },
            uniqueId: "id",
            search: true,
            sortName: "company",
            showRefresh: true,
            sortOrder: "desc",
            url: '/api/dealers/index',
            method: 'get',
            sidePagination: "server",
            pagination: true,
            pageList: "[5, 10, 20, 50, 100, 200]",
            columns: columns
        });
    };

    function _initWarrantyTable(selector, operate) {
        var columns = [{
            field: 'id',
            title: '标识符',
            visible: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'customerName',
            title: '客户姓名',
            formatter: totalTextFormatter
        }, {
            field: 'customerPhone',
            title: '客户电话',
            formatter: totalTextFormatter
        }, {
            field: 'vehicleType',
            title: '装贴种类',
            formatter: totalTextFormatter
        }, {
            field: 'type',
            title: '装贴车型',
            formatter: totalTextFormatter
        }, {
            field: 'prodNumber',
            title: '产品卷号',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'carNumber',
            title: '车牌号/车架号',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'engineer',
            title: '施工技师',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'shop',
            title: '施工门店',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'exeDate',
            title: '施工时间',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }, {
            field: 'proDate',
            title: '质保时间',
            sortable: false,
            align: 'center',
            formatter: totalTextFormatter
        }];
        if (operate) {
            columns.push({
                field: 'operate',
                title: '操作',
                align: 'center',
                events: {
                    'click .view': function(e, value, row, index) {
                        var modal = $("#contentModal");
                        itemActions.warrantyItem(modal.find(".modal-body"), row);
                        modal.modal('show');
                    },
                    'click .edit': function(e, value, row, index) {
                        formModal.show("warranty", row, function(_p) {
                            selector.bootstrapTable('refresh', {
                                url: '/api/warranties/index'
                            });
                            // selector.bootstrapTable('updateRow', { index: index, row: _p });
                        });
                    },
                    'click .remove': function(e, value, row, index) {
                        itemActions.removeWarranty(row, function() {
                            selector.bootstrapTable('refresh', {
                                url: '/api/warranties/index'
                            });
                            // selector.bootstrapTable('remove', { field: 'id', values: [row.id] });
                        });
                    }
                },
                formatter: operateFormatter
            });
        }
        selector.empty().bootstrapTable({
            responseHandler: function(res) {
                return res;
            },
            uniqueId: "id",
            sortName: "prodNumber",
            search: true,
            sortOrder: "desc",
            showRefresh: true,
            url: '/api/warranties/index',
            method: 'get',
            sidePagination: "server",
            pagination: true,
            pageList: "[5, 10, 20, 50, 100, 200]",
            columns: columns
        });
    };

    return {
        initTable: function(type, selector, operate) {
            this[type](selector, operate);
        },

        product: function(selector, operate) {
            // if()
            // return server().connect("products", "get", "index").then(function(products) {
            if (this.productInited) return selector.bootstrapTable('refresh');
            this.productInited = true;
            return _initProdTable(selector, operate);
            // });
        },

        warranty: function(selector, operate) {
            // return server().connect("warranties", "get", "index").then(function(warranties) {
            if (this.warrantyInited) return selector.bootstrapTable('refresh');
            this.warrantyInited = true;
            return _initWarrantyTable(selector, operate);
            // });
        },

        dealer: function(selector, operate) {
            // return server().connect("dealers", "get", "index").then(function(dealers) {
            if (this.dealerInited) return selector.bootstrapTable('refresh');
            this.dealerInited = true;
            return _initDealerTable(selector, operate);
            // });
        }
    };
});