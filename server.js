var mongo = require('mongodb').MongoClient,
    client = require('socket.io').listen(8080).sockets;


mongo.connect('mongodb://127.0.0.1/chat', funciton(err, db){ 
    if(err) throw err;

    client.on('connection', function(socket){
        //console.log("someone has connected");
        
        var col = db.collection('messages');
        
        
        //wait for input
        socket.on('input', function(data){
          var name = data.name, 
              message = data.message,
              whitespacePattern = /^\s*$/;
            
            if (whitespacePattern.test(name)||whitespacePattern.test(message)){
                console.log('Invalid Input');
            }else {
                col.insert({name: name, message: message}, function(){
                          console.log('Insterted');   
                });
            }
        });
    });              
});
              
              
