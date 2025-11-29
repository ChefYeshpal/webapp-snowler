(() => {
	const BASE_EMBER_COUNT = 60;
	let targetEmberCount = 0;
	let isActive = false;
	
	const layer = document.createElement('div');
	layer.className = 'ember-layer';
	layer.setAttribute('aria-hidden', 'true');
	document.body.appendChild(layer);

	const randomBetween = (min, max) => Math.random() * (max - min) + min;
	const embers = [];
	let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
	let viewportHeight = window.innerHeight || document.documentElement.clientHeight;

	const createEmber = () => {
		const size = randomBetween(2, 5);
		const ember = document.createElement('div');
		ember.className = 'ember';
		ember.style.width = `${size}px`;
		ember.style.height = `${size}px`;
		
		const hue = randomBetween(10, 40); // who would have thought that 10 - 40 is orange/red range...
		const lightness = randomBetween(50, 80);
		ember.style.backgroundColor = `hsl(${hue}, 100%, ${lightness}%)`;
		
		layer.appendChild(ember);
		return {
			element: ember,
			x: randomBetween(0, viewportWidth),
			y: viewportHeight + 10, 
			speed: randomBetween(2, 5),
			swayAmplitude: randomBetween(5, 15),
			swayFrequency: randomBetween(0.002, 0.005),
			swayOffset: Math.random() * Math.PI * 2,
			opacity: 1
		};
	};

	const resetEmber = (ember) => {
		ember.x = randomBetween(0, viewportWidth);
		ember.y = viewportHeight + 10;
		ember.speed = randomBetween(2, 5);
		ember.opacity = 1;
		ember.element.style.opacity = 1;
	};

	const ensureEmbers = () => {
		while (embers.length < targetEmberCount) {
			embers.push(createEmber());
		}
	};

	let lastTime = performance.now();

	const animate = (time) => {
		const delta = time - lastTime;
		lastTime = time;

		if (isActive) {
			ensureEmbers();
		}

		for (let i = embers.length - 1; i >= 0; i--) {
			const ember = embers[i];
			ember.y -= ember.speed * (delta / 16);
			const sway = Math.sin(time * ember.swayFrequency + ember.swayOffset) * ember.swayAmplitude;
			const x = ember.x + sway;
			
			const progress = 1 - (ember.y / viewportHeight);
			ember.opacity = Math.max(0, 1 - progress * 1.5);
			ember.element.style.opacity = ember.opacity;

			ember.element.style.transform = `translate3d(${x}px, ${ember.y}px, 0)`;

			if (ember.y < -10 || ember.opacity <= 0) {
				if (isActive) {
					resetEmber(ember);
				} else {
					ember.element.remove();
					embers.splice(i, 1);
				}
			}
		}

		requestAnimationFrame(animate);
	};

	window.addEventListener('resize', () => {
		viewportWidth = window.innerWidth || document.documentElement.clientWidth;
		viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	});

	requestAnimationFrame(animate);

	const startEmbers = () => {
		isActive = true;
		targetEmberCount = BASE_EMBER_COUNT;
		ensureEmbers();
	};

	const stopEmbers = () => {
		isActive = false;
	};

	window.emberAPI = {
		startEmbers,
		stopEmbers
	};
})();

// ello mr snowman :D