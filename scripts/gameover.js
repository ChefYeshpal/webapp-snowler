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
