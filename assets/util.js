var fs = require('fs');
var file = './file.txt';

fs.readFile(file,'utf-8', function (err,data) {
  if(err){
    console.log(err);
    return ;
  }
  var map = {};
  var lines = data.split('\n');
  for(var i = 0; i < lines.length -1; i+=2) {
    var explanation = lines[i].slice(2);
    var permission =lines[i + 1];
    map[permission]  = explanation;
  }
  console.log(JSON.stringify(map));
});


