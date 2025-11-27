// Progressive typewriter controller for the opening scene plus any follow-up branches

(function () {
	const storyText = document.getElementById('story-text');
	if (!storyText) {
		return;
	}

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
						return { text: entry };
					}
					if (entry && typeof entry.text === 'string') {
						return { text: entry.text, className: entry.className ?? '' };
					}
					return null;
				})
				.filter(Boolean)
				.map((entry) => {
					const trimmed = entry.text.trim();
					return {
						text: trimmed,
						words: trimmed.split(/\s+/),
						className: entry.className ?? '',
					};
				})
				.filter((entry) => entry.text.length > 0);

			if (!normalised.length) {
				return;
			}

			this.lineQueue.push(...normalised);
			this.ensureCaret();

			if (!this.isTyping) {
				this.isTyping = true;
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
					// notify that the current typing session / queued sequence finished
					document.dispatchEvent(new CustomEvent('story:sequence-complete'));
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
		}
	}

	const rawLines = Array.isArray(window.dialogueLines) ? window.dialogueLines : [];
	const storyTyper = new StoryTyper(storyText, {
		typingSpeed: 48,
		wordPause: 160,
		linePause: 950,
	});

	window.storyTyper = storyTyper;

	const choicePanel = document.getElementById('choice-panel');
	let skipActive = false;

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
})();
