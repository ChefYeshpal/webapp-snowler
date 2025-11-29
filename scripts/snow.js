(() => {
	const BASE_SNOWFLAKE_COUNT = 120;
	let targetFlakeCount = BASE_SNOWFLAKE_COUNT;
	let intensityMultiplier = 1;
	let windVelocity = 0;
	const layer = document.createElement('div');
	layer.className = 'snow-layer';
	layer.setAttribute('aria-hidden', 'true');
	document.body.prepend(layer);

	// accumulation drift element (hidden until triggered)
	const drift = document.createElement('div');
	drift.className = 'snow-drift';
	drift.setAttribute('aria-hidden', 'true');
	document.body.appendChild(drift);
	const driftLabel = document.createElement('div');
	driftLabel.className = 'snow-drift__label';
	drift.appendChild(driftLabel);

	const randomBetween = (min, max) => Math.random() * (max - min) + min;
	const flakes = [];
	let accumulationActive = false;
	let accumulationProgress = 0;
	let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
	let viewportHeight = window.innerHeight || document.documentElement.clientHeight;

	const createFlake = () => {
		const size = randomBetween(1.5, 3.5);
		const flake = document.createElement('div');
		flake.className = 'snowflake';
		flake.style.width = `${size}px`;
		flake.style.height = `${size}px`;
		layer.appendChild(flake);
		return {
			element: flake,
			size,
			baseX: 0,
			y: 0,
			speed: 0,
			amplitude: 0,
			driftFrequency: 0,
			driftOffset: 0
		};
	};

	const resetFlake = (flake, initialPlacement = false) => {
		flake.baseX = randomBetween(-viewportWidth * 0.1, viewportWidth * 1.1);
		flake.y = initialPlacement ? randomBetween(-viewportHeight, viewportHeight) : randomBetween(-viewportHeight, 0);
		const speedBoost = 0.6 + intensityMultiplier * 0.55;
		const swayBoost = 0.6 + intensityMultiplier * 0.4;
		flake.speed = randomBetween(0.035, 0.09) * speedBoost;
		flake.amplitude = randomBetween(12, 28) * swayBoost;
		flake.driftFrequency = randomBetween(0.00075, 0.0018);
		flake.driftOffset = Math.random() * Math.PI * 2;
	};

	const ensureFlakes = () => {
		while (flakes.length < targetFlakeCount) {
			const flake = createFlake();
			flakes.push(flake);
			resetFlake(flake, true);
		}
	};

	const trimFlakes = () => {
		while (flakes.length > targetFlakeCount) {
			const flake = flakes.pop();
			flake.element.remove();
		}
	};

	const initialiseField = () => {
		ensureFlakes();
		flakes.forEach((flake) => resetFlake(flake, true));
	};

	let lastTime = performance.now();

	const animate = (time) => {
		const delta = time - lastTime;
		lastTime = time;
		ensureFlakes();
		const opacityFactor = Math.min(1, intensityMultiplier / 4);
		layer.style.opacity = `${0.35 + opacityFactor * 0.65}`;

		// gradually nudge opacity for a slightly more visible storm when many flakes exist
		flakes.forEach((flake) => {
			flake.baseX += windVelocity * delta;
			flake.y += flake.speed * delta;
			const sway = Math.sin(time * flake.driftFrequency + flake.driftOffset) * flake.amplitude;
			const x = flake.baseX + sway;
			flake.element.style.transform = `translate3d(${x}px, ${flake.y}px, 0)`;

			if (flake.y > viewportHeight + 16 || x < -viewportWidth * 0.2 || x > viewportWidth * 1.2) {
				resetFlake(flake);
			}
		});

		requestAnimationFrame(animate);
	};

	window.addEventListener('resize', () => {
		const previousWidth = viewportWidth;
		viewportWidth = window.innerWidth || document.documentElement.clientWidth;
		viewportHeight = window.innerHeight || document.documentElement.clientHeight;
		flakes.forEach((flake) => {
			const ratio = previousWidth ? flake.baseX / previousWidth : Math.random();
			flake.baseX = ratio * viewportWidth;
			if (flake.y > viewportHeight) {
				resetFlake(flake);
			}
		});
	});

	initialiseField();
	requestAnimationFrame(animate);

	// public API for other scripts to call
	const setIntensity = (multiplier) => {
		multiplier = Math.max(0.25, Number(multiplier) || 1);
		intensityMultiplier = multiplier;
		targetFlakeCount = Math.round(BASE_SNOWFLAKE_COUNT * multiplier);
		ensureFlakes();
		trimFlakes();
	};

	const setWind = (velocity) => {
		const numericVelocity = Number(velocity) || 0;
		windVelocity = Math.max(-0.35, Math.min(0.35, numericVelocity));
	};

	const startAccumulation = () => {
		if (accumulationActive) {
			return;
		}
		accumulationActive = true;
		setIntensity(Math.max(intensityMultiplier, 7));
		const duration = 28000;
		const depthMax = 140; // cm equivalent for display
		const startTime = performance.now();
		const step = (now) => {
			const progress = Math.min(1, (now - startTime) / duration);
			accumulationProgress = progress;
			drift.style.height = `${progress * 100}%`;
			const depth = Math.round(progress * depthMax);
			driftLabel.textContent = `Snow depth: ${depth}cm`;
			driftLabel.style.opacity = Math.min(1, progress * 1.2);
			if (progress < 1) {
				requestAnimationFrame(step);
			}
		};
		requestAnimationFrame(step);
	};

	window.snowAPI = {
		setIntensity,
		setWind,
		startAccumulation,
	};
})();
