$(document).ready(function() {
  function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $('#imagePreview').css('background-image', 'url('+e.target.result +')');
          $('#imagePreview').hide();
          $('#imagePreview').fadeIn(650);
        }
        
        reader.readAsDataURL(input.files[0]);
    }
  }

  function uploadAvatar(input) {
    if (input.files && input.files[0]) {

      const formData = new FormData();
      formData.append('avatar', input.files[0]);
      axios.post('/account/profile/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      })
      .then(function (res) {
        var reader = new FileReader();
        reader.onload = function(e) {
          $('#imagePreview').css('background-image', 'url('+e.target.result +')');
          $('#imagePreview').hide();
          $('#imagePreview').fadeIn();
        }
        
        reader.readAsDataURL(input.files[0]);
      })
      .catch(function (error) {
        console.log(error);
      });
        
    }
  }
  $("#imageUpload").change(function() {
    uploadAvatar(this)
  });
})