console.log('Done1');
$(function() {
  
    $('#dropzone').on('dragover', function() {
      $(this).addClass('hover');
      console.log("dragover")
    });
    
    $('#dropzone').on('dragleave', function() {
      $(this).removeClass('hover');
      console.log("dragleave")
    });
    
    $('#dropzone input').on('change', function(e) {
      var file = this.files[0];
      const {name} = file;
      $('#dropzone').removeClass('hover');
      $('#dropzone').addClass('dropped');
      $('#dropzone img').remove();
    var reader = new FileReader(file);
    const div = document.querySelector("#text");
    div.innerText = `Choosen successfully`
    console.log(reader);
    reader.readAsDataURL(file);
    console.log("reached")
    reader.onload = function(e) {
        //   var data = e.target.result,
        //       $img = $('<img />').attr('src', data).fadeIn();
          console.log("reached")
        };
    //   } else {
    //     var ext = file.name.split('.').pop();
        
    //     $('#dropzone div').html(ext);
    //   }
    });
  });


  function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
  }

  
  console.log('Done2');
  const url = window.location.href;
  console.log(url);
      const downloadHandler = async (e)=>{
        e.preventDefault();
        const id = document.querySelector("#id").innerText;
        console.log({id})
        const password = document.querySelector('#password').value;
        console.log(password)
        // const res = await axios.post(url,{password});
       
        try{
          const res = await axios({
            url,
           method: 'POST',
           responseType: 'blob',
           body:{
             password
           } // important
         });
         console.log(res)
        const response = await axios.get(`/find/${id}`);
        const filename = response.data.filename;
        if(res.status === 404){
          const error = document.querySelector(".wrong");
          console.dir(error);
        }else{
          const urllink = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement('a');
          link.href = urllink;
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          // window.history.back();
        }
        }catch(err){
            const error = document.querySelector("#wrong");
            error.style.display = "block";
        }
        
      }



