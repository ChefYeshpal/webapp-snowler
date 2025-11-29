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
				'Evening smolders through the clouds, painting the snow in bruised amber.',
				'Do you keep moving or double back for warmth?'
			],
		},
		'keep-walking-final': {
			id: 'keep-walking-final',
			label: 'Keep moving',
			followUp: [
				'Chosen: keep moving',
				'Night chews away the remaining light.',
				'You lean into the gale, marching until your legs feel hollow and brittle.',
				'Needles of ice chew through your trousers, skin burning before it fades to nothing.',
				'Vision tunnels; the drift ahead looks like a soft bed inviting you to rest.',
				'You sink down, promising yourself only a minute.',
				'Choice: keep walking',
				'The cold steals your pulse. Hypothermia writes your final lullaby beneath the silent pines.'
			],
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
			terminal: true,
			terminalReason: 'rescued'
		},
		'scout-with-torch': {
			id: 'scout-with-torch',
			label: 'Scout with a torch',
			followUp: [
				'Chosen: scout with a torch',
				'You snap a burning branch free and stalk into the trees, the flame painting skeletal trunks gold.',
				'The wind smears smoke across your face while shadows jump like startled animals.',
				'You find two paths: one leading to a gutted ranger station, another to a cliff edge with strange markings.',
				'Which way do you go?'
			],
		},
		'explore-ranger-station': {
			id: 'explore-ranger-station',
			label: 'Investigate the ranger station',
			followUp: [
				'Chosen: ranger station',
				'Inside, a dusty cot and a wheezing radio wait for patient hands.',
				'You thaw out beneath a real roof as static slowly shapes into a human voice.',
				'The voice says: "If you\'re hearing this, don\'t use the emergency tunnel. I repeat—"',
				'Static. There\'s a tunnel entrance behind a shelf.',
				'Use the radio to call for help or explore the forbidden tunnel?'
			],
		},
		'use-radio': {
			id: 'use-radio',
			label: 'Use the radio to call for help',
			followUp: [
				'Chosen: use radio',
				'You broadcast your location. A voice crackles back: "Copy. Stay put. Help arriving dawn."',
				'You wait, feeding the small stove. Hours pass in warm silence.',
				'Dawn brings a helicopter. You made it.',
				'Later, you ask about the tunnel. They go very quiet.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'explore-forbidden-tunnel': {
			id: 'explore-forbidden-tunnel',
			label: 'Explore the forbidden tunnel',
			followUp: [
				'Chosen: explore tunnel',
				'The tunnel descends at a nauseating angle. Your torch reveals claw marks on stone.',
				'You find a chamber. In the center: supplies, medical equipment, and a cage.',
				'The cage is open. Whatever was inside is gone.',
				'Behind you, something large breathes. Exit fast or hide behind the cage?'
			],
		},
		'sprint-from-tunnel': {
			id: 'sprint-from-tunnel',
			label: 'Sprint back to the exit',
			followUp: [
				'Chosen: sprint from tunnel',
				'You don\'t look back. The breathing becomes galloping.',
				'You burst into the ranger station, slam the shelf back in place.',
				'Something impacts the wall. Once. Twice. Then silence.',
				'You barricade every entrance and wait. Dawn comes. It doesn\'t.',
				'Rescuers find you babbling about warnings on radios. They nod. They know.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'hide-behind-cage': {
			id: 'hide-behind-cage',
			label: 'Hide behind the cage',
			followUp: [
				'Chosen: hide behind cage',
				'You crouch, breath held. The thing enters—too tall, too many joints.',
				'It sniffs the air. Then it speaks your name.',
				'You didn\'t tell anyone your name. The cage wasn\'t for keeping something in.',
				'It was for keeping something out. You.'
			],
			terminal: true,
			terminalReason: 'predator'
		},
		'investigate-cliff-markings': {
			id: 'investigate-cliff-markings',
			label: 'Investigate the cliff markings',
			followUp: [
				'Chosen: cliff markings',
				'The symbols are carved deep, recent. They form arrows pointing down.',
				'You peer over the edge. Far below, lights—a town, civilization, warmth.',
				'There\'s a climbing rope tied to a tree, or you can try to find another path down.',
				'Trust the rope or search for safer descent?'
			],
		},
		'trust-cliff-rope': {
			id: 'trust-cliff-rope',
			label: 'Trust the rope and descend',
			followUp: [
				'Chosen: trust the rope',
				'You lower yourself into the void. The rope holds, fraying but determined.',
				'Halfway down, you see why the markings pointed here—a cave entrance.',
				'Inside: fresh supplies, water, and a note: "For the desperate. Pass it on."',
				'You rest, then continue down. The town is real. You made it.',
				'You leave supplies and a note in the cave for the next person.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'search-safer-path': {
			id: 'search-safer-path',
			label: 'Search for a safer path',
			followUp: [
				'Chosen: safer path',
				'You skirt the cliff edge, looking for a gentle slope.',
				'The symbols stop. No more arrows. You\'re on your own.',
				'Two hours of wandering. Your torch dies. The cold intensifies.',
				'You never find the path. The cliff was the answer.'
			],
			terminal: true,
			terminalReason: 'hypothermia'
		},
		'follow-distant-lights': {
			id: 'follow-distant-lights',
			label: 'Follow distant lights',
			followUp: [
				'Chosen: follow distant lights',
				'Across the valley, a row of warm, unmoving stars—windows—blink through the white.',
				'You angle downhill, guarding your balance, calling out when the wind dips.',
				'A plowed road appears like a river of gravel. A truck idles, then a door opens.',
				'Gloved hands help you into heat and questions. You made it.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'whiteout-storm': {
			id: 'whiteout-storm',
			label: 'Press into the storm',
			followUp: [
				'Chosen: press into the storm',
				'The sky erases the horizon; snow becomes air, air becomes snow.',
				'Your world shrinks to an arm’s length of ghosts.',
				'Do you hunker down or keep moving blindly?'
			],
		},
		'hunker-down-storm': {
			id: 'hunker-down-storm',
			label: 'Hunker down and wait',
			followUp: [
				'Chosen: hunker down',
				'You crawl behind a fallen tree, pack the windward side with snow, and light a tight, low fire.',
				'You ration breaths and seconds; the storm spends itself over you like an angry ocean.',
				'When the white peels back, you emerge slower but alive.',
				'A row of lights winks through the storm. Follow or stay?'
			],
		},
		'blind-march-storm': {
			id: 'blind-march-storm',
			label: 'Keep moving blindly',
			followUp: [
				'Chosen: keep moving blindly',
				'You chase a phantom ridge and step into nothing—snow hides the drop until it doesn’t.',
				'The landing steals the wind from your lungs; the white keeps the rest.',
			],
			terminal: true,
			terminalReason: 'avalanche'
		},
		'raider-encounter': {
			id: 'raider-encounter',
			label: 'Approach shouting figures',
			followUp: [
				'Chosen: approach shouting figures',
				'Silhouettes crest the drift, faces wrapped, voices hard. Not rescuers—opportunists.',
				'Do you run or try to parley?'
			],
		},
		'run-from-raiders': {
			id: 'run-from-raiders',
			label: 'Run for it',
			followUp: [
				'Chosen: run for it',
				'You bolt into the timberline, branches clawing and snow grabbing ankles.',
				'A crack splits the quiet. You fall into it and don’t get up.'
			],
			terminal: true,
			terminalReason: 'injury'
		},
		'parley-with-raiders': {
			id: 'parley-with-raiders',
			label: 'Parley and offer supplies',
			followUp: [
				'Chosen: parley with raiders',
				'You raise empty hands, offer food and a spare light. Their answer is short and final.',
				'The snow drinks the sound.'
			],
			terminal: true,
			terminalReason: 'predator'
		},
		'wolf-prowl': {
			id: 'wolf-prowl',
			label: 'Veer toward howls',
			followUp: [
				'Chosen: veer toward howls',
				'Howls stitch through the pines. Curiosity outruns caution.',
				'Shapes fan out, low and deliberate.',
				'Do you brandish fire or freeze?'
			],
		},
		'brandish-fire': {
			id: 'brandish-fire',
			label: 'Brandish the torch',
			followUp: [
				'Chosen: brandish the torch',
				'Flame blooms wide; the pack hesitates, eyes flicking. You back away, slow and speaking.',
				'The forest swallows the sound. You live another hour.'
			],
			terminal: true,
			terminalReason: 'survived'
		},
		'freeze-before-pack': {
			id: 'freeze-before-pack',
			label: 'Freeze and hope',
			followUp: [
				'Chosen: freeze and hope',
				'Predators read silence like a map. The circle tightens, then breaks.',
				'Winter does the rest.'
			],
			terminal: true,
			terminalReason: 'predator'
		},
		'find-shelter': {
			id: 'find-shelter',
			label: 'Search for shelter',
			followUp: [
				'Chosen: search for shelter',
				'You decide to leave the trail and venture deeper into the forest.',
				'The trees grow denser, their skeletal branches clawing at the sky.',
				'You stumble upon a rocky overhang that offers some protection from the wind.',
				'Inside, you find traces of an old campfire.',
				'Will you try to rekindle it or keep searching?'
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
				'Chosen: investigate the sound'
			],
			terminal: true,
			terminalReason: 'rickrolled'
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
				'A soundless misstep, then the world tilts—your leg buckles with a brittle crack, your neck breaks.'
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
				'You sit down "just a minute."'
			],
			terminal: true,
			terminalReason: 'starvation'
		},
		'eat-snow': {
			id: 'eat-snow',
			label: 'Eat handfuls of snow for hydration',
			followUp: [
				'Chosen: eat snow',
				'You scoop up pristine snow and shove it into your mouth, convinced this is smart survival.',
				'Your core temperature plummets faster than your hopes.',
				'Brain freeze evolves into just... freeze.',
				'The last thing you see is your own teeth chattering independently, and possibly explosive diahheria.'
			],
			terminal: true,
			terminalReason: 'brain_freeze'
		},
		'build-snowman': {
			id: 'build-snowman',
			label: 'Build a snowman for morale',
			followUp: [
				'Chosen: build a snowman',
				'You spend precious energy rolling three perfect spheres of snow.',
				'Using sticks for arms and a pine cone for the nose, you craft an impressive frozen companion.',
				'He stares at you with coal-less eyes. You name him Steve.',
				'Steve does not help. Steve judges your life choices silently.',
				'What now?'
			],
		},
		'befriend-steve': {
			id: 'befriend-steve',
			label: 'Tell Steve your feelings',
			followUp: [
				'Chosen: befriend Steve',
				'You sit beside Steve and pour your heart out.',
				'The cold must be getting to you because Steve seems... understanding?',
				'In fact, Steve whispers ancient secrets of the forest. He considers you to be his parent.',
				'And it turns out Steve knows where the ranger station is, so Steve was helpful all along.',
				'You follow Steve\'s directions and find warmth and rescue, at the expense of leaving steve behind.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'abandon-steve': {
			id: 'abandon-steve',
			label: 'Abandon Steve and move on',
			followUp: [
				'Chosen: abandon Steve',
				'You turn your back on Steve without so much as a goodbye.',
				'The wind picks up. You swear you hear disappointed snowman sighing.',
				'A tree branch falls exactly where you\'re standing. Steve\'s revenge is swift and brutal.'
			],
			terminal: true,
			terminalReason: 'steve_revenge'
		},
		'negotiate-squirrels': {
			id: 'negotiate-squirrels',
			label: 'Negotiate with the squirrels',
			followUp: [
				'Chosen: negotiate with squirrels',
				'You approach a tree where several squirrels are chittering.',
				'You offer them your last granola bar in exchange for directions.',
				'They take the bar and give you absolutely nothing.',
				'One of them throws an acorn at your head.',
				'Negotiations have failed. What\'s your next move?'
			],
		},
		'interpretive-dance': {
			id: 'interpretive-dance',
			label: 'Perform interpretive dance to summon help',
			followUp: [
				'Chosen: interpretive dance',
				'You begin an elaborate dance routine, expressing your survival struggle through movement.',
				'Your limbs flail wildly. Snow sprays. You pirouette into a pine tree.',
				'A passing hiker films you and posts it online. You become a meme.',
				'The hiker also calls rescue. You\'re saved, but at what cost?',
				'Forget about your dignity now, it\'s worth nothing now.'
			],
			terminal: true,
			terminalReason: 'meme'
		},
		'challenge-bear': {
			id: 'challenge-bear',
			label: 'Challenge a bear to single combat',
			followUp: [
				'Chosen: challenge a bear',
				'You spot a bear in the distance and, driven by hypothermia-induced confidence, issue a formal challenge.',
				'The bear looks confused. You assume a fighting stance.',
				'The bear accepts. You immediately regret everything.',
				'You probably should have taken those Taikwondo classes...'
			],
			terminal: true,
			terminalReason: 'bear_combat'
		},
		'summon-aliens': {
			id: 'summon-aliens',
			label: 'Build a signal fire for aliens',
			followUp: [
				'Chosen: summon aliens',
				'You arrange the fire in a precise geometric pattern, hoping extraterrestrials will notice.',
				'The flames spell out "HELP" in what you assume is universal language.',
				'A bright light descends from the clouds. Success!',
				'It\'s a park ranger helicopter. Close enough.',
				'The pilot asks if you\'re okay. You lie and say yes.'
			],
			terminal: true,
			terminalReason: 'alien_rescue'
		},
		'become-yeti': {
			id: 'become-yeti',
			label: 'Embrace the cold and become one with the mountain',
			followUp: [
				'Chosen: become yeti',
				'You strip off your jacket and howl at the sky.',
				'The cold no longer bothers you. Hair sprouts everywhere.',
				'Your feet grow to size 23. You no longer need civilization.',
				'Years later, hikers report a friendly yeti who gives surprisingly good trail advice.',
				'You have transcended.'
			],
			terminal: true,
			terminalReason: 'yeti'
		},
		'call-mom': {
			id: 'call-mom',
			label: 'Try calling your mom',
			followUp: [
				'Chosen: call mom',
				'You fumble for your phone with frozen fingers. One bar of signal!',
				'Your mom answers on the first ring. "I told you to bring a jacket," she says.',
				'You\'re too cold to argue. She conference calls the park rangers.',
				'You\'re rescued. She never lets you forget this.'
			],
			terminal: true,
			terminalReason: 'mom_rescue'
		},
		'write-memoir': {
			id: 'write-memoir',
			label: 'Start writing your survival memoir',
			followUp: [
				'Chosen: write memoir',
				'You pull out a notebook and begin documenting your harrowing ordeal.',
				'Chapter 1: "The Trail That Betrayed Me." Chapter 2: "Frostbite and Regret."',
				'Your fingers freeze before you finish Chapter 3.',
				'Rescuers find you clutching the notebook. It becomes a bestseller posthumously.'
			],
			terminal: true,
			terminalReason: 'bestseller'
		},
		'repair-cabin': {
			id: 'repair-cabin',
			label: 'Attempt to repair the cabin',
			followUp: [
				'Chosen: repair the cabin',
				'You find some old boards and nails scattered around.',
				'The window patch holds. The stove wheezes to life after aggressive coaxing.',
				'As warmth spreads, you notice a trapdoor beneath the moth-eaten rug.',
				'Open the trapdoor or ignore it and rest?'
			],
		},
		'open-trapdoor': {
			id: 'open-trapdoor',
			label: 'Open the trapdoor',
			followUp: [
				'Chosen: open trapdoor',
				'The hinges scream. Wooden steps descend into absolute dark.',
				'Your phone flashlight reveals a dusty cellar stocked with old canned goods and... bones.',
				'Human bones arranged in a strange circle around a journal.',
				'Read the journal or flee the cabin immediately?'
			],
		},
		'read-cursed-journal': {
			id: 'read-cursed-journal',
			label: 'Read the journal',
			followUp: [
				'Chosen: read the journal',
				'The handwriting spirals into madness. The last entry: "They\'re not wolves. They never were."',
				'Something scratches at the cabin door. Four rhythmic scrapes.',
				'The bones begin to rattle. The temperature drops twenty degrees in five seconds.',
				'You realize the cabin isn\'t abandoned—you\'re trespassing.',
				'Run into the night or hide in the cellar?'
			],
		},
		'flee-cursed-cabin': {
			id: 'flee-cursed-cabin',
			label: 'Flee into the night',
			followUp: [
				'Chosen: flee into the night',
				'You burst through the door into howling wind.',
				'Behind you, the cabin implodes silently, as if it never existed.',
				'Ahead, lights—genuine, electric lights—bloom through the trees.',
				'You stumble into a park ranger station, babbling about bones and journals.',
				'They nod knowingly. "Third one this month," they mutter. You\'re safe. Probably.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'hide-in-cellar': {
			id: 'hide-in-cellar',
			label: 'Hide in the cellar',
			followUp: [
				'Chosen: hide in the cellar',
				'You pull the trapdoor shut and sit among the bones.',
				'The scratching intensifies. Then stops. Silence worse than sound.',
				'Hours pass. Dawn never comes in the cellar.',
				'The journal was a warning. You\'re the next entry.'
			],
			terminal: true,
			terminalReason: 'predator'
		},
		'ignore-trapdoor': {
			id: 'ignore-trapdoor',
			label: 'Ignore it and rest',
			followUp: [
				'Chosen: ignore trapdoor',
				'You kick the rug back over the trapdoor and feed the stove.',
				'Sleep takes you in warm, necessary waves.',
				'Morning light wakes you—actual sunrise, not hallucination.',
				'The cabin feels different. Safer. The trapdoor is gone.',
				'Outside, a clear trail leads to a highway. You made it.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'escalate-squirrel-war': {
			id: 'escalate-squirrel-war',
			label: 'Declare war on the squirrels',
			followUp: [
				'Chosen: declare war on squirrels',
				'You shout insults in their direction. They chitter what sounds like laughter.',
				'You throw a snowball. Direct hit. The chittering stops.',
				'Suddenly, thirty squirrels emerge from the trees, organized in formation.',
				'This was a mistake. What\'s your defense strategy?'
			],
		},
		'offer-truce': {
			id: 'offer-truce',
			label: 'Offer a formal truce',
			followUp: [
				'Chosen: offer truce',
				'You kneel in the snow and offer your last pack of nuts.',
				'The alpha squirrel approaches, sniffs, and accepts.',
				'In exchange, they lead you to a forgotten ranger cache full of supplies.',
				'You survive three more days until rescue, sustained by squirrel diplomacy.',
				'You write a paper about it later. No one believes you.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'fight-squirrels': {
			id: 'fight-squirrels',
			label: 'Stand your ground and fight',
			followUp: [
				'Chosen: fight the squirrels',
				'You swing a stick wildly. Squirrels dodge with infuriating ease.',
				'One leaps onto your head. Then another. Then seven.',
				'You are buried in furious, chittering chaos.',
				'Rescuers find you three days later, traumatized but alive.',
				'You never go near trees again.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'scout-frozen-lake': {
			id: 'scout-frozen-lake',
			label: 'Scout for a frozen lake',
			followUp: [
				'Chosen: scout for frozen lake',
				'You navigate to a clearing where ice stretches flat and endless.',
				'Something is embedded in the center—a shape, dark and rectangular.',
				'As you approach, you realize it\'s a car, frozen mid-sink.',
				'Do you investigate the car or turn back?'
			],
		},
		'investigate-frozen-car': {
			id: 'investigate-frozen-car',
			label: 'Investigate the frozen car',
			followUp: [
				'Chosen: investigate the car',
				'You chip away ice from the driver\'s window. Empty. Keys still in the ignition.',
				'The glovebox contains a flare gun and a note: "Don\'t trust the red cabin."',
				'A crack echoes beneath your feet. The ice is thinning.',
				'Grab the flare gun and run, or leave it and move carefully?'
			],
		},
		'grab-flare-run': {
			id: 'grab-flare-run',
			label: 'Grab the flare gun and run',
			followUp: [
				'Chosen: grab and run',
				'You snatch the flare gun. The ice splinters like glass.',
				'You sprint, each step a gamble. The shore is twenty feet away.',
				'Ten feet. Five. The ice gives out behind you.',
				'You collapse on solid ground, gasping. The flare gun works.',
				'You fire it into the sky. A helicopter arrives within the hour.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'leave-flare-carefully': {
			id: 'leave-flare-carefully',
			label: 'Leave it and move carefully',
			followUp: [
				'Chosen: move carefully',
				'You back away slowly. The ice groans but holds.',
				'You make it to shore without the flare gun.',
				'That night, you see lights from a distant cabin—red walls, warm glow.',
				'You remember the note. You avoid it and freeze to death alone.',
				'The note never said what the red cabin would do. You\'ll never know.'
			],
			terminal: true,
			terminalReason: 'hypothermia'
		},
		'turn-back-from-lake': {
			id: 'turn-back-from-lake',
			label: 'Turn back from the lake',
			followUp: [
				'Chosen: turn back',
				'The frozen car can keep its secrets.',
				'You retreat into the forest and find a hiking trail marked with fresh footprints.',
				'Following them leads to a ski lodge, lights blazing, people laughing inside.',
				'You made it. The car is someone else\'s mystery.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'eat-questionable-berries': {
			id: 'eat-questionable-berries',
			label: 'Eat the questionable red berries',
			followUp: [
				'Chosen: eat berries',
				'Hunger overrides judgment. You pluck and swallow.',
				'They taste like copper and regret.',
				'Within minutes, the forest begins to breathe. Colors intensify.',
				'A deer speaks to you in your grandmother\'s voice.',
				'Are you hallucinating or ascending?'
			],
		},
		'follow-deer-vision': {
			id: 'follow-deer-vision',
			label: 'Follow the talking deer',
			followUp: [
				'Chosen: follow the deer',
				'The deer leads you through impossible geometry—trees bending sideways, snow falling upward.',
				'You arrive at a cabin made of light. Inside, warmth that feels like love.',
				'You sleep for what feels like years.',
				'You wake in a hospital. They found you unconscious but alive.',
				'The berries were toxic. The deer was real. No one believes either part.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'resist-hallucination': {
			id: 'resist-hallucination',
			label: 'Resist the hallucination',
			followUp: [
				'Chosen: resist hallucination',
				'You close your eyes and count backwards from one hundred.',
				'When you open them, you\'re lying in snow, stomach convulsing.',
				'The berries are purging themselves violently.',
				'You survive the poisoning but lose twelve hours.',
				'Dawn finds you weak, delirious, but lucid enough to spot a rescue chopper.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
		'build-snow-fort': {
			id: 'build-snow-fort',
			label: 'Build an elaborate snow fort',
			followUp: [
				'Chosen: build snow fort',
				'You dig and sculpt, creating walls, ramparts, and a functional drawbridge.',
				'Hours pass. Your fort is magnificent. You are also very cold.',
				'But wait—the fort is actually providing legitimate shelter from the wind.',
				'Do you stay in your fort or abandon it for mobile warmth?'
			],
		},
		'defend-snow-fort': {
			id: 'defend-snow-fort',
			label: 'Defend your snow fort',
			followUp: [
				'Chosen: defend the fort',
				'You huddle inside, burning small sticks for heat.',
				'Night falls. Shadows test your walls. Wind lays siege.',
				'Morning finds you frozen into your own architecture.',
				'The fort becomes your tomb. Archaeologists discover it in 2087.',
				'They name it "The Folly." It\'s in textbooks.'
			],
			terminal: true,
			terminalReason: 'hypothermia'
		},
		'abandon-fort': {
			id: 'abandon-fort',
			label: 'Abandon the fort strategically',
			followUp: [
				'Chosen: abandon strategically',
				'You dismantle part of the fort to make a sled and directional markers.',
				'The fort served its purpose—shelter while you regained strength.',
				'You slide downhill on your sled, following the markers.',
				'You crash spectacularly into a snowbank near a road.',
				'A truck stops. You\'re saved by a confused delivery driver.'
			],
			terminal: true,
			terminalReason: 'rescued'
		},
	};

	const promptChoiceMap = {
		'What will you do?': ['trail', 'gather-wood', 'find-shelter', 'eat-snow', 'build-snowman'],
		'Do you still not want to build a fire?': ['gather-wood', 'keep-walking', 'negotiate-squirrels'],
		'Will you take it out to start a fire?': ['collect-more-wood', 'start-fire', 'interpretive-dance'],
		'Do you keep moving or double back for warmth?': ['keep-walking-final', 'return-for-wood', 'become-yeti'],
		'The fire steadies. Stay put or make a plan?': ['stay-with-fire', 'scout-with-torch', 'summon-aliens'],
		'Will you try to rekindle it or keep searching?': ['start-fire', 'keep-searching', 'scout-frozen-lake'],
		'Do you enter the cave or follow the stream?': ['enter-cave', 'follow-stream', 'challenge-bear'],
		'Do you investigate the sound or barricade the entrance?': ['investigate-sound', 'barricade-entrance'],
		'Do you help the wolf or retreat to the entrance?': ['help-wolf', 'return-for-wood'],
		'Do you try to repair the cabin or move on?': ['repair-cabin', 'keep-walking', 'call-mom'],
		'The frozen stream looks fast and safe. Hurry or take care?': ['slip-on-ice', 'trail'],
		'Food can wait, right? Rest or push on?': ['linger-too-long', 'keep-walking', 'write-memoir'],
		'A row of lights winks through the storm. Follow or stay?': ['follow-distant-lights', 'stay-with-fire'],
		'Do you hunker down or keep moving blindly?': ['hunker-down-storm', 'blind-march-storm'],
		'Shouting ahead. Figures on the ridge. Approach or avoid?': ['raider-encounter', 'whiteout-storm'],
		'Do you run or try to parley?': ['run-from-raiders', 'parley-with-raiders'],
		'Howls to the east. Investigate or steer away?': ['wolf-prowl', 'trail'],
		'Do you brandish fire or freeze?': ['brandish-fire', 'freeze-before-pack'],
		'What now?': ['befriend-steve', 'abandon-steve'],
		'What\'s your next move?': ['escalate-squirrel-war', 'start-fire', 'interpretive-dance'],
		'Open the trapdoor or ignore it and rest?': ['open-trapdoor', 'ignore-trapdoor'],
		'Read the journal or flee the cabin immediately?': ['read-cursed-journal', 'flee-cursed-cabin'],
		'Run into the night or hide in the cellar?': ['flee-cursed-cabin', 'hide-in-cellar'],
		'What\'s your defense strategy?': ['offer-truce', 'fight-squirrels', 'build-snow-fort'],
		'Do you investigate the car or turn back?': ['investigate-frozen-car', 'turn-back-from-lake'],
		'Grab the flare gun and run, or leave it and move carefully?': ['grab-flare-run', 'leave-flare-carefully'],
		'Are you hallucinating or ascending?': ['follow-deer-vision', 'resist-hallucination', 'eat-questionable-berries'],
		'Do you stay in your fort or abandon it for mobile warmth?': ['defend-snow-fort', 'abandon-fort'],
		'Which way do you go?': ['explore-ranger-station', 'investigate-cliff-markings'],
		'Use the radio to call for help or explore the forbidden tunnel?': ['use-radio', 'explore-forbidden-tunnel'],
		'Exit fast or hide behind the cage?': ['sprint-from-tunnel', 'hide-behind-cage'],
		'Behind you, something large breathes. Exit fast or hide behind the cage?': ['sprint-from-tunnel', 'hide-behind-cage'],
		'Trust the rope or search for safer descent?': ['trust-cliff-rope', 'search-safer-path'],
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

		if (choice.id === 'investigate-sound') {
			disappearOption(index);
			hidePanel();
			try {
				window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank', 'noopener');
			} catch (err) {
				console.error('Failed to open Rick Roll link:', err);
			}
			if (window.gameOverManager && typeof window.gameOverManager.prepareEnd === 'function') {
				window.gameOverManager.prepareEnd('rickrolled');
			} else {
				document.dispatchEvent(new CustomEvent('game:over', { detail: { reason: 'rickrolled' } }));
			}
			return;
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
			requestAnimationFrame(() => {
				document.dispatchEvent(new CustomEvent('story:auto-scroll'));
			});
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

		// YESSSSSSS BECAUSE OFC I CAN BREAK SOMETHIG THAT WAS PERFECTLY WORKING HAHAHA
		console.log('Line completed:', matchingText);
		console.log('Found choice IDs:', choiceIds);

		if (!choiceIds) {
			return;
		}

		const choices = choiceIds
			.map((choiceId) => choiceCatalog[choiceId])
			.filter(Boolean);
// DEBUGGING LOGorathmsssss
		console.log('Mapped choices:', choices);

		if (choices.length > 0) {
			showChoices(choices);
		}
	});
})();
