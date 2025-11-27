// Game over and choice tracking manager
(function () {
    const tracker = {
        path: [],
        record(choiceId) {
            if (choiceId == null) return;
            this.path.push(String(choiceId));
        },
        getPathString() {
            if (this.path.length === 0) return '(no choices)';
            return this.path.join(' → ');
        },
        reset() {
            this.path = [];
        }
    };

    window.choiceTracker = tracker;

    const reasonCopy = {
        hypothermia: {
            title: 'GAME OVER — Hypothermia',
            detail: 'The blizzard does not bargain. Your core temperature slips away until even fear freezes.',
            extra: 'Snow piles faster than breath, burying every trace you left behind.',
        },
        frostbite: {
            title: 'GAME OVER — Frostbite',
            detail: 'Your hands turn to glass, then stone; pain blooms and vanishes. The forest offers no grip to a numb traveler.',
            extra: 'Blackened fingertips write a final message on the snow: too late.',
        },
        exhaustion: {
            title: 'GAME OVER — Exhaustion',
            detail: 'Steps become numbers. Numbers become nothing. You lie down “just to rest” and the night tucks you in forever.',
            extra: 'Somewhere, the wind counts to zero.',
        },
        starvation: {
            title: 'GAME OVER — Starvation',
            detail: 'Hunger scrapes you hollow. Strength drains until even hope feels heavy.',
            extra: 'The pines keep their needles; you keep your silence.',
        },
        avalanche: {
            title: 'GAME OVER — Avalanche',
            detail: 'The slope shivers, then roars. White thunder swallows your name before you can breathe it.',
            extra: 'Stillness returns, pretending nothing happened.',
        },
        lost: {
            title: 'GAME OVER — Lost',
            detail: 'Circles carve circles. Every landmark repeats until the map in your head erases itself.',
            extra: 'The trail exists. Just not where you are.',
        },
        injury: {
            title: 'GAME OVER — Injury',
            detail: 'A fall, a crack, and the world sharpens into pain. Cold finishes what gravity started.',
            extra: 'Your breath paints the snow until it doesn’t.',
        },
        cave_collapse: {
            title: 'GAME OVER — Cave-In',
            detail: 'Stone shifts like memory. The entrance narrows to a secret you cannot tell.',
            extra: 'Echoes fade with the last ember.',
        },
        predator: {
            title: 'GAME OVER — Predator',
            detail: 'The timberline watches with older eyes. Teeth glint where your torch cannot reach.',
            extra: 'The forest keeps what it finds.',
        },
        smoke_inhalation: {
            title: 'GAME OVER — Smoke Inhalation',
            detail: 'Fire gives heat and takes air. Coughs stack until the dark outweighs the orange.',
            extra: 'Soot settles like snow inside your lungs.',
        },
        rescued: {
            title: 'GAME OVER — Rescued',
            detail: 'You are found—fingers thawed, breath steadied, name spoken back to you.',
            extra: 'Warm lights and careful hands guide you home. Well done holding on.',
        },
        default: {
            title: 'GAME OVER',
            detail: 'Your time in the pines ends here.',
        }
    };

    let pendingEnd = null;
    let endQueued = false;

    function buildNarration(reasonKey) {
        const copy = reasonCopy[reasonKey] || reasonCopy.default;
        const pathString = tracker.getPathString();
        const lines = [
            { text: copy.title, className: 'story-line--gameover' },
            { text: copy.detail, className: 'story-line--gameover' },
        ];
        if (copy.extra) {
            lines.push({ text: copy.extra, className: 'story-line--gameover' });
        }
        lines.push(
            { text: `Path taken: ${pathString}`, className: 'story-line--gameover' },
            { text: 'Reload the page to brave the storm again.', className: 'story-line--gameover' }
        );
        return lines;
    }

    function emitNarratedEnding(reasonKey) {
        if (!window.storyTyper) {
            return;
        }

        const lines = buildNarration(reasonKey);
        window.storyTyper.enqueueLines(lines);
    }

    function prepareEnd(reason) {
        pendingEnd = reason || 'default';
        endQueued = false;
    }

    document.addEventListener('story:sequence-complete', () => {
        if (pendingEnd == null || endQueued) {
            return;
        }
        endQueued = true;
        window.setTimeout(() => {
            emitNarratedEnding(pendingEnd);
            pendingEnd = null;
        }, 350);
    });

    window.gameOverManager = {
        prepareEnd,
    };
})();
