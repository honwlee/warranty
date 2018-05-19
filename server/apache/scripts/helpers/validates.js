/**
 * warranty - 
 * @author 
 * @version v0.0.0
 * @link 
 * @license 
 */
define(["jquery"],function(r){var e={warrantyID:{emptyMsg:"质保ID不能为空",numsMsg:"用户名不能少于6位",nameMsg:"质保ID",numlMsg:"用户名不能多于14位",snMsg:"用户名必须以字母开头",validateMsg:"用户名不能包含字符",check:function(e){var s=r("#warrantyID");return s.val()?{error:!1}:(s.focus(),{error:!0,msg:this.emptyMsg})}},productRoll:{emptyMsg:"产品卷号不能为空",nameMsg:"产品卷号",check:function(e){var s=r("#productRoll");return s.val()?{error:!1}:(s.focus(),{error:!0,msg:this.emptyMsg})}},licensePlate:{emptyMsg:"车牌号/车架号不能为空",nameMsg:"车牌号/车架号",check:function(e){var s=r("#licensePlate");return s.val()?{error:!1}:(s.focus(),{error:!0,msg:this.emptyMsg})}},company:{emptyMsg:"公司名称不能为空",nameMsg:"公司名称",check:function(e){var s=r("#company");return s.val()?{error:!1}:(s.focus(),{error:!0,msg:this.emptyMsg})}}};return e});