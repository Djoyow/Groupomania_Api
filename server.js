const http = require('http');
const app = require('./app');
const bd = require('./bd/connect');
const { Server }  = require("socket.io") ;
const cors = require('cors')


//const serverless = require('serverless-http')

// Get normalize port

const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '8080');
app.set('port', port);

// errorHandler

const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            process.exit(1);
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            process.exit(1);
        default:
            throw error;
    }
};

app.use(cors())


const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:"http://localhost:3001"
    }
});

io.on("connection", (socket) => {

    //console.log("socket: ",socket.id);

    socket.on("join_room", (data)=>{
        socket.join(data);
        console.log("Joined: ",data);
    });
    
    socket.on("send_message", (data) => {
        console.log("Send_message: ",data);
        socket.to(data.room).emit("receive_message",data);
    });



    //socket.on("dis")
    
    
    //console.log("io.sockets.adapter.rooms:  ", socket.adapter); 

  });


/*io.on("connect_error", (err) => {
    console.log("connect_error: ",err);
  });*/

server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
//module.exports.handler = serverless(app);
bd.conect();


