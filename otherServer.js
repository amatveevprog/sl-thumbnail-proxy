const fastify = require('fastify')({
    logger: true
});
const httpMethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS'];


fastify.get('/', (req, res) => {
    // const stream = fs.createReadStream(path.resolve('test.html'));
    res.send({ status: 'success!!!!!!!' });
}); 

fastify.route(
    {
        path: '/from_proxy',
        method: httpMethods,
        handler: (req, res) => {
            console.log('received a request with headers: ', JSON.stringify(req.headers, null, 2));
            console.log('received a request with body: ', JSON.stringify(req.body, null, 2));
            res.send({ request: { headers: req.headers, body: req.body } });
        }
    });

fastify.listen(2020, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`server is listening on ${address}`);
});