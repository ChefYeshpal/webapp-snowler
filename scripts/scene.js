// Progressive typewriter sequence for the opening scene, word by word.

const rawLines = Array.isArray(window.dialogueLines) ? window.dialogueLines : [];
const storyLines = rawLines.map((line) => line.trim()).filter((line) => line.length > 0);
const tokenisedLines = storyLines.map((line) => line.split(/\s+/));

const typingSpeed = 48;
const wordPause = 160;
const linePause = 950; 

const storyText = document.getElementById('story-text');

if (storyText && tokenisedLines.length) {
	const caret = document.createElement('span');
	caret.className = 'caret';
	storyText.appendChild(caret);

	let lineIndex = 0;
	let wordIndex = 0;
	let charIndex = 0;
	let activeParagraph = null;
	let activeWordBlock = null;

	const typeNext = () => {
		if (lineIndex >= tokenisedLines.length) {
			caret.remove();
			return;
		}

		if (!activeParagraph) {
			activeParagraph = document.createElement('p');
			activeParagraph.dataset.line = String(lineIndex);
			storyText.insertBefore(activeParagraph, caret);
		}

		const lineWords = tokenisedLines[lineIndex];

		if (wordIndex >= lineWords.length) {
			lineIndex += 1;
			wordIndex = 0;
			charIndex = 0;
			activeParagraph = null;
			activeWordBlock = null;
			window.setTimeout(typeNext, linePause);
			return;
		}

		const currentWord = lineWords[wordIndex];

		if (!activeWordBlock) {
			activeWordBlock = document.createElement('span');
			activeWordBlock.className = 'type-block';
			activeParagraph.appendChild(activeWordBlock);
		}

		if (charIndex < currentWord.length) {
			const partialWord = currentWord.slice(0, charIndex + 1);
			activeWordBlock.textContent = `[${partialWord}]`;
			charIndex += 1;
			window.setTimeout(typeNext, typingSpeed);
			return;
		}

		const finalWord = document.createElement('span');
		finalWord.textContent = currentWord;
		activeParagraph.replaceChild(finalWord, activeWordBlock);
		activeWordBlock = null;
		charIndex = 0;
		wordIndex += 1;

		if (wordIndex < lineWords.length) {
			activeParagraph.appendChild(document.createTextNode(' '));
			window.setTimeout(typeNext, wordPause);
			return;
		}

		window.setTimeout(typeNext, linePause);
	};

	typeNext();
}
