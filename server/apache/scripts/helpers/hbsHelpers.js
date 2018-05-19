/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery","skylarkjs","./Partial","text!./_partials.handlebars"],function(a,o,t){o.langx;return{show:function(o){t.get("contact-user-info-partial"),t.get("contact-form-info-partial");var n=handlebars.compile("{{> contact-user-info-partial}}");a("#contact-info-modal").modal("show").find(".modal-body").html(n({contact:o})),a("#contact-info-modal").find(".btn-edit").on("click",function(){var t=handlebars.compile("{{> contact-form-info-partial}}");a("#contact-form-modal").modal("show").find(".modal-body").html(t({contact:o}))})}}});