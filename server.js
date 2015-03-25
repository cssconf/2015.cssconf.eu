import fs from 'fs'
import url from 'url'
import path from 'path'
import express from 'express'

const PORT = process.env.PORT || 5020;


import browserify from 'browserify';
import watchify from 'watchify';

let jsPromises = {
  promises: {},
  get: function(path) {
    path = `./app${path}`;
    if (!this.promises[path]) {
      let b = browserify({
        cache: {},
        packageCache: {},
        fullPaths: true,
        debug: true
      });
      let w = watchify(b);
      w.transform('babelify');
      w.add(path);
      w.on('log', console.log.bind(console));
      let bundle = () => {
        console.log(`compile ${path}`);
        return new Promise((resolve,reject) => {
          w.bundle((err, buffer) => {
            console.log(`${path} done! ${err ? 'error' : 'no error'}`);
            if (err) {
              console.log(err);
              reject(err);
            }
            else resolve(buffer);
          });
        });
      };
      w.on('update', () => {
        this.promises[path] = bundle();
      })
      this.promises[path] = bundle();
    }
    return this.promises[path];
  }
};

import less from 'less';

import LessPluginAutoPrefix from 'less-plugin-autoprefix'

let lessOptions = {
  plugins: [
    new LessPluginAutoPrefix({ browsers: ['last 2 versions'] })
  ],
  sourceMap: {
    outputSourceFiles: true,
    sourceMapFileInline: true,
    sourceMapFullFilename: true
  }
};

let cssPromises = {
  promises: {},
  get: function(path) {
    path = `./app${path.replace(/\.css$/, '.less')}`;

    return new Promise((resolve, reject) => {
      lessOptions.filename = path;
      // load file
      fs.readFile(path, (fsErr, buffer) => {
        if (fsErr) return reject(fsErr);
        less.render(buffer.toString(), lessOptions, (lessErr, lessOut) => {
          if (lessErr) reject(lessErr);
          else resolve(lessOut.css);
        });
      });
    });
  }
};


let app = express();

// javascript compiler
app.use((req, res, next) => {
  let pathName = url.parse(req.url).pathname;
  if (pathName.endsWith('.js')) {
    jsPromises
      .get(pathName)
      .then((buffer) => {
        res.writeHead(200, { 'content-type': 'application/javascript' });
        res.write(buffer);
        res.end();
      })
      .catch((e) => {
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.write(e.toString());
        res.end();
      });
    return;
  }
  next();
});

// less compiler + autoprefixer
app.use((req, res, next) => {
  let pathName = url.parse(req.url).pathname;
  if (pathName.endsWith('.css')) {
    cssPromises
      .get(pathName)
      .then((buffer) => {
        res.writeHead(200, { 'content-type': 'text/css' });
        res.write(buffer);
        res.end();
      })
      .catch((e) => {
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.write(e.toString());
        res.end();
      });
    return;
  }
  next();
});

app.use(function(req, res, next) {
  if (req.url == '/' || req.url.startsWith('/index.html')) {
    fs.readFile('./app/static/index.html', (err, buffer) => {
      if (err) throw err;
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write(buffer);
      res.write(`<script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js"></' + 'script>')</script>`);
      res.end();
    });
  } else {
    next();
  }
});

app.use(express.static('./app/static'));

app.listen(PORT, () => console.log(`listening on port ${PORT}`));

// lifereload server
import livereload from 'livereload'
let lrServer = livereload.createServer({
  exts: [ 'less' ],
  alias: {
    less: 'css'
  }
})
lrServer.watch(path.join(__dirname, 'app', 'styles'));
