[![Build Status](https://secure.travis-ci.org/markdalgleish/bespoke-vcr.png)](http://travis-ci.org/markdalgleish/bespoke-vcr)

# bespoke-vcr

### Recording and Playback for [Bespoke.js](https://github.com/markdalgleish/bespoke.js)

Record and replay Bespoke.js slide interactions from local storage and JSON data.

## Download

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/markdalgleish/bespoke-vcr/master/dist/bespoke-vcr.min.js
[max]: https://raw.github.com/markdalgleish/bespoke-vcr/master/dist/bespoke-vcr.js

### Bower

Bespoke-vcr can be installed from [Bower](http://twitter.github.com/bower/) using the following command:

```bash
$ bower install bespoke-vcr
```

## Basic Usage

First, include both `bespoke.js` and `bespoke-vcr.js` in your page.

Then, simply include the plugin when using the `from(selector[, plugins])` method.

```js
bespoke.horizontal.from(selector, {
  vcr: true
});
```

Press 'R' on your keyboard to toggle recording. Press 'S' to stop recording. Press 'P' to play the latest recording.

Recordings are saved to local storage and persist between page loads.

## Advanced Usage

### Generating JSON Recordings

Bespoke-vcr outputs to your JavaScript console during recording and playback.

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
bespoke.horizontal.from(selector, {
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
bespoke.horizontal.from(selector, {
  vcr: {
    remote: function(remote) {
      // Toggle recording:
      remote.record();

      // Stop recording
      remote.stop();
      
      // Toggle plaback
      remote.play();
    }
});
```

## Questions?

Contact me on GitHub or Twitter: [@markdalgleish](http://twitter.com/markdalgleish)

## License

Copyright 2013, Mark Dalgleish  
This content is released under the MIT license  
http://markdalgleish.mit-license.org