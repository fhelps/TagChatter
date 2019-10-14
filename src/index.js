(function(apiUrl) {
  function fetchParrotsCount() {
    return fetch(apiUrl + "/messages/parrots-count")
      .then(function(response) {
        return response.json();
      })
      .then(function(count) {
      //  console.log(count)
        document.getElementById("parrots-counter").innerHTML = count;
      });
  }

  function listMessages() {
    // Faz um request para a API de listagem de mensagens
    // Atualiza a o conteúdo da lista de mensagens
    // Deve ser chamado a cada 3 segundos
    return fetch(apiUrl + "/messages")
    .then(function(response) {
      
      if (response.status != 200) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    })
    .then(function(messages) {
      
      messages.forEach(element => {
        $("#message-body").append(" <div class='row message'>" +
        "<div class='media'>" +
            "<img style='margin-top: 10px; border-radius: 5px;' width='60px' height='60px' src='"+element.author.avatar+"'class='mr-3'>" +     
            "<div display='inline' class='media-body'>" +
              "<div id='message-header' class='mt-0'>" +
                  "<b><span>"+ element.author.name +"</span></b>" +
                  "<span> &#149 "+ new Date(element.created_at).getHours() +":"+ new Date(element.created_at).getMinutes() +" &#149</span> " +
                  "<img id='"+element.id+"' class='parrot-message' src='./images/parrot.svg' >" +
                  "<span id='parrot-"+element.id+"' ></span>"+
              "</div>"+ element.content +"</div>" +
            "</div>" +
        "</div>")
      
        $("#"+element.id).click(function (){parrotMessage(element.id)})
        //console.log($("#"+element.id))

        if(element.has_parrot){
          $("#parrot-"+element.id).text('1')
          $("#"+element.id).attr('src','./images/parrot.svg');
        }else{
          $("#parrot-"+element.id).text('0')
          $("#"+element.id).attr('src','./images/light-parrot.svg');
        }
        
      });
    }).catch(function(e){
      alert('erro: '+ e);
    });
  }

  function parrotMessage(messageId) {
    // Faz um request para marcar a mensagem como parrot no servidor
    // Altera a mensagem na lista para que ela apareça como parrot na interface
   
      fetch(apiUrl + "/messages/"+messageId+"/parrot", {
        method: 'put',
      }).then(function(response) {
        return response.json();
      }).then(function(data) {
      //  console.log(data)
        if(data.has_parrot){
          $("#parrot-"+data.id).text('1')
          $("#"+data.id).attr('src','./images/parrot.svg');
        }else{
          $("#parrot-"+data.id).text('0')
          $("#"+data.id).attr('src','./images/light-parrot.svg');
        }
      });

  }

  function sendMessage(message, authorId) {
    // Manda a mensagem para a API quando o usuário envia a mensagem
    // Caso o request falhe exibe uma mensagem para o usuário utilizando Window.alert ou outro componente visual
    // Se o request for bem sucedido, atualiza o conteúdo da lista de mensagens
    let send =
    {
      "message": message,
      "author_id": authorId
    }

    //console.log(message)
    //console.log(authorId)
    fetch(apiUrl + "/messages", {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body:  JSON.stringify(send)
    }).then(function(response) {
      if (response.status != 200) {
        throw new Error("HTTP status " + response.status);
      }
      return response.json();
    }).then(function(element) {
    
       $("#message-body").append(" <div class='row message'>" +
       "<div class='media'>" +
           "<img style='margin-top: 10px; border-radius: 5px;' width='60px' height='60px' src='"+element.author.avatar+"'class='mr-3'>" +     
           "<div display='inline' class='media-body'>" +
             "<div id='message-header' class='mt-0'>" +
                 "<b><span>"+ element.author.name +"</span></b>" +
                 "<span> &#149 "+ new Date(element.created_at).getHours() +":"+ new Date(element.created_at).getMinutes() +" &#149</span> " +
                 "<img id='"+element.id+"' class='parrot-message' src='./images/parrot.svg' >" +
                 "<span id='parrot-"+element.id+"' ></span>"+
             "</div>"+ element.content +"</div>" +
           "</div>" +
       "</div>")

       $("#"+element.id).click(function (){parrotMessage(element.id)})
       //console.log($("#"+element.id))

       if(element.has_parrot){
         $("#parrot-"+element.id).text('1')
         $("#"+element.id).attr('src','./images/parrot.svg');
       }else{
         $("#parrot-"+element.id).text('0')
         $("#"+element.id).attr('src','./images/light-parrot.svg');
       }

       $("#message-text").val('')

    }).catch(function(e){
      alert('Insira mensagem');
    });;
  }

  function getMe() {
    // Faz um request para pegar os dados do usuário atual
    // Exibe a foto do usuário atual na tela e armazena o seu ID para quando ele enviar uma mensagem
   // Create a request variable and assign a new XMLHttpRequest object to it.
   return fetch(apiUrl + "/me")
   .then(function(response) {
     return response.json();
   })
   .then(function(user) {

     document.getElementById("user-avatar").src= user.avatar;
     $("#user-name").text(user.id);
   
    });
  }

  function initialize() {
    fetchParrotsCount();
    getMe();
    listMessages();
    $('#send-message').click(function(){
      sendMessage($("#message-text").val(),  $("#user-name").text())
    })
  }

  initialize();
// })("https://tagchatter.herokuapp.com");
})("http://localhost:3000");




