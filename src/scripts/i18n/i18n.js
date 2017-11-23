define([
    "text!./en.json",
    "text!./zh-cn.json",
    "text!./zh-tw.json"
], function(en, zhCn, zhTw) {
    var i18n = {
        "en": JSON.parse(en),
        "zh-CN": JSON.parse(zhCn),
        "zh-TW": JSON.parse(zhTw)
    };
    return {
        select: function(selector, name) {
            selector.find(".--i18n--").each(function(index, el) {
                var key = $(el).data('i18nKey');
                if (key.match(/--html$/)) {
                    $(el).html(i18n[name][key]);
                } else {
                    $(el).text(i18n[name][key]);
                }
            });
        }
    }
});
