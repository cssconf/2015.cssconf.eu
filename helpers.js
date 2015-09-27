var qs = require('querystring');
var format = require('util').format;
var chunk = require('lodash.chunk');

module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('version', function (str)  {
    try {
      return options.data.package.version;
    } catch (err) {
      return str;
    }
  });

  Handlebars.registerHelper('makeParagraphs', function (s) {
    return new Handlebars.SafeString(
        '<p>' + s.split('\n\n').join('</p><p>') + '</p>');
  });

  /**
   * Partition a context into multiple contexts.
   * Each context is available under the key 'partition'.
   */
  Handlebars.registerHelper('partition', function (data, n, options) {
    var partitions = chunk(Object.keys(data), n);
    return partitions.reduce(function (result, keys) {
      result += options.fn({partition: keys.reduce(function (ctx, key) {
        ctx[key] = data[key];
        return ctx;
      }, {})});
      return result;
    }, '');
  });

  Handlebars.registerHelper('youtubeLink', function (id, playlistId) {
    var query = {
      v: id
    };
    if (playlistId)
      query.list = playlistId;
    return format('https://youtube.com/watch?%s', qs.stringify(query))
  });
};
