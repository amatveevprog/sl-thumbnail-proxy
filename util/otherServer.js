const Fastify = require('fastify');
const httpMethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS'];

class Server {
    constructor(port) {
        this.port = port;
        this.fastifyInst = Fastify();
    }
    async run() {
        await this.fastifyInst.route({
            path: '/from_proxy',
            method: httpMethods,
            handler: (req, res) => {
                const query = req.query ? req.query : undefined;
                console.log('received a request with headers: ', JSON.stringify(req.headers, null, 2));
                console.log('received a request with body: ', JSON.stringify(req.body, null, 2));
                res.send({ request: { headers: req.headers, body: req.body ? req.body : undefined , query } });
            }
        });

        await this.fastifyInst.listen(this.port, (err, address) => {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            this.fastifyInst.log.info(`server is listening on ${address}`);
        });
    }
    get = () => this.fastifyInst;
    async close() {
        try {
            const res = await this.fastifyInst.close();
            console.log('successfully closed');
        }
        catch (err) {
            console.log('error while closing fastify upstream server: ', err);
        }
    };
}

module.exports = async function createServer(port) { 
    const server = new Server(port);
    await server.run();
    return server;
};

