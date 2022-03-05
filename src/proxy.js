const From = require('fastify-reply-from');


const httpMethods = ['DELETE', 'GET', 'HEAD', 'PATCH', 'POST', 'PUT', 'OPTIONS'];
const urlPattern = /^https?:\/\//


function isExternalUrl(url = '') {
    return urlPattern.test(url)
};

function generateRewritePrefix(prefix, opts) {
    if (!prefix) {
        return ''
    }

    let rewritePrefix = opts.rewritePrefix || (opts.upstream ? new URL(opts.upstream).pathname : '/')

    if (!prefix.endsWith('/') && rewritePrefix.endsWith('/')) {
        rewritePrefix = rewritePrefix.slice(0, -1)
    }

    return rewritePrefix
}

async function httpProxy(fastify, opts) {

    const preHandler = opts.preHandler || opts.beforeHandler;

    const rewritePrefix = generateRewritePrefix(fastify.prefix, opts)

    const fromOpts = Object.assign({}, opts)
    fromOpts.base = opts.upstream
    fromOpts.prefix = undefined

    const oldRewriteHeaders = (opts.replyOptions || {}).rewriteHeaders
    const replyOpts = Object.assign({}, opts.replyOptions, {
        rewriteHeaders
    })
    fromOpts.rewriteHeaders = rewriteHeaders

    fastify.register(From, fromOpts)

    if (opts.proxyPayloads !== false) {
        fastify.addContentTypeParser('application/json', bodyParser)
        fastify.addContentTypeParser('*', bodyParser)
    }

    function rewriteHeaders(headers) {
        const location = headers.location
        if (location && !isExternalUrl(location)) {
            headers.location = location.replace(rewritePrefix, fastify.prefix)
        }
        if (oldRewriteHeaders) {
            headers = oldRewriteHeaders(headers)
        }
        return headers
    }

    function bodyParser(req, payload, done) {
        done(null, payload)
    }

    // since we are using query string to determine the upstream server and endpoint, 
    // it is necessary to have request url set to empty value not to let fastify-reply-from 
    // generate the query string and append it to the end of request to upstream
    function restrictQS(request){
        if(request.raw.url.indexOf("?")!==-1){
            request.raw.url='';
        }
    }

    fastify.route({
        url: '/',
        method: opts.httpMethods || httpMethods,
        preHandler,
        config: opts.config || {},
        constraints: opts.constraints || {},
        handler
    })
    function handler(request, reply) {
        const { url } = request;
        const urlProxy = url.slice(url.indexOf("?") + 1, url.length);
        restrictQS(request);
        reply.from(urlProxy || '/', replyOpts);
    }
}

module.exports = httpProxy;