require('../../../node_modules/d3fc/dist/d3fc.css');

var CollectablesChartController = require('./CollectablesChartController.js');

class ChartRenderer {
    constructor(engine) {
        this.engine = engine;
        this.collectablesChart = new CollectablesChartController(engine);
    }

    render() {
        this.collectablesChart.render();
    }
}


module.exports = ChartRenderer;
