module.exports = function(errors) {
    var len = errors.length,
      filename;

    if (len) {
      filename = errors[0].file;
      process.stdout.write(filename + '\n -- ' + len + ' hardcoded string(s)\n');
    }
};