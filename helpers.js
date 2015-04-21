
module.exports.register = function (Handlebars, options)  {
  Handlebars.registerHelper('version', function (str)  {
    try {
      return options.data.package.version;
    } catch (err) {
      return str;
    }
  });
};
