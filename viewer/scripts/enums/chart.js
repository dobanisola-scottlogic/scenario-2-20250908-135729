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
    }
};

module.exports = CHART;
