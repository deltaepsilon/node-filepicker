var chai = require('chai'),
  assert = chai.assert,
  Filepicker = require('./../lib/node-filepicker.js'),
  filepicker = new Filepicker(),
  fs = require('fs'),
  imageStream = fs.readFileSync(__dirname + '/mock/30.jpeg'),
  imageBuffer = new Buffer(imageStream, 'binary'),
  image = imageBuffer.toString('base64');

suite('Filepicker', function () {
  var imageBlob;
  test('Store should successfully store an image', function (done) {
    filepicker.store(image, 'fillmurray.jpeg', 'image/jpeg', {path: 'test/'}).then(function (res) {
      imageBlob = JSON.parse(res);
      assert.equal(imageBlob.size, 533, 'Correct image uploads');
      assert.equal(imageBlob.filename, 'fillmurray.jpeg', 'Correct image name');
      assert.equal(imageBlob.type, 'image/jpeg', 'Correct mimetype');
      done();
    });
  });

  test('Stat should return valid metadata', function (done) {
    filepicker.stat(imageBlob).then(function (response) {
      var metadata = JSON.parse(response);
      assert.equal(metadata.size, imageBlob.size, 'Correct image uploads');
      assert.equal(metadata.filename, imageBlob.filename, 'Correct image name');
      assert.equal(metadata.mimetype, imageBlob.type, 'Correct mimetype');
      assert.equal(metadata.url, imageBlob.url, 'Returns url with stat');
      done();
    })
  });

  test('Read should return image data', function (done) {
    filepicker.read(imageBlob).then(function (buffer) {
      var string = buffer.toString();
      assert.equal(string.length, 722, 'Returned base64 data should be close to 712, the value for image.length');
      done();
    })
  });

  test('Remove should delete file', function (done) {
    filepicker.remove(imageBlob).then(function (response) {
      assert.equal(response, 'success', 'Remove should return success');
      done();
    });
  });
});