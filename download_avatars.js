var request = require('request');
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
      cb(err, body);
    })
    .on('error', function(err) {
      throw err;
    })
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", JSON.parse(result));
});