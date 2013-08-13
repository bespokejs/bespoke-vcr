/*!
 * bespoke-vcr v0.0.1-alpha-3
 *
 * Copyright 2013, Mark Dalgleish
 * This content is released under the MIT license
 * http://mit-license.org/markdalgleish
 */

(function(bespoke) {

	var plugin = function(deck, options) {
			options.reporter = options.reporter || 'console';

			var recordings = getRecordings() || [],
				frames = options.recording || getLatestRecording(),
				report = typeof options.reporter === 'string' ? plugin.reporters[options.reporter] : options.reporter,
				recordStartTime,
				isRecording = false,
				isPlaying = false,

				status = (function() {
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
				}()),

				record = function() {
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
				},

				play = function() {
					isRecording && stop();

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
				},

				stop = function() {
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

					isRecording && frames.push(frame) && save(recordings);
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
		},

		getRecordings = function() {
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

	plugin.reporters = {
		console: function(title, data) {
			console.log(
				'BESPOKE-VCR: ' + title + '\n' +
				(data ? JSON.stringify(data, null, 2) + '\n' : '')
			);
		}
	};

	bespoke.plugins.vcr = plugin;

	window.vcr = {
		latest: function() {
			plugin.reporters.console('Latest recording:', getLatestRecording());
		},
		all: function() {
			plugin.reporters.console('All recordings:', getRecordings());
		},
		clear: clear
	};

}(bespoke));