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

			this.lineQueue = [];
			this.currentLine = null;
			this.wordIndex = 0;
			this.charIndex = 0;
			this.activeParagraph = null;
			this.activeWordBlock = null;
			this.totalLines = 0;
			this.isTyping = false;

			this.caret = document.createElement('span');
			this.caret.className = 'caret';
		}

		enqueueLines(lines) {
			const normalised = (lines || [])
				.filter((line) => typeof line === 'string')
				.map((line) => line.trim())
				.filter((line) => line.length > 0)
				.map((text) => ({
					text,
					words: text.split(/\s+/),
				}));

			if (!normalised.length) {
				return;
			}

			this.lineQueue.push(...normalised);
			this.ensureCaret();

			if (!this.isTyping) {
				this.isTyping = true;
				window.setTimeout(() => this.typeNext(), 0);
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

		typeNext() {
			if (!this.currentLine) {
				this.currentLine = this.lineQueue.shift() || null;

				if (!this.currentLine) {
					this.isTyping = false;
					if (this.caret.isConnected) {
						this.caret.remove();
					}
					return;
				}

				this.wordIndex = 0;
				this.charIndex = 0;
				this.activeParagraph = document.createElement('p');
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
				window.setTimeout(() => this.typeNext(), this.linePause);
				document.dispatchEvent(
					new CustomEvent('story:line-complete', {
						detail: { text: completedLine.text },
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
				window.setTimeout(() => this.typeNext(), this.typingSpeed);
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
				window.setTimeout(() => this.typeNext(), this.wordPause);
				return;
			}

			window.setTimeout(() => this.typeNext(), this.linePause);
		}
	}

	const rawLines = Array.isArray(window.dialogueLines) ? window.dialogueLines : [];
	const storyTyper = new StoryTyper(storyText, {
		typingSpeed: 48,
		wordPause: 160,
		linePause: 950,
	});

	window.storyTyper = storyTyper;

	if (rawLines.length) {
		storyTyper.enqueueLines(rawLines);
	}
})();
