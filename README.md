[![Build Status](https://secure.travis-ci.org/markdalgleish/bespoke-vcr.png?branch=master)](https://travis-ci.org/markdalgleish/bespoke-vcr) [![Coverage Status](https://coveralls.io/repos/markdalgleish/bespoke-vcr/badge.png)](https://coveralls.io/r/markdalgleish/bespoke-vcr)

# bespoke-vcr

Recording and Playback for [Bespoke.js](https://github.com/markdalgleish/bespoke.js)

Record and replay Bespoke.js slide interactions from local storage and JSON data.

## Download

Download the [production version][min] or the [development version][max], or use a [package manager](#package-managers).

[min]: https://raw.github.com/markdalgleish/bespoke-vcr/master/dist/bespoke-vcr.min.js
[max]: https://raw.github.com/markdalgleish/bespoke-vcr/master/dist/bespoke-vcr.js

## Usage

This plugin is shipped in a [UMD format](https://github.com/umdjs/umd), meaning that it is available as a CommonJS/AMD module or browser global.

For example, when using CommonJS modules:

```js
var bespoke = require('bespoke'),
  vcr = require('bespoke-vcr');

bespoke.from('article', [
  vcr()
]);
```

When using browser globals:

```js
bespoke.from('article', [
  bespoke.plugins.vcr()
]);
```

Press 'R' on your keyboard to toggle recording. Press 'S' to stop recording. Press 'P' to play the latest recording.

Recordings are saved to local storage and persist between page loads.

### Generating JSON Recordings

Notifications are displayed in your JavaScript console during recording and playback.

To see JSON representations of recordings, run one of the following commands in your console:

```js
// Latest recording:
vcr.latest();

// All recordings:
vcr.all();
```

### Loading JSON Recordings

Recordings can be provided on load via the 'recording' option:

```js
bespoke.from(selector, {
  vcr: {
    recording: [
      {
        "command": "next",
        "timeout": 10000
      },
      {
        "command": "next",
        "timeout": 20000
      },
      {
        "command": "next",
        "timeout": 30000
      },
      {
        "timeout": 40000
      }
    ]
  }
});
```

Press 'P' to start the saved recording.

### Custom Remotes

The default remote uses the 'R', 'P' and 'S' keys.

To override this behavious, pass a 'remote' function via the options object:

```js
bespoke.from(selector, {
  vcr: {
    remote: function(remote) {
      // Toggle recording:
      remote.record();

      // Stop recording
      remote.stop();

      // Toggle plaback
      remote.play();
    }
  }
});
```

## Package managers

### npm

```bash
$ npm install bespoke-vcr
```

### Bower

```bash
$ bower install bespoke-vcr
```

## Credits

This plugin was built with [generator-bespokeplugin](https://github.com/markdalgleish/generator-bespokeplugin).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)
