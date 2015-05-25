'use strict';
var cp = require('child_process');
var fs = require('fs');

var _ = require('lodash');
var async = require('neo-async');
var cchangelog = require('conventional-changelog');
var semver = require('semver');

var COMMIT_PATTERN = /^(\w*)(\(([\w\$\.\-\* ]*)\))?\: (.*)$/;

module.exports = function(url, callback) {
  var dates = {};
  async.waterfall([
    function(next) {
      cp.exec('git for-each-ref --format "%(refname:short) %09 %(taggerdate:short)" refs/tags', function(err, stdout) {
        if (err)
          return next(err);

        var list = [];
        String(stdout).split('\n').forEach(function(v) {
          var _v = v.split('\t');
          if (!_v || !_v[0]) {
            return;
          }
          var ver = _v[0].trim();
          list.push(ver);
          dates[ver] = _v[1].trim();
        });
        list.sort(semver.compare);

        var _list = _.clone(list);
        _list.shift();
        list.pop();

        next(null, _.zip(list, _list));
      });
    },
    function(pair, next) {
      function matcher(subject) {
        var match = subject.match(COMMIT_PATTERN);
        if (match && match[1] && match[4]) {
          return match;
        }
        var _s = subject.split(' ');
        if (_s[0] === 'Merge' && _s[1] === 'pull' && _s[2] === 'request') {
          return;
        }
        if (_s.length === 1 && semver.valid(_s[0])) {
          return;
        }

        var list = [
          subject,
          _s[0].replace(/\./g, '').toLowerCase(),
          null,
          null,
          subject
        ];
        list.index = 0;
        list.input = subject;
        return list;
      }

      var str = '';
      async.eachSeries(pair, function(p, done) {
        cchangelog({
          repository: url,
          version: p[1],
          file: '',
          from: p[0],
          to: p[1],
          grep: '',
          matcher: matcher,
          date: dates[p[1]]
        }, function(err, result) {
          if (err)
            return done(err);
          str = result + str;
          done();
        });
      }, function(err) {
        if (err)
          return next(err);

        next(null, str);
      });
    },
    function(contents, next) {
      fs.writeFile('CHANGELOG.md', contents, { encoding: 'utf8' }, next);
    },
  ], callback);
};
