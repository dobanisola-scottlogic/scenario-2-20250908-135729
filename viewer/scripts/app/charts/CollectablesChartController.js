let fc = require('d3fc');
let d3 = require('d3');
let CHART = require('../../enums/chart.js');

class CollectablesChartController {
    constructor(engine) {
        this.engine = engine;
        this.constants = CHART.COLLECTABLES;
        this.annotations = this.constants.ANNOTATIONS;
        this.colors = this.constants.COLORS;
        this.initialise();
    }

    getData(phaseIndex) {
        return this.engine.getPhaseState(phaseIndex).collectables.length;
    }

    initialise() {
        this.chart = fc.chart.cartesian(
                        d3.scale.ordinal(),
                        d3.scale.linear())
                    .xDomain(this.constants.XDOMAIN)
                    .yDomain(this.constants.YDOMAIN);
        this.annotation = fc.annotation.line()
            .value((annotation) => { return annotation.value; })
            .decorate((selection) => {
                selection.enter()
                    .select('g.left-handle')
                    .append('text')
                    .attr({x: 5, y: -5});
                selection.select('g.left-handle text')
                    .text((annotation) => {
                        return annotation.name;
                    });
            });
        this.bar = fc.series.bar()
            .xValue(this.constants.XDOMAIN[0]);
    }

    update(phaseIndex) {
        this.data = [this.getData(phaseIndex)];

        this.bar
            .yValue(this.getData(phaseIndex))
            .decorate((selection) => {
                selection.select('.bar > path')
                    .style('fill', (collectablesCount) => {
                        if (collectablesCount > this.annotations[1].value) {
                            return this.colors.GOOD;
                        }
                        else if (collectablesCount > this.annotations[0].value) {
                            return this.colors.NEUTRAL;
                        }
                        else {
                            return this.colors.BAD;
                        }
                    });
            });

        let multi = fc.series.multi()
            .series([this.bar, this.annotation])
            .mapping((series) => {
                if (series === this.annotation) {
                    return this.annotations;
                }
                else {
                    return this.data;
                }
            });

        this.chart.plotArea(multi);
    }

    render(phaseIndex) {
        this.update(phaseIndex);

        d3.select(this.constants.SELECTOR)
            .datum(this.data)
            .call(this.chart);
    }
}

module.exports = CollectablesChartController;
