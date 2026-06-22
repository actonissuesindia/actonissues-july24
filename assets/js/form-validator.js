// Starter JavaScript for disabling form submissions if there are invalid fields
$(document).ready(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault()
        if (!form.checkValidity()) {
          event.stopPropagation()
        } else {
          $.ajax({
            url: form.action, 
            type: "POST",             
            data: $('form').serialize(),
            dataType : 'json',    
            success: function(data) {
              '<div class="alert alert-success" role="alert">'+data.message+'</div>';
              $('#exampleModal').modal('hide');
              $('#exampleModal1').modal('hide');
              $('#exampleModal2').modal('hide');
              $('#exampleModal3').modal('hide');
              window.location.reload()
            },
            eror: function(err) {
              '<div class="alert alert-danger" role="alert">'+err.message +'</div>'
            } 
          })
          return false;
        }

        form.classList.add('was-validated')
      }, false)
    })
})