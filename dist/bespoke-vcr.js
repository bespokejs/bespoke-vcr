/*!
 * bespoke-vcr v0.1.0-beta
 *
 * Copyright 2014, Mark Dalgleish
 * This content is released under the MIT license
 * http://mit-license.org/markdalgleish
 */

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n;"undefined"!=typeof window?n=window:"undefined"!=typeof global?n=global:"undefined"!=typeof self&&(n=self);var o=n;o=o.bespoke||(o.bespoke={}),o=o.plugins||(o.plugins={}),o.vcr=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var getRecordings = function() {
    var recordings = localStorage['bespoke-vcr'];
    return recordings ? JSON.parse(recordings) : [];
  },

  getLatestRecording = function() {
    var recordings = getRecordings();
    return recordings.length ? recordings[recordings.length - 1] : undefined;
  },

  save = function(recordings) {
    localStorage['bespoke-vcr'] = JSON.stringify(recordings);
  },

  clear = function() {
    delete localStorage['bespoke-vcr'];
  };

var vcr = function(options) {
  return function(deck) {
    options = options || {};
    options.reporter = options.reporter || 'console';

    var recordings = getRecordings() || [],
      frames = options.recording || getLatestRecording(),
      report = typeof options.reporter === 'string' ? vcr.reporters[options.reporter] : options.reporter,
      recordStartTime,
      isRecording = false,
      isPlaying = false;

    var status = (function() {
      var indicator = document.createElement('div'),
        size = '8px';

      indicator.style.width = size;
      indicator.style.height = size;
      indicator.style.borderRadius = size;
      indicator.style.position = 'absolute';
      indicator.style.left = '4px';
      indicator.style.bottom = '4px';
      indicator.style.backgroundColor = 'transparent';
      document.body.appendChild(indicator);

      return {
        red: function() {
          indicator.style.backgroundColor = 'red';
        },
        green: function() {
          indicator.style.backgroundColor = 'green';
        },
        clear: function() {
          indicator.style.backgroundColor = 'transparent';
        }
      };
    }());

    var record = function() {
      if (isRecording) {
        return stop();
      }

      deck.slide(0);

      isRecording = true;
      isPlaying = false;
      status.red();

      report('Recording to local storage...');
      recordStartTime = new Date().getTime();

      frames = [];
      recordings.push(frames);
    };

    var play = function() {
      if (isRecording) {
        stop();
      }

      if (frames.length === 0) {
        return;
      }

      isPlaying = true;
      status.green();

      report('Playing the following recording:', frames);

      deck.slide(0);
      frames.forEach(function(frame) {
        setTimeout(function() {
          if (frame.command) {
            deck[frame.command].apply(null, frame.arguments || []);
          } else {
            report('Playback complete');
            isPlaying = false;
            status.clear();
          }
        }, frame.timeout);
      });
    };

    var stop = function() {
      if (isRecording) {
        frames.push({
          timeout: new Date().getTime() - recordStartTime
        });
        save(recordings);
        report('Successfully recorded the following to local storage:', frames);
      }

      isRecording = false;
      isPlaying = false;
      status.clear();
    };

    ['next', 'prev', 'slide'].forEach(function(command) {
      deck.on(command, function(e) {
        var frame = {
          command: command,
          timeout: new Date().getTime() - recordStartTime
        };

        if (command === 'slide') {
          frame.arguments = [e.index];
        }

        if (isRecording) {
          frames.push(frame);
          save(recordings);
        }
      });
    });

    var setupRemote = options.remote || function(remote) {
        window.addEventListener('keydown', function(e) {
          var P = 80,
            R = 82,
            S = 83;

          switch (e.which) {
            case R:
              remote.record();
              break;
            case S:
              remote.stop();
              break;
            case P:
              remote.play();
              break;
          }
        });
      },

      controls = {
        record: record,
        play: play,
        stop: stop
      };

    setupRemote(controls);
  };
};

vcr.reporters = {
  console: function(title, data) {
    console.log(
      'BESPOKE-VCR: ' + title + '\n' +
      (data ? JSON.stringify(data, null, 2) + '\n' : '')
    );
  }
};

vcr.latest = function() {
  vcr.reporters.console('Latest recording:', getLatestRecording());
};

vcr.all = function() {
  vcr.reporters.console('All recordings:', getRecordings());
};

vcr.clear = clear;

module.exports = vcr;

},{}]},{},[1])
(1)
});