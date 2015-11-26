/**
 * jQuery.validate的异步验证插件
 * @author 董超
 */

(function($){
  if(typeof $.validator != 'function') return;

  /**
   * 此方法会初始化出来一个验证器，该验证器的方法祥见下方各函数注释
   * @param 注册的验证域和函数，格式为
   *          {
   *            //传入函数的value为name为name1表单元素的值，cb为完成验证的回调函数
   *            name1: function(value, cb){....; cb(false, msg)},
   *            ...
   *          }
   */
  $.validator.prototype.async = function(valis){
    var jValidator = this;
    var form$ = $(this.currentForm);
    var names = []
    for(name in valis){names.push(name)}

    var ckeckFn = jValidator.check;
    jValidator.check = function(element){
      var r = ckeckFn.apply(jValidator, arguments);
      if(r && element.name in valis){
        validate(element.name);
      }
      return r;
    }

    function validate(name,cb){
      var target$ = form$.find('[name=' + name + ']');
      valis[name].call(target$, target$.val(), function(valid, msg){
        if(valid){
          if(typeof cb == 'function') cb(true);
        }else{
          jValidator.showInvalid(target$[0], msg);
          if(typeof cb == 'function') cb(false, msg);
        }
      })
    }

    var validator = {
      /**
       * 验证一个表单项
       * @param name 表单项的name属性
       * @param cb 验证完成的回调函数，具有一个boolean类型参数代表验证通过或失败
       */
      validate: function(name, cb){
        if(typeof valis[name] != 'function')
          throw new Error("Can't find the element which name of " + name);
        if(jValidator){
          if(!jValidator.element('[name='+name+']')){
            if(typeof cb == 'function') cb(false);
            return;
          }
        }
        validate(name, cb);
      },
      /**
       * 验证一些表单项
       * @param name 表单项的name属性数组
       * @param cb 全部验证完成的回调函数，具有一个boolean类型参数代表验证通过或失败
       */
      validateSome: function(names, cb){
        var allValid = true;
        var count = 0;
        for(var i=0; i<names.length; i++){
          var name = names[i]
          count++;
          validator.validate(name, function(valid){
            count--;
            if(!valid) allValid = false;
            checkFinish();
          })
        }
        function checkFinish(){
          if(count < 1){
            if(typeof cb == 'function') cb(allValid);
          }
        }
      },
      /**
       * 验证注册的全部表单项
       * @param cb 全部验证完成的回调函数，具有一个boolean类型参数代表验证通过或失败
       */
      validateAll: function(cb){
        validator.validateSome(names, cb);
      }
    }

    return validator;
  }

  /**
   * 强制显示验证非法提示信息（对jQuery.validate的默认方式有效）
   * @param el jQuery可接受的选择器或元素
   * @param msg 提示信息
   */
  $.validator.prototype.showInvalid = function(el, msg){
    el = $(el)[0];
    this.showLabel(el, msg);
    $(el).next('.error').show();
  }
})(jQuery)
