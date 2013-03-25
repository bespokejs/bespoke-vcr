(function() {
	"use strict";

	describe("bespoke-vcr", function() {

		var PARENT_TAG = 'article',
			SLIDE_TAG = 'section',
			NO_OF_SLIDES = 10,
			article,
			slides,
			deck,

			clock,
			record,
			play,
			stop,
			reporter,
			expectedTimeline,

			nextHandler,
			prevHandler,
			slideHandler;

		var createDeck = function(options) {
				slides = [];

				article = document.createElement(PARENT_TAG);
				for (var i = 0; i < NO_OF_SLIDES; i++) {
					slides.push(document.createElement(SLIDE_TAG));
					article.appendChild(slides[i]);
				}

				document.body.appendChild(article);

				deck = bespoke.from(PARENT_TAG, {
					vcr: options || true
				});
			},
			destroyDeck = function() {
				document.body.removeChild(article);
			};

		afterEach(destroyDeck);

		beforeEach(function() {
			clock = sinon.useFakeTimers();
			reporter = bespoke.plugins.vcr.reporters.console = sinon.spy();
			console.log = sinon.spy();
		});

		afterEach(function() {
			clock.restore();
			window.vcr.clear();
		});

		describe("given a custom remote and default reporter", function() {

			beforeEach(function() {
				createDeck({
					remote: function(remote) {
						record = remote.record;
						play = remote.play;
						stop = remote.stop;
					}
				});
			});

			describe("when recording", function() {

				beforeEach(function() {
					record();
				});

				afterEach(function() {
					stop();
				});

				it("should report that recording has started", function() {
					sinon.assert.calledWith(reporter, 'Recording to local storage...');
				});

				describe("when user goes forward 3 times, 1 second apart", function() {
					beforeEach(function() {
						expectedTimeline = [
							{
								command: 'next',
								timeout: 1000
							},
							{
								command: 'next',
								timeout: 2000
							},
							{
								command: 'next',
								timeout: 3000
							},
							{
								timeout: 4000
							}
						];

						for (var i = 0; i < 3; i++) {
							clock.tick(1000);
							deck.next();
						}

						clock.tick(1000);
						stop();
					});

					it("should log the timeline to the console", function() {
						sinon.assert.calledWith(reporter, 'Successfully recorded the following to local storage:', expectedTimeline);
					});

					describe("when the latest recording is requested", function() {
						
						beforeEach(window.vcr.latest);

						it("should log the latest timeline to the console", function() {
							sinon.assert.calledWith(reporter, 'Latest recording:', expectedTimeline);
						});
						
					});

				});

				describe("when user goes forward and backwards twice, 2 seconds apart", function() {
					beforeEach(function() {
						expectedTimeline = [
							{
								command: 'next',
								timeout: 2000
							},
							{
								command: 'prev',
								timeout: 4000
							},
							{
								command: 'next',
								timeout: 6000
							},
							{
								command: 'prev',
								timeout: 8000
							},
							{
								timeout: 10000
							}
						];

						for (var i = 0; i < 4; i++) {
							clock.tick(2000);
							i % 2 === 0 ? deck.next() : deck.prev();
						}

						clock.tick(2000);
						stop();
					});

					it("should log the timeline to the console", function() {
						sinon.assert.calledWith(reporter, 'Successfully recorded the following to local storage:', expectedTimeline);
					});

				});

				describe("when user goes specifically to slide 2, 3 and 4, 500ms apart", function() {
					beforeEach(function() {
						expectedTimeline = [
							{
								command: 'slide',
								arguments: [2],
								timeout: 500
							},
							{
								command: 'slide',
								arguments: [3],
								timeout: 1000
							},
							{
								command: 'slide',
								arguments: [4],
								timeout: 1500
							},
							{
								timeout: 2000
							}
						];

						for (var i = 0; i < 3; i++) {
							clock.tick(500);
							deck.slide(i + 2);
						}

						clock.tick(500);
						stop();
					});

					it("should log the timeline to the console", function() {
						sinon.assert.calledWith(reporter, 'Successfully recorded the following to local storage:', expectedTimeline);
					});

				});

			});

		});

		describe("given a deck with a custom remote and a pre-recorded timeline", function() {

			beforeEach(function() {
				createDeck({
					remote: function(remote) {
						record = remote.record;
						play = remote.play;
						stop = remote.stop;
					},
					recording: [
						{
							command: 'next',
							timeout: 1000
						},
						{
							command: 'prev',
							timeout: 2000
						},
						{
							command: 'slide',
							arguments: [1],
							timeout: 3000
						},
						{
							timeout: 4000
						}
					]
				});

				nextHandler = sinon.spy();
				prevHandler = sinon.spy();
				slideHandler = sinon.spy();

				deck.on('next', nextHandler);
				deck.on('prev', prevHandler);
				deck.on('slide', slideHandler);

				play();
			});

			afterEach(function() {
				deck.off('next', nextHandler);
				deck.off('prev', prevHandler);
				deck.off('slide', slideHandler);

				stop();
			});

			it("should immediately activate the first slide", function() {
				sinon.assert.calledWith(slideHandler, {
					index: 0,
					slide: slides[0]
				});
			});

			describe("when one second passes", function() {

				beforeEach(function() {
					clock.tick(1000);
				});

				it("should go to the next slide", function() {
					sinon.assert.calledOnce(nextHandler);

					sinon.assert.notCalled(prevHandler);
					sinon.assert.calledOnce(slideHandler);
				});

				describe("when another second passes", function() {

					beforeEach(function() {
						clock.tick(1000);
					});

					it("should go to the prev slide", function() {
						sinon.assert.calledOnce(prevHandler);

						sinon.assert.calledOnce(nextHandler);
						sinon.assert.calledOnce(slideHandler);
					});

					describe("when another second passes", function() {

						beforeEach(function() {
							clock.tick(1000);
						});

						it("should go to the second slide", function() {
							sinon.assert.calledTwice(slideHandler);
							sinon.assert.calledWith(slideHandler, {
								index: 1,
								slide: slides[1]
							});

							sinon.assert.calledOnce(nextHandler);
							sinon.assert.calledOnce(prevHandler);
						});

						describe("when another second passes", function() {

							beforeEach(function() {
								clock.tick(1000);
							});

							it("should report that playback is complete", function() {
								sinon.assert.calledWith(reporter, 'Playback complete');
							});

						});

					});

				});

			});

		});

	});

}());