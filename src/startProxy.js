const Fastify = require('fastify');
const corsOptions = require('../config/cors');

const proxy = require('./proxy');
async function startProxy(portNumber) {
  const server = Fastify();
  server.register(require('fastify-cors'),
    {
      // put your options here or define them in ../config/cors.js file
      ...corsOptions
    })
  server.register(proxy, {});

  await server.listen(portNumber);
  return server;
}

module.exports = async function run(portNumber) {
  const instance = await startProxy(portNumber);
  // console.log(instance);
  console.log('proxy started', `http://localhost:${instance.server.address().port}/`);
  return instance;
};