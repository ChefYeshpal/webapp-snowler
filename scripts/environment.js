// day, evening, night, and autoscroll 
(function () {
	const { body } = document;
	if (!body) {
		return;
	}

	const NIGHT_CLASS = 'mode-night';
	const EVENING_CLASS = 'mode-evening';
	const CAVE_CLASS = 'mode-cave';
	const DAY_TERMS = ['dawn', 'morning', 'sunrise', 'daybreak', 'daylight', 'sun is', 'sun climbs'];
	const storyContainer = document.getElementById('story-text');
	const scrollRoot = document.scrollingElement || document.documentElement || document.body;
	let pendingScroll = null;
	let caveActive = false;

	const starLayer = document.createElement('div');
	starLayer.className = 'night-stars';
	const snowLayer = document.querySelector('.snow-layer');
	if (snowLayer && snowLayer.parentNode) {
		snowLayer.parentNode.insertBefore(starLayer, snowLayer);
	} else {
		body.prepend(starLayer);
	}

	const clearModes = () => {
		body.classList.remove(EVENING_CLASS, NIGHT_CLASS, CAVE_CLASS);
		caveActive = false;
	};

	const removeCave = () => {
		if (!caveActive) {
			return;
		}
		caveActive = false;
		body.classList.remove(CAVE_CLASS);
	};

	const applyEvening = () => {
		removeCave();
		body.classList.add(EVENING_CLASS);
		body.classList.remove(NIGHT_CLASS);
	};

	const applyNight = () => {
		removeCave();
		body.classList.add(NIGHT_CLASS);
		body.classList.remove(EVENING_CLASS);
	};

	const applyCave = () => {
		body.classList.add(CAVE_CLASS);
		body.classList.remove(EVENING_CLASS, NIGHT_CLASS);
		caveActive = true;
	};

	clearModes();

	document.addEventListener('story:line-complete', (event) => {
		const text = String(event?.detail?.text || '').toLowerCase();
		if (!text) {
			return;
		}

		if (text.includes('chosen: enter the cave')) {
			applyCave();
			return;
		}

		if (caveActive && (
			text.includes('burst into the ranger station') ||
			text.includes('slam the shelf back in place')
		)) {
			removeCave();
		}

		if (text.includes('chosen: enter the cave') || text.includes('chosen: explore tunnel')) {
			applyCave();
			return;
		}

		if (DAY_TERMS.some((term) => text.includes(term))) {
			if (caveActive) {
				return;
			}
			clearModes();
		}

		if (text.includes('night')) {
			applyNight();
			return;
		}

		if (text.includes('evening')) {
			applyEvening();
		}
	});
    // Auto scrolll cause ofc im too lazy to use my mouse lol
	document.addEventListener('story:auto-scroll', () => {
		if (!storyContainer || !scrollRoot) {
			return;
		}
		if (pendingScroll) {
			window.cancelAnimationFrame(pendingScroll);
		}
		pendingScroll = window.requestAnimationFrame(() => {
			pendingScroll = null;
			const currentTop = scrollRoot.scrollTop || window.pageYOffset || 0;
			const storyRect = storyContainer.getBoundingClientRect();
			const containerTop = storyRect.top + currentTop;
			const contentBottom = containerTop + storyContainer.scrollHeight;
			const padding = 160;
			const finalTop = Math.max(contentBottom - window.innerHeight + padding, 0);
			const distance = Math.abs(finalTop - currentTop);
			const behavior = distance > 120 ? 'smooth' : 'auto';
			if (distance > 4) {
				window.scrollTo({ top: finalTop, behavior });
			}
		});
	});
})();
