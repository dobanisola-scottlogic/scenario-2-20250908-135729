const CHART = {
    COLLECTABLES: {
        SELECTOR: '#collectables-chart',
        ANNOTATIONS: [
            {name: 'Scarce', value: 20},
            {name: 'Plentiful', value: 100}
        ],
        XDOMAIN: ['Collectables'],
        YDOMAIN: [0, 250],
        COLORS: {
            GOOD: '#0c0',
            BAD: '#f00',
            NEUTRAL: 'inherit'
        }
    },
    PHASE: {
        SELECTOR: '#phase-chart',
        MARGIN: { TOP: 10, RIGHT: 10, BOTTOM: 20, LEFT: 30 },
        WIDTH: 1280,
        HEIGHT: 200
    }
};

module.exports = CHART;
