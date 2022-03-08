const Proxy = require('./index.js');
const PORT_NUMBER = 3000;

async function run(){
    const proxy = await Proxy(PORT_NUMBER);
}
run();


