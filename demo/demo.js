(function($){
  var validator = $('#test-form').validate({
    // onkeyup: false,
    rules:{
      url: {
        required: true,
        url: url
      },
      email: {
        email: email
      }
    },
    submitHandler: function(form){
      asyncValidator.validateAll(function(allValid){
        if(allValid){
          alert('Well done!')
        }
      })
    }
  })

  var asyncValidator = validator.async({
    url: function(value, cb){
      checkCountry(value, function(result){
        if(result)
          cb(true);
        else
          cb(false, 'Please enter a URL with Chinese domain');
      })
    }
  })

  function checkCountry(url, cb){
    setTimeout(function(){
      cb((/\.cn\/|\.cn$/).test(url));
      console.log('recived a check request: ' + url);
    }, 300);
  }
})(jQuery)
