node-filepicker
=========

Filepicker.io library for node.js

###Filepicker Docs
 I literally fired off method calls from filepicker.js in Chrome dev tools, checked my network tab, and copied what I saw in node. Just check the [Filepicker Docs] for details on query params and what you can get out of their API.



###Promises
node-filepicker methods return promises. They also execute any callbacks that you pass in. So you could get fancy and use both the callbacks and the promises, but that would be ridiculous.

###Install
```
npm install node-filepicker
```

###Test
```shell
npm install grunt-cli -g #Install grunt to run tests
cd myproject/node_modules/node-filepicker
npm install #Get dev dependencies
grunt test #Run tests
```

###Instantiate
```var Filepicker = require('node-filepicker'),
    filepicker = new Filepicker('API_KEY');```

You can also instantiate with your API key as an environment variable named ```FILEPICKER_API_KEY```
so... ```var filepicker = new Filepicker();```

##Methods

###filepicker.read
```javascript
filepicker.read(inkBlob, query, [callback]).then(function(buffer) {
    var string = buffer.toString(); // It's a buffer. Make it a string.
    console.log('Check out my base64-encoded image...', string);
});
```

###filepicker.stat
```javascript
filepicker.stat(inkBlob, [callback]).then(function(metadata) {
    var metadata = JSON.parse(metadata);
    console.log("It's metadata snitches", metadata);
});
```

###filepicker.store
```javascript
filepicker.store(payload, filename, mimetype, query, [callback]).then(function(inkBlob) {
    var inkBlob = JSON.parse(inkBlob);
    console.log("It's an inkBlob", inkBlob);
});
```

###filepicker.remove
```javascript
filepicker.remove(inkBlob, [callback]).then(function(success) {
    console.log("Success?", success); // Logs "success"
});
```

###filepicker.write - NOT IMPLEMENTED
I might get to this, but the filepicker.js client works well enough that this sucker is very low priority... for now.
[Filepicker Docs]: https://developers.inkfilepicker.com/docs/web/#javascript
