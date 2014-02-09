(function(){
    //console.log('START');
    // useing as a selector instead of using jquery 
    var getNode = function(s) {
        return document.querySelector(s);
    },
    // Get required nodes (Areas to manipulate)
    messages = getNode('.chat-messages'),
    status = getNode('.chat-status span'),
    textarea = getNode('.chat textarea'), 
    chatName = getNode('.chat-name'),
    statusDefault = status.textContent,
    setStatus = function(s){
        status.textContent = s;

        // revert back after a time delay
        if (s !== statusDefault){
            var delay = setTimeout(function(){
                setStatus(statusDefault);
                clearInterval(delay);
            }, 1500);
        }
    };

    console.log(statusDefault);

    // Connect to Server
    try{
        var socket = io.connect('http://127.0.0.1:8080');
        if(socket !== undefined){
             //console.log('Socket OK');

             // Listen for output
             socket.on('output', function(data){
                 //console.log(data);
                 if(data.length){
                     // loop through the results / messages
                     for(var x = 0; x < data.length; x= x+1){
                         var message = document.createElement('div'); 
                         message.setAttribute('class', 'chat-message');
                         message.textContent = data[x].name + ': ' + data[x].message;
                         //append
                         messages.appendChild(message);
                         // last message posted will be at the top
                         messages.insertBefore(message,messages.firstChild);
                     }    
                 }
             });

             //Listen for a status
             socket.on('status', function(data){
                 setStatus((typeof data === 'object') ? data.message : data);
                 // clear the textarea after successfull send 
                 if(data.clear ===true){
                     textarea.value = '';
                 }
             });

            // Listen for keydown in the textarea
            textarea.addEventListener('keydown', function(event){
                var self = this, 
                    name = chatName.value;
                //console.log(event.which);

                 //Check for Enter key press  AND shift key 
                if(event.which === 13 && event.shiftKey === false){
                    //Use socket to send message
                    socket.emit('input', {
                        name: name,
                        message: self.value 
                    });
                    // prevent Default behaviour of keydown 
                    event.preventDefault();
                }

            });
        }
    }catch(e){
        // Set status to warn user
    }

})();