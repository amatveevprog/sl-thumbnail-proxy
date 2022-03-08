var assert = require('assert');
const _ = require('lodash');
const Proxy = require('../src');
const Upstream = require('../util/otherServer');
const PORT_NUMBER = 3000;
const UPSTREAM_PORT = 2020;

let proxy;
let upstream;

function filterPseudoHeaders (headers) {
    const dest = {}
    const headersKeys = Object.keys(headers)
    let header
    let i
    for (i = 0; i < headersKeys.length; i++) {
      header = headersKeys[i]
      if (header.charCodeAt(0) !== 58) { // fast path for indexOf(':') === 0
        dest[header.toLowerCase()] = headers[header]
      }
    }
    return dest
  }


const proxyUrl = 'http://localhost:3000?http://localhost:2020/from_proxy';
const dataStub = {
    GET: {
        method: 'GET',
        url: proxyUrl+'?param1=1&param2=2',
        headers: {
            'myCustomHeader': '132',
            'Authorization': 'Bearer sadfswerwerwqe324234',
            'Content-Type': 'application/json',
        },
    },
    POST: {
            method: 'POST',
            url: proxyUrl,
            headers: {
                'myCustomHeader': '132',
                'Authorization': 'Bearer sadfswerwerwqe324234',
                'Content-Type': 'application/json',
                'Cookie': 'access-token=b7546f42-20d4-491e-a8eb-800939d36157; expires_in=5258; refresh-token=702d011b-f70e-4363-ba1e-4e11ebe8d49d'
            },
            body: JSON.stringify({
                "someNumber": 1
            })
    }
}

describe('http and https proxy test one:', function () {
    before('start proxy and upstream servers', async () => {
        proxy = await Proxy(PORT_NUMBER);
        upstream = await Upstream(UPSTREAM_PORT);
    });

    it('should perform GET http request and return some data', function (done) {
        var request = require('request');
        var options = dataStub.GET;
        request(options, function (error, response) {
            if (error) throw new Error(error);
            const body = JSON.parse(response.body);
            const _request = body.request;
            const { headers,query} = _request;
            const initialHeaders = filterPseudoHeaders(dataStub.GET.headers);
            delete(headers['host']);
            delete(headers['connection']);
            // delete(headers['content-type']);

            console.log('HEADERS: ', headers);
            console.log('QUERY: ', query);
            console.log('filtered headers: ', filterPseudoHeaders(dataStub.GET.headers));
            
            assert.equal(_.isEqual(headers,initialHeaders), true);
            assert.equal(_.isEqual(query,{
                param1:'1',
                param2:'2',
            }), true);
            done();
        });
    });

    it('should perform POST http request and return some data', function (done) {
        var request = require('request');
        var options = dataStub.POST;
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            done();
        });
    });

    after(function () {
        proxy.close();
        upstream.close();
    });

});