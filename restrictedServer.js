var request = require('request');
var options = {
  'method': 'POST',
  'url': 'localhost:3000?http://localhost:2020/from_proxy',
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
});