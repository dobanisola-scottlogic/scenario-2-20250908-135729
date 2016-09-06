let d3 = require('d3');
let fc = require('d3fc');
let CHART = require('../../enums/chart.js');

class PhaseChartController {
    constructor(engine) {
        this.engine = engine;

        // Chart variables
        this.chart = null;
        this.xScale = null;
        this.yScale = null;
        this.brush = null;
        this.maximumYValue = 10;
        this.brushed = false;

        // Team and phasedata
        this.phaseData = [];

        this.teamCount = 0;
        this.teamColours = [];
        this.teamData = [];
        this.graphSeries = ['gridlines'];
        this.teamSpawnCount = 0;

        // Spawn deaths
        this.spawnDestroys = [];

        // Store for last rendered phase
        this.lastPhaseRendered = 0;
        this.highestPhaseRendered = 0;

        this.maxPhase = engine.getPhaseCount() - 1;

        this.initialiseChart();
    }
    updatePhaseData(phaseIndex, forceUpdate) {
        if (phaseIndex === 0) {
            for (let index = 0; index < this.teamCount; index++) {
                this.teamColours.push(this.engine.getTeamColour(this.phaseData[phaseIndex][index].owner).HEX);
            }

            this.spawnDestroys.forEach(spawnDestroy => {
                this.phaseData[phaseIndex].forEach(player => {
                    if (player.owner === spawnDestroy.owner) {
                        spawnDestroy.HEX = this.engine.getTeamColour(player.owner).HEX;
                    }
                });
            });
        }

        if (!this.brushed || forceUpdate) {
            if (phaseIndex > this.highestPhaseRendered) {
                // Only push data to the array if the team still exists
                // and if it hasn't already been pushed on
                for (let index = 0; index < this.teamCount; index++) {
                    if (this.phaseData[phaseIndex][index]) {
                        let currentTeam = this.teamData.find(team => team.team === index + 1);
                        currentTeam.data.push(this.phaseData[phaseIndex][index]);
                    }
                }

                this.spawnDestroys.forEach(spawnDestroy => {
                    if (phaseIndex === spawnDestroy.phase) {
                        for (let index = 0; index < this.teamCount; index++) {
                            if (this.phaseData[phaseIndex][index].owner === spawnDestroy.owner) {
                                let currentTeam = this.teamData.find(team => team.team === index + 1);
                                currentTeam.spawnDestroys.push(spawnDestroy);
                            }
                        }
                    }
                });
            }

            let phaseYExtent = fc.util.extent()
                .fields('playerCount')
                .pad(0.05)(this.phaseData[phaseIndex])[1];

            if (phaseYExtent > this.maximumYValue) {
                this.maximumYValue = phaseYExtent;
                this.yScale.domain([0, this.maximumYValue]);
            }

            this.brush.extent([0, phaseIndex]);

            this.lastPhaseRendered = phaseIndex;
            this.highestPhaseRendered = this.lastPhaseRendered > this.highestPhaseRendered ? this.lastPhaseRendered : this.highestPhaseRendered;
        }

    }
    render(phaseIndex) {
        this.updatePhaseData(phaseIndex);

        let renderData = {};

        for (let index = 1; index <= this.teamCount; index++) {
            renderData['teamLine' + index] = this.teamData[index - 1].data;
            renderData['teamSpawn' + index] = this.teamData[index - 1].spawnDestroys;
        }

        d3.select(CHART.PHASE.SELECTOR)
            .datum(renderData)
            .call(this.chart);

        let plotArea = d3.select(CHART.PHASE.SELECTOR)
            .select('.plot-area-container');

        if (phaseIndex === 0) {
            for (let index = 1; index <= this.teamCount; index++) {
                plotArea.select('.teamLine' + index)
                    .style('stroke', this.teamColours[index - 1]);

                plotArea.select('.teamSpawn' + index)
                    .style('stroke', 'white')
                    .style('fill', this.teamColours[index - 1]);
            }
        }

        for (let index = 1; index <= this.teamCount; index++) {
            plotArea.selectAll('.teamSpawn' + index)
            .select('path')
            .style('transform', 'rotate(45deg)');
        }
    }
    renderChartToPhase(phaseIndex) {
        if (phaseIndex > this.highestPhaseRendered) {
            for (let index = this.highestPhaseRendered; index <= phaseIndex; index++) {
                this.updatePhaseData(index, true);
            }
            this.render(phaseIndex);
        }
    }
    brushingStarted() {
        this.brushed = true;
    }
    brushing() {
        let leftBrushPosition = this.brush.extent()[1] < this.maxPhase ? this.brush.extent()[1] : this.maxPhase;
        this.brush.extent([-1, leftBrushPosition]);
        this.engine.renderPhase(Math.round(leftBrushPosition));
        this.renderChartToPhase(Math.round(leftBrushPosition));
    }
    brushingEnded() {
        let minPhase = 1;
        let leftBrushPosition = this.brush.extent()[1] < this.maxPhase ? this.brush.extent()[1] : this.maxPhase;
        leftBrushPosition = this.brush.extent()[1] > minPhase ? this.brush.extent()[1] : minPhase;
        this.brush.extent([-1, leftBrushPosition]);
        this.engine.renderPhase(Math.round(leftBrushPosition), true);
        this.renderChartToPhase(Math.round(leftBrushPosition));
        this.brushed = false;
    }
    initialiseChart() {
        d3.select(CHART.PHASE.SELECTOR)
            .select('.plot-area')
            .selectAll('.multi')
            .remove();

        this.initialiseData();
        this.initialiseScales();

        let teamPlayerCountLines = [];
        let teamSpawnDestroys = [];

        for (let index = 1; index <= this.teamCount; index++) {
            this.teamData.push({
                team: index,
                data: [],
                spawnDestroys: []
            });

            let teamPlayerCountLine = fc.series.line()
                .xValue((_, i) => i)
                .yValue(d => d.playerCount);
            teamPlayerCountLine.id = 'teamLine' + index;

            teamPlayerCountLines.push(teamPlayerCountLine);
            this.graphSeries.push(teamPlayerCountLine.id);
        }

        for (let index = 1; index <= this.teamCount; index++) {
            let teamSpawnDestroy = fc.series.point()
                .xValue(d => d.phase)
                .yValue(d => d.playerCount)
                .type('cross')
                .size(100);
            teamSpawnDestroy.id = 'teamSpawn' + index;

            teamSpawnDestroys.push(teamSpawnDestroy);
            this.graphSeries.push(teamSpawnDestroy.id);
        }

        this.graphSeries.push('brush');

        // Gridlines
        let gridlines = fc.annotation.gridline()
            .xTicks(0);
        gridlines.id = 'gridlines';

        this.brush = d3.svg.brush()
            .on('brushstart', () => { this.brushingStarted(); })
            .on('brush', () => { this.brushing(); })
            .on('brushend', () => { this.brushingEnded(); });
        this.brush.id = 'brush';

        // Bring the lines together into a single area
        let multi = fc.series.multi()
            .series([gridlines, ...teamPlayerCountLines, ...teamSpawnDestroys, this.brush])
            .mapping(function(series) {
                if (series.id === 'brush') {
                    series.y(null);
                }
                return this[series.id];
            })
            .decorate((selection) => {
                this.decorateChart(selection);
            })
            .xScale(this.xScale)
            .yScale(this.yScale);

        this.chart = fc.chart.cartesian(this.xScale, this.yScale)
            .plotArea(multi)
            .xNice()
            .yNice()
            .yOrient('left')
            .xOrient('bottom')
            .margin({
                top: CHART.PHASE.MARGIN.TOP,
                right: CHART.PHASE.MARGIN.RIGHT,
                bottom: CHART.PHASE.MARGIN.BOTTOM,
                left: CHART.PHASE.MARGIN.LEFT
            });
    }
    initialiseData() {
        this.teamCount = Object.keys(this.engine.getTeams()).length;

        // Get all the phase data
        for (let index = 0; index <= this.maxPhase; index++) {
            let teamInfo = this.engine.getPhaseTeamInfo(index);
            this.phaseData.push(teamInfo);

            if (index > 0) {
                for (let playerIndex = 0; playerIndex < this.phaseData[index].length; playerIndex++) {
                    if (this.phaseData[index][playerIndex].spawnCount !== this.phaseData[index - 1][playerIndex].spawnCount) {
                        this.spawnDestroys.push({
                            phase: index,
                            owner: this.phaseData[index][playerIndex].owner,
                            playerCount: this.phaseData[index][playerIndex].playerCount
                        });
                    }
                }
            }
        }
    }
    initialiseScales() {
        this.xScale = d3.scale.linear()
            .domain([0, this.maxPhase]);

        this.yScale = d3.scale.linear()
            .domain([0, this.maximumYValue]);
    }
    decorateChart(selection) {
        let enter = selection.enter();

        enter.attr('class', (_, i) => {
            return 'multi ' + this.graphSeries[i];
        });

        selection.selectAll('.extent')
            .style('cursor', 'default')
            .attr('height', CHART.PHASE.HEIGHT - CHART.PHASE.MARGIN.TOP - CHART.PHASE.MARGIN.BOTTOM);

        enter.selectAll('.resize.e>rect')
            .style('visibility', 'visible')
            .style('stroke', '#6f5d6f')
            .style('fill', '#6f5d6f')
            .attr('width', 2)
            .attr('x', 0);

        enter.selectAll('.resize.e')
            .append('circle')
            .attr('cy', (CHART.PHASE.HEIGHT - CHART.PHASE.MARGIN.TOP - CHART.PHASE.MARGIN.BOTTOM) / 2)
            .attr('cx', 1)
            .attr('r', 10)
            .attr('class', 'outer-handle')
            .style('fill', 'white')
            .style('stroke', '#6f5d6f')
            .style('stroke-width', 2);

        enter.selectAll('.resize.e')
            .append('circle')
            .attr('cy', (CHART.PHASE.HEIGHT - CHART.PHASE.MARGIN.TOP - CHART.PHASE.MARGIN.BOTTOM) / 2)
            .attr('cx', 1)
            .attr('r', 5)
            .attr('class', 'inner-handle')
            .style('fill', 'white')
            .style('stroke', '#6f5d6f')
            .style('stroke-width', 2);

        enter.selectAll('.extent')
            .style('display', 'none');

        selection.select('.resize.w')
            .remove();

        selection.selectAll('.resize.w>rect, .resize.e>rect')
            .attr('height', CHART.PHASE.HEIGHT - CHART.PHASE.MARGIN.TOP - CHART.PHASE.MARGIN.BOTTOM)
            .attr('y', 0);
    }
}

module.exports = PhaseChartController;
