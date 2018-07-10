// coded with @comberj and @rafrocha
// requires
require('dotenv').config();
var request = require('request');
var fs = require('fs');
var mkdirp = require('mkdirp');
var args = process.argv;

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (!repoOwner || !repoName) { // incorrect number of args
    console.log('Error: Incorrect number of arguments!');
    return;
  }
  var options = { // url parameters
    url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
    headers: {
      'User-Agent': 'request',
      'GITHUB_TOKEN': process.env.GITHUB_TOKEN
    }
  };
  request(options, function(err, res, body) {
    if (res.statusCode === 404) {
      console.log('Error: Owner/Repo combo does not exist');
      return;
    }
    cb(err, body); // data passed to callback function
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function(err) { // error for failed request
      console.log('Error: Network Issue');
      return;
    })
    .on('response', function(response) { // error code for successful request (not a 2xx status code)
      if (response.statusCode < 200 || response.statusCode >= 300) {
        console.log('Error Code: ', response.statusCode);
        return;
      }
      console.log('Download started: ', filePath);
    })
    .on('end', function() {
      console.log('Download complete: ', filePath);
    })
    .pipe(fs.createWriteStream(filePath));
}

getRepoContributors(args[2], args[3], function(err, result) {
  var userData = JSON.parse(result);
  if (!fs.existsSync('./avatars/')) {
    mkdirp('./avatars/');
  }
  userData.forEach(function(user) {
    var imgURL = user.avatar_url;
    var download = './avatars/' + user.login + '.jpg';
    downloadImageByURL(imgURL, download); // pass avatar url and desired file path to downloadImageByURL function
  });
});