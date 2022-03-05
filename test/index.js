var assert = require('assert');
const Proxy = require('../src');
const PORT_NUMBER = 3000;
const proxy = Proxy(PORT_NUMBER);

describe('http and https proxy test one:', function () {
    it('should perform http request and return some data', function () {
        var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'http://localhost:3000?http://localhost:2020/from_proxy',
            'headers': {
                'myCustomHeader': '132',
                'Authorization': 'Bearer sadfswerwerwqe324234',
                'Content-Type': 'application/json',
                'Cookie': 'access-token=b7546f42-20d4-491e-a8eb-800939d36157; expires_in=5258; refresh-token=702d011b-f70e-4363-ba1e-4e11ebe8d49d'
            },
            body: JSON.stringify({
                "a": 1
            })

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});