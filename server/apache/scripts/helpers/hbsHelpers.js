define([
    "jquery",
    "skylarkjs",
    "./Partial",
    "text!./_partials.handlebars",
], function($, skylarkjs, partial) {
    var langx = skylarkjs.langx;
    return {
        show: function(contact) {
            partial.get("contact-user-info-partial");
            partial.get("contact-form-info-partial");
            var infoTpl = handlebars.compile("{{> contact-user-info-partial}}");
            $('#contact-info-modal').modal('show').find(".modal-body").html(infoTpl({ contact: contact }));
            $('#contact-info-modal').find(".btn-edit").on("click", function() {
                var formTpl = handlebars.compile("{{> contact-form-info-partial}}");
                $('#contact-form-modal').modal('show').find(".modal-body").html(formTpl({ contact: contact }));
            });
        }
    }
});
