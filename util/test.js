const Server = require('./otherServer');
async function run(){
    const port = 4040;
    const server = Server(port);
    return server;
};
run();