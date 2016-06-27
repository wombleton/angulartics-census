var walk = require('walk');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var csv = require('csv-stringify');
var root = argv.p || 'src';

fs.readdir(root, function (err, files) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  var results = [];

  var walker = walk.walk(path.join(__dirname, root));

  walker.on('file', function (root, fileStats, next) {
    var file = fileStats.name;
    fs.readFile(path.join(root, file), 'utf8', function (err, content) {
      if (err) {
        console.log('Couldn\'t read %s because of %s', file, err);
        return next(err);
      } else if (path.extname(file) !== '.html') {
        return next();
      }

      var $ = cheerio.load(content);

      $('[analytics-on]').each(function (i, el) {
        var $this = $(this);

        var result = [
          $this.attr('analytics-category'),
          $this.attr('analytics-event'),
          el.tagName,
          fileStats.name
        ];

        if (argv.attrcheck) {
          result.push($this.is(argv.attrcheck) ? 'Y' : 'N');
        }

        results.push(result);
      });
      next();
    });
  });

  walker.on('error', function (root, nodeStatsArray, next) {
    console.log(nodeStatsArray);
    next();
  });

  walker.on('end', function () {
    csv(results, function (err, output) {
      if (err) {
        return console.log(err);
      }
      console.log(output);
    });
  });
});
