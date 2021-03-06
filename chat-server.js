//----------------------------------------------------------
// Chat Server
// Stores and emits chat messages to Clients on the socket
// Run with:        node chat-server.js
//----------------------------------------------------------

// Require in the Mongodb and Socket.io package
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
        // Emit all messages-------------------------------------------
        col.find().limit(100).sort({_id: 1}).toArray(function(err, res){
            if(err) throw err;
            socket.emit('output', res);
        });
        
        //wait for input-----------------------------------------------
        socket.on('input', function(data){
          var name = data.name, 
              message = data.message,
              whitespacePattern = /^\s*$/;
            
            // Check for valid input - not blank ----------------------
            if (whitespacePattern.test(name)||whitespacePattern.test(message)){
                sendStatus('Name and Message is required');
                //console.log("Invalid Input");
            }else {
                // insert message and emit to clients and send a status message update
                col.insert({name: name, message: message}, function(){
                    // Emit latest message to All clients
                    client.emit('output', [data]);
                    // clear to clear the status message
                    sendStatus({ 
                        message: "Message Sent",
                        clear: true
                    });
                });
            }
        });
    });              
});