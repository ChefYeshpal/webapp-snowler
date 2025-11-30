// Progressive typewriter controller for the opening scene plus any follow-up branches

(function () {
	const storyText = document.getElementById('story-text');
	if (!storyText) {
		return;
	}

	const body = document.body;
	const titleShell = document.querySelector('.title-shell');
	const titleElement = document.querySelector('.story-title');
	const subtitleElement = document.querySelector('.story-subtitle');
	const snowAPI = window.snowAPI;
	const DEFAULT_SNOW_INTENSITY = 1;
	const DEFAULT_SNOW_WIND = 0;
	const INTRO_STORM_INTENSITY = 4.6;
	const INTRO_STORM_WIND = 0.14;
	let introWeatherActive = false;

	const applyIntroWeather = () => {
		// just for ze intro zcreen
		if (!snowAPI || introWeatherActive) {
			return;
		}
		if (typeof snowAPI.setIntensity === 'function') {
			snowAPI.setIntensity(INTRO_STORM_INTENSITY);
		}
		if (typeof snowAPI.setWind === 'function') {
			snowAPI.setWind(INTRO_STORM_WIND);
		}
		introWeatherActive = true;
	};

	const restoreDefaultWeather = () => {
		if (!snowAPI || !introWeatherActive) {
			return;
		}
		if (typeof snowAPI.setIntensity === 'function') {
			snowAPI.setIntensity(DEFAULT_SNOW_INTENSITY);
		}
		if (typeof snowAPI.setWind === 'function') {
			snowAPI.setWind(DEFAULT_SNOW_WIND);
		}
		introWeatherActive = false;
	};

	class StoryTyper {
		constructor(container, options = {}) {
			this.container = container;
			this.typingSpeed = options.typingSpeed ?? 48;
			this.wordPause = options.wordPause ?? 160;
			this.linePause = options.linePause ?? 950;
			this.baseTypingSpeed = this.typingSpeed;
			this.baseWordPause = this.wordPause;
			this.baseLinePause = this.linePause;
			this.fastMode = false;
			this.autoStart = options.autoStart ?? true;

			this.lineQueue = [];
			this.currentLine = null;
			this.wordIndex = 0;
			this.charIndex = 0;
			this.activeParagraph = null;
			this.activeWordBlock = null;
			this.totalLines = 0;
			this.isTyping = false;

			this.pendingTimeout = null;
			this.caret = document.createElement('span');
			this.caret.className = 'caret';
		}

		scheduleNext(delay) {
			if (this.pendingTimeout) {
				window.clearTimeout(this.pendingTimeout);
			}
			this.pendingTimeout = window.setTimeout(() => {
				this.pendingTimeout = null;
				this.typeNext();
			}, delay);
		}

		nudge() {
			if (this.pendingTimeout) {
				window.clearTimeout(this.pendingTimeout);
				this.pendingTimeout = null;
			}
			if (this.isTyping || this.currentLine || this.lineQueue.length) {
				this.typeNext();
			}
		}

		enqueueLines(lines) {
			const normalised = (lines || [])
				.map((entry) => {
					if (typeof entry === 'string') {
						return { text: entry, className: '', html: false };
					}
					if (entry && typeof entry.text === 'string') {
						return {
							text: entry.text,
							className: entry.className ?? '',
							html: Boolean(entry.html || entry.isHtml),
						};
					}
					return null;
				})
				.filter(Boolean)
				.map((entry) => {
					const trimmed = entry.text.trim();
					return {
						text: trimmed,
						words: entry.html ? null : trimmed.split(/\s+/),
						className: entry.className ?? '',
						html: entry.html,
					};
				})
				.filter((entry) => entry.text.length > 0);

			if (!normalised.length) {
				return;
			}

			this.lineQueue.push(...normalised);

			if (this.isTyping) {
				this.ensureCaret();
				return;
			}

			if (this.autoStart) {
				this.isTyping = true;
				this.ensureCaret();
				this.scheduleNext(0);
			}
		}

		start() {
			if (this.isTyping || this.currentLine || this.lineQueue.length === 0) {
				return;
			}

			this.isTyping = true;
			this.ensureCaret();
			this.typeNext();
		}

		ensureCaret() {
			if (!this.caret.isConnected) {
				this.container.appendChild(this.caret);
			}
		}

		setFastMode(active) {
			const desired = Boolean(active);
			if (desired === this.fastMode) {
				return;
			}
			this.fastMode = desired;
			this.typingSpeed = desired ? 0 : this.baseTypingSpeed;
			this.wordPause = desired ? 0 : this.baseWordPause;
			this.linePause = desired ? 0 : this.baseLinePause;
		}

		typeNext() {
			if (!this.currentLine) {
				this.currentLine = this.lineQueue.shift() || null;

				if (!this.currentLine) {
					this.isTyping = false;
					if (this.caret.isConnected) {
						this.caret.remove();
					}
					document.dispatchEvent(new CustomEvent('story:sequence-complete'));
					document.dispatchEvent(new CustomEvent('story:auto-scroll'));
					return;
				}

				this.wordIndex = 0;
				this.charIndex = 0;
				this.activeParagraph = document.createElement('p');
				if (this.currentLine.className) {
					this.activeParagraph.className = this.currentLine.className;
				}
				this.activeParagraph.dataset.line = String(this.totalLines);
				this.totalLines += 1;
				this.container.insertBefore(this.activeParagraph, this.caret);
				this.activeWordBlock = null;
			}

			if (this.currentLine.html) {
				this.activeParagraph.innerHTML = this.currentLine.text;
				const completedHtmlLine = this.currentLine;
				this.currentLine = null;
				this.activeParagraph = null;
				this.activeWordBlock = null;
				this.scheduleNext(this.linePause);
				document.dispatchEvent(new CustomEvent('story:auto-scroll'));
				document.dispatchEvent(
					new CustomEvent('story:line-complete', {
						detail: { text: completedHtmlLine.text, className: completedHtmlLine.className ?? '' },
					})
				);
				return;
			}

			const lineWords = this.currentLine.words;

			if (this.wordIndex >= lineWords.length) {
				const completedLine = this.currentLine;
				this.currentLine = null;
				this.activeParagraph = null;
				this.activeWordBlock = null;
				this.scheduleNext(this.linePause);
				document.dispatchEvent(
					new CustomEvent('story:line-complete', {
						detail: { text: completedLine.text, className: completedLine.className ?? '' },
					})
				);
				return;
			}

			const currentWord = lineWords[this.wordIndex];

			if (!this.activeWordBlock) {
				this.activeWordBlock = document.createElement('span');
				this.activeWordBlock.className = 'type-block';
				this.activeParagraph.appendChild(this.activeWordBlock);
			}

			if (this.charIndex < currentWord.length) {
				const partialWord = currentWord.slice(0, this.charIndex + 1);
				this.activeWordBlock.textContent = `[${partialWord}]`;
				this.charIndex += 1;
				this.scheduleNext(this.typingSpeed);
				return;
			}

			const finalWord = document.createElement('span');
			finalWord.textContent = currentWord;
			this.activeParagraph.replaceChild(finalWord, this.activeWordBlock);
			this.activeWordBlock = null;
			this.charIndex = 0;
			this.wordIndex += 1;

			if (this.wordIndex < lineWords.length) {
				this.activeParagraph.appendChild(document.createTextNode(' '));
				this.scheduleNext(this.wordPause);
				return;
			}

			this.scheduleNext(this.linePause);
			document.dispatchEvent(new CustomEvent('story:auto-scroll'));
		}
	}

	const rawLines = Array.isArray(window.dialogueLines) ? window.dialogueLines : [];
	const storyTyper = new StoryTyper(storyText, {
		typingSpeed: 48,
		wordPause: 160,
		linePause: 950,
		autoStart: false,
	});

	window.storyTyper = storyTyper;

	const choicePanel = document.getElementById('choice-panel');
	let skipActive = false;

	// can you PLEASE work 
	// I mean, it's not that hard man seriously... you just have to break your back or something?
	const INTRO_TRANSITION_MS = 720;
	const useIntroScreen = Boolean(body && titleShell && titleElement);
	let introActive = false;
	let introComplete = false;
	let introKeydownHandler = null;
	let introPointerHandler = null;
	let introResizeHandler = null;
	let introLoadHandler = null;

	const applyIntroMetrics = () => {
		if (!useIntroScreen || !body) {
			return;
		}

		const hadPrestart = body.classList.contains('prestart');
		const hadPrestartExit = body.classList.contains('prestart-exit');
		if (hadPrestartExit) {
			body.classList.remove('prestart-exit');
		}
		if (hadPrestart) {
			body.classList.remove('prestart');
		}
		body.classList.remove('prestart-ready');

		const titleRect = titleElement.getBoundingClientRect();
		const widthScale = titleRect.width ? (window.innerWidth / titleRect.width) * 0.8 : 1.75;
		const heightScale = titleRect.height ? (window.innerHeight / titleRect.height) * 0.6 : 1.75;
		const computedScale = Math.max(1.6, Math.min(widthScale, heightScale, 5));
		titleElement.style.setProperty('--title-scale', computedScale.toFixed(3));

		// RAHHH automatic measuring so that heading is ALWAYS centered RAHHH
		body.classList.add('prestart');
		body.classList.remove('prestart-exit');
		titleShell.style.setProperty('--title-shift-x', '0px');
		titleShell.style.setProperty('--title-shift-y', '0px');
		const centeredRect = titleShell.getBoundingClientRect();
		const centeredShiftX = window.innerWidth / 2 - (centeredRect.left + centeredRect.width / 2);
		const centeredShiftY = window.innerHeight / 2 - (centeredRect.top + centeredRect.height / 2);
		titleShell.style.setProperty('--title-shift-x', `${centeredShiftX}px`);
		titleShell.style.setProperty('--title-shift-y', `${centeredShiftY}px`);

		if (!hadPrestart) {
			body.classList.remove('prestart');
		}
		if (hadPrestartExit && hadPrestart) {
			body.classList.add('prestart-exit');
		}
		if (hadPrestart) {
			window.requestAnimationFrame(() => {
				if (body && body.classList.contains('prestart')) {
					body.classList.add('prestart-ready');
				}
			});
		}
	};

	const tearDownIntroListeners = () => {
		if (introKeydownHandler) {
			document.removeEventListener('keydown', introKeydownHandler, true);
			introKeydownHandler = null;
		}
		if (introPointerHandler) {
			document.removeEventListener('pointerdown', introPointerHandler, true);
			introPointerHandler = null;
		}
		if (introResizeHandler) {
			window.removeEventListener('resize', introResizeHandler);
			window.removeEventListener('orientationchange', introResizeHandler);
			introResizeHandler = null;
		}
		if (introLoadHandler) {
			window.removeEventListener('load', introLoadHandler);
			introLoadHandler = null;
		}
	};

	const beginStoryFromIntro = () => {
		if (introComplete) {
			return;
		}

		introComplete = true;
		introActive = false;
		tearDownIntroListeners();
		restoreDefaultWeather();

		const prefersReducedMotion =
			typeof window.matchMedia === 'function' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		const finalizeStart = () => {
			if (subtitleElement && subtitleElement.isConnected) {
				subtitleElement.textContent = "Press 's' to speed up";
			}
			if (body) {
				body.classList.remove('game-starting');
				body.classList.remove('prestart');
				body.classList.remove('prestart-ready');
				body.classList.remove('prestart-exit');
				body.classList.add('game-started');
			}
			storyTyper.start();
		};

		if (subtitleElement) {
			subtitleElement.setAttribute('aria-hidden', 'false');
		}

		if (body) {
			body.classList.add('game-starting');
		}

		if (prefersReducedMotion) {
			finalizeStart();
			return;
		}

		if (body) {
			window.requestAnimationFrame(() => {
				body.classList.add('prestart-exit');
			});
		}

		window.setTimeout(finalizeStart, INTRO_TRANSITION_MS);
	};

	const initialiseIntroScreen = () => {
		if (!useIntroScreen || !body) {
			return false;
		}

		introActive = true;
		applyIntroWeather();
		if (subtitleElement) {
			subtitleElement.setAttribute('aria-hidden', 'false');
		}
		applyIntroMetrics();

		body.classList.add('prestart');
		window.requestAnimationFrame(() => {
			if (body && body.classList.contains('prestart')) {
				body.classList.add('prestart-ready');
			}
		});

		introKeydownHandler = (event) => {
			if (!body || !body.classList.contains('prestart')) {
				tearDownIntroListeners();
				return;
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			beginStoryFromIntro();
		};

		introPointerHandler = (event) => {
			if (!body || !body.classList.contains('prestart')) {
				tearDownIntroListeners();
				return;
			}
			event.preventDefault();
			event.stopImmediatePropagation();
			beginStoryFromIntro();
		};

		introResizeHandler = () => {
			if (!introActive || introComplete) {
				tearDownIntroListeners();
				return;
			}
			applyIntroMetrics();
		};

		introLoadHandler = () => {
			if (introActive && !introComplete) {
				applyIntroMetrics();
			}
		};

		/** For future me
		 * Please if you wanna spend some more time in this
		 * make it so that it ignores the keypresses of 'ctrl' or something
		 */
		document.addEventListener('keydown', introKeydownHandler, true);
		document.addEventListener('pointerdown', introPointerHandler, true);
		window.addEventListener('resize', introResizeHandler);
		window.addEventListener('orientationchange', introResizeHandler);
		window.addEventListener('load', introLoadHandler);

		if (
			document.fonts &&
			document.fonts.ready &&
			typeof document.fonts.ready.then === 'function'
		) {
			document.fonts.ready
				.then(() => {
					if (introActive && !introComplete) {
						applyIntroMetrics();
					}
				})
				.catch(() => {
					// Imgnore font loading errors for this sizing pass
				});
		}

		return true;
	};

	const stopSkipIfNeeded = () => {
		if (!skipActive) {
			return;
		}
		skipActive = false;
		storyTyper.setFastMode(false);
	};

	const startSkip = () => {
		if (skipActive) {
			return;
		}
		if (choicePanel && choicePanel.classList.contains('choice-panel--visible')) {
			return;
		}
		if (!storyTyper.isTyping && !storyTyper.currentLine && storyTyper.lineQueue.length === 0) {
			return;
		}
		skipActive = true;
		storyTyper.setFastMode(true);
		// ensure we keep the typing loop moving immediately
		storyTyper.nudge();
	};

	document.addEventListener('keydown', (event) => {
		if (body && (body.classList.contains('prestart') || body.classList.contains('game-starting'))) {
			return;
		}
		if (event.key !== 's' && event.key !== 'S') {
			return;
		}
		startSkip();
		event.preventDefault();
	});

	document.addEventListener('story:choice-presented', stopSkipIfNeeded);
	document.addEventListener('story:sequence-complete', stopSkipIfNeeded);

	if (rawLines.length) {
		storyTyper.enqueueLines(rawLines);
	}

	const introInitialised = initialiseIntroScreen();

	if (!introInitialised && rawLines.length) {
		storyTyper.start();
	}
})();
