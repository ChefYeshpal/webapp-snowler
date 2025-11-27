// Handles branching option selection once prompt lines appear

(function () {
	const storyTyper = window.storyTyper;
	const panel = document.getElementById('choice-panel');

	if (!storyTyper || !panel) {
		return;
	}

	const gatherWoodFollowUp = [
		'Chosen: gather wood',
		'You decide to sweep the tree line for anything that will burn.',
		'Moving around trying to conserve your body heat, while gathering any dry sticks you can.',
		'There\'s a lighter in your pocket...',
		'Will you take it out to start a fire?'
	];

	const choiceCatalog = {
		trail: {
			id: 'trail',
			label: 'Walk on the trail',
			followUp: [
				'Chosen: walk on the trail',
				'You crunch along the trail, every step punching through a crust of glittering ice.',
				'Looking around, you notice that the forest is eerily quiet save for distant groans of bending trunks.',
				'You keep walking, keeping an ear out for any sound you can hear.',
				'The sun is half-way up now, a pale smear behind bruised clouds.',
				'Do you still not want to build a fire?'
			],
		},
		'gather-wood': {
			id: 'gather-wood',
			label: 'Gather wood',
			followUp: gatherWoodFollowUp,
		},
		'collect-more-wood': {
			id: 'collect-more-wood',
			label: 'Collect more wood',
			followUp: gatherWoodFollowUp,
		},
		'keep-walking': {
			id: 'keep-walking',
			label: 'Keep walking',
			followUp: [
				'Chosen: keep walking',
				'You lower your head and push onward, the trail a thread of frost threading between pines.',
				'Wind gnaws at your exposed cheeks, stealing warmth in greedy bites.',
				'Your breath hangs in the darkening pines like smoke from a dying candle.',
				'Night chews away the remaining light. Do you keep moving or double back for warmth?'
			],
		},
		'keep-walking-final': {
			id: 'keep-walking-final',
			label: 'Keep moving',
			followUp: [
				'Chosen: keep moving',
				'You lean into the gale, marching until your legs feel hollow and brittle.',
				'Needles of ice chew through your trousers, skin burning before it fades to nothing.',
				'Vision tunnels; the drift ahead looks like a soft bed inviting you to rest.',
				'You sink down, promising yourself only a minute.',
				'Choice: keep walking',
				'The cold steals your pulse. Hypothermia writes your final lullaby beneath the silent pines.'
			],
			// terminal branch: hypothermia causes final death
			terminal: true,
			terminalReason: 'hypothermia'
		},
		'return-for-wood': {
			id: 'return-for-wood',
			label: 'Double back for warmth',
			followUp: [
				'Chosen: double back for warmth',
				'You pivot, stumbling through your own half-erased footprints.',
				'Each step stings new life into your legs as you chase the promise of flame.',
				'You find the cluster of sticks you abandoned, rimed with frost and waiting.',
				'Will you take it out to start a fire?'
			],
		},
		'start-fire': {
			id: 'start-fire',
			label: 'Get a fire going',
			followUp: [
				'Chosen: start a fire',
				'You get on your knees, stacking the sticks with trembling precision.',
				'Your fingers snap the lighter; sparks leap until a reluctant ember blooms.',
				'Orange light stains the snow, smoke curling like a signal toward the bruise-colored sky.',
				'Heat crawls back into your bones, painful and glorious.',
				'The fire steadies. Stay put or make a plan?'
			],
		},
		'stay-with-fire': {
			id: 'stay-with-fire',
			label: 'Stay with the fire',
			followUp: [
				'Chosen: stay with the fire',
				'You hunch close, feeding the blaze careful breaths of bark and twig.',
				'Sparks drift upward like tiny prayers and, after hours of shivering patience, the forest finally answers.',
				'Choice: wait for help',
				'A rescue chopper ghosts overhead, spotting your frantic waving.',
				'You survive the night, teeth rattling but alive.'
			],
		},
		'scout-with-torch': {
			id: 'scout-with-torch',
			label: 'Scout with a torch',
			followUp: [
				'Chosen: scout with a torch',
				'You snap a burning branch free and stalk into the trees, the flame painting skeletal trunks gold.',
				'The wind smears smoke across your face while shadows jump like startled animals.',
				'You stumble upon a gutted ranger station, its doorway yawning dark but promising shelter.',
				'Inside, a dusty cot and a wheezing radio wait for patient hands.',
				'Choice: firebrand march',
				'You thaw out beneath a real roof as static slowly shapes into a human voice. Dawn feels possible again.'
			],
		},
		'find-shelter': {
			id: 'find-shelter',
			label: 'Search for shelter',
			followUp: [
				'Chosen: search for shelter',
				'You decide to leave the trail and venture deeper into the forest.',
				'The trees grow denser, their skeletal branches clawing at the sky.',
				'You stumble upon a rocky overhang that offers some protection from the wind.',
				'Inside, you find traces of an old campfire. Will you try to rekindle it or keep searching?'
			],
		},
		'keep-searching': {
			id: 'keep-searching',
			label: 'Keep searching',
			followUp: [
				'Chosen: keep searching',
				'You push further into the forest, the cold biting deeper with every step.',
				'The sound of running water catches your attention, leading you to a frozen stream.',
				'Nearby, you spot a small cave entrance partially hidden by snow.',
				'Do you enter the cave or follow the stream?'
			],
		},
		'enter-cave': {
			id: 'enter-cave',
			label: 'Enter the cave',
			followUp: [
				'Chosen: enter the cave',
				'The cave is dark and damp, but it shields you from the wind.',
				'You light a small fire, the flickering flames casting eerie shadows on the walls.',
				'As you settle in, you hear a faint growl from deeper within the cave.',
				'Do you investigate the sound or barricade the entrance?'
			],
		},
		'investigate-sound': {
			id: 'investigate-sound',
			label: 'Investigate the sound',
			followUp: [
				'Chosen: investigate the sound',
				'You cautiously move deeper into the cave, the growl growing louder.',
				'Your torchlight reveals a wounded wolf, its eyes glinting with fear and pain.',
				'Do you help the wolf or retreat to the entrance?'
			],
		},
		'help-wolf': {
			id: 'help-wolf',
			label: 'Help the wolf',
			followUp: [
				'Chosen: help the wolf',
				'You approach slowly, offering soothing words as you tend to its wound.',
				'The wolf watches you warily but doesn’t resist.',
				'As dawn breaks, the wolf limps away, leaving you with a sense of quiet accomplishment.',
				'You step out of the cave, ready to face the day.'
			],
		},
		'barricade-entrance': {
			id: 'barricade-entrance',
			label: 'Barricade the entrance',
			followUp: [
				'Chosen: barricade the entrance',
				'You pile rocks and branches at the cave entrance, sealing yourself inside.',
				'The growling fades as you huddle by the fire, waiting for dawn.',
				'The smoke thickens, your coughs stacking faster than your breaths.',
				'You lie close to the coals, eyes watering until the dark outweighs the orange.'
			],
			terminal: true,
			terminalReason: 'smoke_inhalation'
		},
		'follow-stream': {
			id: 'follow-stream',
			label: 'Follow the stream',
			followUp: [
				'Chosen: follow the stream',
				'The frozen stream glitters like a silver ribbon, leading you through the forest.',
				'You find a small, abandoned cabin with a broken window and a sagging roof.',
				'Inside, there’s a rusted stove and a pile of moth-eaten blankets.',
				'Do you try to repair the cabin or move on?'
			],
		},
		'slip-on-ice': {
			id: 'slip-on-ice',
			label: 'Hurry along the ice',
			followUp: [
				'Chosen: hurry along the ice',
				'You quicken your pace on the glassy stream-bed, breath sharp and eager.',
				'A soundless misstep, then the world tilts—your leg buckles with a brittle crack.',
				'Cold patience settles in while the sky turns indifferent.'
			],
			terminal: true,
			terminalReason: 'injury'
		},
		'linger-too-long': {
			id: 'linger-too-long',
			label: 'Ignore food and rest',
			followUp: [
				'Chosen: ignore food and rest',
				'You ration nothing and push through the ache, promising a later reward.',
				'The promise runs out before the day does; your steps blur, thoughts thin.',
				'You sit down “just a minute.” The forest agrees.'
			],
			terminal: true,
			terminalReason: 'starvation'
		},
	};

	const promptChoiceMap = {
		'What will you do?': ['trail', 'gather-wood', 'find-shelter'],
		'Do you still not want to build a fire?': ['gather-wood', 'keep-walking'],
		'Will you take it out to start a fire?': ['collect-more-wood', 'start-fire'],
		'Night chews away the remaining light. Do you keep moving or double back for warmth?': ['keep-walking-final', 'return-for-wood'],
		'The fire steadies. Stay put or make a plan?': ['stay-with-fire', 'scout-with-torch'],
		'Will you try to rekindle it or keep searching?': ['start-fire', 'keep-searching'],
		'Do you enter the cave or follow the stream?': ['enter-cave', 'follow-stream'],
		'Do you investigate the sound or barricade the entrance?': ['investigate-sound', 'barricade-entrance'],
		'Do you help the wolf or retreat to the entrance?': ['help-wolf', 'return-for-wood'],
		'Do you try to repair the cabin or move on?': ['stay-with-fire', 'keep-walking'],
		'The frozen stream looks fast and safe. Hurry or take care?': ['slip-on-ice', 'trail'],
		'Food can wait, right? Rest or push on?': ['linger-too-long', 'keep-walking'],
	};

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

	const elevateOption = (index) => {
		const buttons = getButtons();
		buttons.forEach((button, buttonIndex) => {
			button.classList.toggle('elevated', buttonIndex === index);
		});
	};

	const disappearOption = (index) => {
		const buttons = getButtons();
		const targetButton = buttons[index];
		if (targetButton) {
			targetButton.classList.add('disappear');
			setTimeout(() => {
				targetButton.remove();
			}, 300); 
		}
	};

	const chooseOption = (index) => {
		const choice = currentChoices[index];
		if (!choice) {
			return;
		}

		// record choice in global tracker (if available)
		if (window.choiceTracker && typeof window.choiceTracker.record === 'function') {
			window.choiceTracker.record(choice.id);
		}

		disappearOption(index);
		hidePanel();
		storyTyper.enqueueLines(choice.followUp);

	
		if (choice.terminal) {
			if (window.gameOverManager && typeof window.gameOverManager.prepareEnd === 'function') {
				window.gameOverManager.prepareEnd(choice.terminalReason || null);
			}
		}
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
				elevateOption(index);
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

		document.dispatchEvent(
			new CustomEvent('story:choice-presented', {
				detail: {
					choices: choices.map((choice) => choice.id),
				},
			})
		);
	};

	document.addEventListener('story:line-complete', (event) => {
		const rawText = event?.detail?.text ?? '';
		const matchingText = rawText.trim();
		const choiceIds = promptChoiceMap[matchingText];

		if (!choiceIds) {
			return;
		}

		const choices = choiceIds
			.map((choiceId) => choiceCatalog[choiceId])
			.filter(Boolean);

		if (choices.length > 0) {
			showChoices(choices);
		}
	});
})();
