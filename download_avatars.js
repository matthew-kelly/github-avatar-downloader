require('dotenv').config();
var request = require('request');
var fs = require('fs');
var args = process.argv;

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (args.length !== 4) {
    console.log('Incorrect number of arguments!')
    throw Error();
  }
  var options = { // url parameters
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'GITHUB_TOKEN': process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    cb(err, body); // data passed to callback function
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) { // error for failed request
      throw err;
    })
    .on('response', function(response) { // error code for successful request (not a 2xx status code)
      if (response.statusCode < 200 || response.statusCode >= 300) {
        console.log('Error Code: ', response.statusCode);
        throw Error();
      }
      console.log('Download started');
    })
    .on('end', function() {
      console.log('Download complete');
    })
    .pipe(fs.createWriteStream('./avatars/' + filePath + '.jpg'));
}

getRepoContributors(args[2], args[3], function(err, result) {
  var userData = JSON.parse(result);
  userData.forEach(function(user) {
    downloadImageByURL(user.avatar_url, user.login); // pass avatar url and username to downloadImageByURL function
  });
});