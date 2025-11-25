(() => {
	const SNOWFLAKE_COUNT = 120;
	const layer = document.createElement('div');
	layer.className = 'snow-layer';
	layer.setAttribute('aria-hidden', 'true');
	document.body.prepend(layer);

	const randomBetween = (min, max) => Math.random() * (max - min) + min;
	const flakes = [];
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

	const ensureFlakes = () => {
		while (flakes.length < SNOWFLAKE_COUNT) {
			flakes.push(createFlake());
		}
	};

	const resetFlake = (flake, initialPlacement = false) => {
		flake.baseX = randomBetween(-viewportWidth * 0.1, viewportWidth * 1.1);
		flake.y = initialPlacement ? randomBetween(-viewportHeight, viewportHeight) : randomBetween(-viewportHeight, 0);
		flake.speed = randomBetween(0.035, 0.09);
		flake.amplitude = randomBetween(12, 28);
		flake.driftFrequency = randomBetween(0.00075, 0.0018);
		flake.driftOffset = Math.random() * Math.PI * 2;
	};

	const initialiseField = () => {
		ensureFlakes();
		flakes.forEach((flake) => resetFlake(flake, true));
	};

	let lastTime = performance.now();

	const animate = (time) => {
		const delta = time - lastTime;
		lastTime = time;

		flakes.forEach((flake) => {
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
})();
