require('../../../node_modules/d3fc/dist/d3fc.css');

let CollectablesChartController = require('./CollectablesChartController.js');
let PhaseChartController = require('./PhaseChartController.js');

class ChartRenderer {
    constructor(engine) {
        this.engine = engine;
        this.collectablesChart = new CollectablesChartController(engine);
        this.phaseChart = new PhaseChartController(engine);
    }

    render(phaseIndex) {
        this.collectablesChart.render(phaseIndex);
        this.phaseChart.render(phaseIndex);
    }
}


module.exports = ChartRenderer;
