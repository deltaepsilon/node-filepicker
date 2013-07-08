var request = require('superagent'),
  defer = require('node-promise').defer,
  qs = require('qs');

module.exports = function (apiKey, options) {
  var apiKey = apiKey || process.env.FILEPICKER_API_KEY,
    apiRoot = options && options.api ? options.api : 'https://www.filepicker.io/api',
    rootREGEX = /http/,
    augmentQuery = function (query) {
      if (!query) {
        query = {};
      }
      query.key = apiKey;
      query._cacheBust = Math.round(Math.random() * 100000);
      return qs.stringify(query);
    },
    augmentPath= function (path) {
      if (!path.match(rootREGEX)) {
        return apiRoot + path;
      }
      return path;
    },
    verbs = {
      get: function (path, query) {
        return request.get(augmentPath(path) + "?" + augmentQuery(query));
      },
      post: function (path, query) {
        return request.post(augmentPath(path) + "?" + augmentQuery(query)).set('Content-Type', 'application/json');
      }
    },
    callback = function (localDeferred, localCallback) {
      return function (response) {
        var err = response.error,
          res = response;
        if (err) {
          localDeferred.reject(err);
        } else {
          localDeferred.resolve(res.text || res.data || res);
        }
        if (typeof localCallback === 'function') {
          localCallback(err, res);
        }
      }
    };

  if (!apiKey) {
    throw new Error('Filepicker API key is missing. Either add it during construction... new Filepicker("MYAPIKEY", options)... or have it available as an environment variable at FILEPICKER_API_KEY');
  }

  return {
    read: function (inkBlob, query, cb) {
      if (typeof query === 'function') {
        query = undefined;
        cb = query;
      }

      var deferred = defer(),
        done = callback(deferred, cb);

      if (!inkBlob || !inkBlob.url) {
        done('inkBlob.url missing');
      } else {
        if (!query) {
          query = {base64encode: true}; // Default query to base64encode
        }
        verbs.get(inkBlob.url, query)
          .set('X-NO-STREAM', true)
          .set('connection', 'keep-alive')
          .set('Accept-Encoding', 'gzip,deflate,sdch')
          .set('Accept', 'text/javascript, text/html, application/xml, text/xml, */*')
          .parse(function (res, callback) {
            res.text = '';
            res.on('data', function (data) {
              res.text += data;
            });
            res.on('end', function () {
              done(new Buffer(res.text));
            });
          })
          .end(function (err, res) {
            //Don't do jack... the callback is handled in the parse
        });

      }
      return deferred.promise;

    },
    stat: function (inkBlob, cb) {
      var deferred = defer(),
        done = callback(deferred, cb);

      if (!inkBlob || !inkBlob.url) {
        done('inkBlob.url missing');
      } else {
        verbs.get(inkBlob.url + '/metadata').end(function (err, res) {
          var metadata = JSON.parse(res.text);
          metadata.url = inkBlob.url;

          if (typeof cb === 'function') {
            done(err, metadata);
          } else if (err) {
            done({error: err});
          } else {
            done(JSON.stringify(metadata));
          }

        });
      }
      return deferred.promise;

    },
    write: function () {

    },
    store: function (payload, filename, mimetype, query, cb) {
      var deferred = defer(),
        done = callback(deferred, cb);
      if (!payload) {
        done('payload missing');
      } else if (!filename) {
        done('filename missing');
      } else if (!mimetype) {
        done('mimetype missing');
      } else {
        if (!query) {
          query = {};
        }
        query.mimetype = mimetype;
        query.filename = filename;
        query.base64decode = true;
        verbs.post('/store/S3', query).send(payload).end(done);
      }

      return deferred.promise;

    },
    remove: function (inkBlob, cb) {
      var deferred = defer(),
        done = callback(deferred, cb);

      if (!inkBlob || !inkBlob.url) {
        done('inkBlob.url missing');
      } else {
        verbs.post(inkBlob.url + '/remove').send({key: apiKey}).end(done);
      }
      return deferred.promise;

    }
  };
};