var request = require('request');
var fs = require('fs');
var tokens = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'GITHUB_TOKEN': tokens.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    body = JSON.parse(body);
    body.forEach(function(user) {
      console.log(user.avatar_url);
    })
    cb(err, body);
  });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  // console.log("Result:", result);
});

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) { // error for failed request
      throw err;
    })
    .on('response', function(response) { // error code for successful request
      if (response.statusCode < 200 || response.statusCode >= 300) {
        console.log('Error Code: ', response.statusCode);
        throw Error();
      }
    })
    .pipe(fs.createWriteStream('./' + filePath));
}
// testing
downloadImageByURL("https://avatars2.githubusercontent.com/u/2741?v=3&s=466", "avatars/kvirani.jpg")