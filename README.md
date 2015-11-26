# jquery-validation-async
a jquery-validation plugin for async validate

jquery-validation的异步验证插件

## 功能说明
jquery.validate是目前广泛使用且成熟稳定的表单验证插件，但它不支持异步验证。本插件目的是在遵循原插件使用方式的基础上增加轻量的异步验证功能。

本插件并没有改变jquery.validate原有的同步验证方式，而是把异步验证作为补充。

在jquery.validate原有的同步验证通过之后，异步验证就会被触发，所以强烈建议把jquery.validate的onkeyup属性置为false，以免造成过多网络请求。

## 使用方法
对jquery.validate的对象调用async方法，传入各表单域name所对应的验证函数，会得到一个异步验证器对象：

    var validator = $('#some-form').validate({
      onkeyup: false,
      ...
    });

    var asyncValidator = validator.async({
      field1: function(value, cb){
        $.get('some/url/target', function(result){
          cb(result.success, result.msg);
        }),
        ...
      }
    })

得到的验证器对象具有一些验证方法，可验证一个域、多个域或者整个表单，这些方法有：
- validate(name, callback) 验证一个域，需传入域的name和回调函数，回到函数会传入一个boolean类型的参数表示是否验证通过。
- validateSome(names, callback) 验证多个域，把它们的name作为数组传入，回调函数会传入所有域的验证结果，有一个不通过即为false。
- validateAll(callback) 验证表单中所有已经注册的域。

## 注意事项
- 异步验证不通过并不会阻止submitHandler函数的调用，所以在submitHandler中需要先调用asyncValidator.validateAll方法进行全表单异步验证。
