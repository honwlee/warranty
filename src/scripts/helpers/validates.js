define(["jquery"], function($) {
    var validates = {
        warrantyID: {
            emptyMsg: "质保ID不能为空",
            numsMsg: "用户名不能少于6位",
            nameMsg: "质保ID",
            numlMsg: "用户名不能多于14位",
            snMsg: "用户名必须以字母开头",
            validateMsg: "用户名不能包含字符",
            check: function(value) {
                var _us = $("#warrantyID");
                if (!_us.val()) {
                    //     if (value.length < 6) {
                    //         _us.focus();
                    //         return { error: true, msg: this.numsMsg };
                    //     }
                    //     if (value.length > 14) {
                    //         _us.focus();
                    //         return { error: true, msg: this.numlMsg };
                    //     }
                    //     if (!value.match(/^[a-zA-Z0-9]+$/)) {
                    //         _us.focus();
                    //         return { error: true, msg: this.validateMsg };
                    //     }
                    //     if (value.match(/^[^a-zA-Z]/)) {
                    //         _us.focus();
                    //         return { error: true, msg: this.snMsg };
                    //     }
                    // } else {
                    _us.focus();
                    return { error: true, msg: this.emptyMsg };
                }
                return { error: false };
            }
        },
        productRoll: {
            emptyMsg: "产品卷号不能为空",
            nameMsg: "产品卷号",
            check: function(value) {
                var _us = $("#productRoll");
                if (!_us.val()) {
                    _us.focus();
                    return { error: true, msg: this.emptyMsg };
                }
                return { error: false };
            }
        },
        licensePlate: {
            emptyMsg: "车牌号/车架号不能为空",
            nameMsg: "车牌号/车架号",
            check: function(value) {
                var _us = $("#licensePlate");
                if (!_us.val()) {
                    _us.focus();
                    return { error: true, msg: this.emptyMsg };
                }
                return { error: false };
            }
        },
        company: {
            emptyMsg: "公司名称不能为空",
            nameMsg: "公司名称",
            check: function(value) {
                var _us = $("#company");
                if (!_us.val()) {
                    _us.focus();
                    return { error: true, msg: this.emptyMsg };
                }
                return { error: false };
            }
        }
    };
    return validates;
})