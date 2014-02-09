// Require in the Mongodb and Socket package
var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;


mongo.connect('mongodb://127.0.0.1/chat', function(err, db){ 
    if(err) throw err;

    client.on('connection', function(socket){
        //console.log("someone has connected");
        
        var col = db.collection('messages'),
            sendStatus = function(s){
                socket.emit('status', s);
            };
        
        
        //wait for input
        socket.on('input', function(data){
          var name = data.name, 
              message = data.message,
              whitespacePattern = /^\s*$/;
            
            // Check for valid input - not blank
            if (whitespacePattern.test(name)||whitespacePattern.test(message)){
                sendStatus('Name and Message is required');
                //console.log("Invalid Input");
            }else {
                col.insert({name: name, message: message}, function(){
                          //console.log("Inserted");   
                    sendStatus({ 
                        message: "Message Sent",
                        clear: true
                    });
                });
            }
        });
    });              
});
              
              
