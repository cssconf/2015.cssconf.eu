
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
};
