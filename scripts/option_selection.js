// Handles branching option selection once prompt lines appear.

(function () {
	const storyTyper = window.storyTyper;
	const panel = document.getElementById('choice-panel');

	if (!storyTyper || !panel) {
		return;
	}

	const baseChoices = [
		{
			id: 'trail',
			label: 'Walk on the trail',
			followUp: [
				'chosen: walk on the trail',
				'You walk on the trail, the snow crunches against your boots.',
				'Looking around, you notice that the forest is eerily quiet...'
			],
		},
		{
			id: 'gather-wood',
			label: 'Gather wood',
			followUp: [
				'Chosen: Gather wood',
				'You decide to gather any flammable material you can find.',
				'Moving around trying to conserve your body heat, while gathering any dry sticks you can.',
                'You notice there \'s a lighter in your bocket...'
			],
		},
	];

	let choicesHaveDisplayed = false;
	let currentChoices = [];
	let highlightedIndex = -1;
	let hideTimer = null;

	const getButtons = () => Array.from(panel.querySelectorAll('.choice-option'));

	const clearHideTimer = () => {
		if (hideTimer) {
			window.clearTimeout(hideTimer);
			hideTimer = null;
		}
	};

	const highlightOption = (index) => {
		const buttons = getButtons();
		buttons.forEach((button, buttonIndex) => {
			button.classList.toggle('choice-option--active', buttonIndex === index);
		});
		highlightedIndex = index;

		const targetButton = buttons[index];
		if (targetButton) {
			targetButton.focus({ preventScroll: true });
		}
	};

	const hidePanel = () => {
		clearHideTimer();
		panel.classList.remove('choice-panel--visible');
		hideTimer = window.setTimeout(() => {
			panel.innerHTML = '';
			panel.hidden = true;
		}, 220);
		document.removeEventListener('keydown', handleKeyDown, true);
		highlightedIndex = -1;
		currentChoices = [];
	};

	const chooseOption = (index) => {
		const choice = currentChoices[index];
		if (!choice) {
			return;
		}

		hidePanel();
		storyTyper.enqueueLines(choice.followUp);
	};

	const handleKeyDown = (event) => {
		if (currentChoices.length === 0) {
			return;
		}

		const { key } = event;

		if (/^[1-9]$/.test(key)) {
			const index = Number.parseInt(key, 10) - 1;
			if (index >= 0 && index < currentChoices.length) {
				highlightOption(index);
				event.preventDefault();
			}
			return;
		}

		if (key === 'Enter' && highlightedIndex >= 0) {
			event.preventDefault();
			chooseOption(highlightedIndex);
		}
	};

	const showChoices = (choices) => {
		clearHideTimer();
		panel.innerHTML = '';

		choices.forEach((choice, index) => {
			const button = document.createElement('button');
			button.type = 'button';
			button.className = 'choice-option';
			button.dataset.index = String(index);
			button.dataset.choiceId = choice.id;
			button.textContent = `${index + 1}. ${choice.label}`;
			button.addEventListener('click', () => chooseOption(index));
			panel.appendChild(button);
		});

		panel.hidden = false;
		// delay for allowin the browser to register the panel visibility toggle before animating
		requestAnimationFrame(() => {
			panel.classList.add('choice-panel--visible');
		});

		currentChoices = choices.slice();
		highlightedIndex = -1;
		document.addEventListener('keydown', handleKeyDown, true);
	};

	document.addEventListener('story:line-complete', (event) => {
		const rawText = event?.detail?.text ?? '';
		const matchingText = rawText.trim();

		if (!choicesHaveDisplayed && matchingText === 'What will you do?') {
			choicesHaveDisplayed = true;
			showChoices(baseChoices);
		}
	});
})();
