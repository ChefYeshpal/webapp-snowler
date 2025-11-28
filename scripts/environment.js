// day, evening, night, and autoscroll 
(function () {
	const { body } = document;
	if (!body) {
		return;
	}

	const NIGHT_CLASS = 'mode-night';
	const EVENING_CLASS = 'mode-evening';
	const DAY_TERMS = ['dawn', 'morning', 'sunrise', 'daybreak', 'daylight', 'sun is', 'sun climbs'];
	const storyContainer = document.getElementById('story-text');
	const scrollRoot = document.scrollingElement || document.documentElement || document.body;
	let pendingScroll = null;

	const starLayer = document.createElement('div');
	starLayer.className = 'night-stars';
	const snowLayer = document.querySelector('.snow-layer');
	if (snowLayer && snowLayer.parentNode) {
		snowLayer.parentNode.insertBefore(starLayer, snowLayer);
	} else {
		body.prepend(starLayer);
	}

	const clearModes = () => {
		body.classList.remove(EVENING_CLASS, NIGHT_CLASS);
	};

	const applyEvening = () => {
		body.classList.add(EVENING_CLASS);
		body.classList.remove(NIGHT_CLASS);
	};

	const applyNight = () => {
		body.classList.add(NIGHT_CLASS);
		body.classList.remove(EVENING_CLASS);
	};

	clearModes();

	document.addEventListener('story:line-complete', (event) => {
		const text = String(event?.detail?.text || '').toLowerCase();
		if (!text) {
			return;
		}

		if (DAY_TERMS.some((term) => text.includes(term))) {
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
