import * as c3 from 'c3';
import 'c3/c3.min.css';
import { useEffect, useState } from 'react';
import { ParsedGameState } from '~/components/game/ParsedGameState';
import { TeamState } from '~/components/game/TeamState';
import { GameTeam } from '~/interfaces/GameTeam';
import { getTeamColour } from '~/utils/game-utils';
import { removeMilestoneBotPrefix } from '~/utils/milestone-utils';

import './chartStyles.css';

interface PlayersChartProps {
  gameState: ParsedGameState;
  teamData: GameTeam[];
}

const PlayersChart = ({ gameState, teamData }: PlayersChartProps) => {
  const [playersChart, setPlayersChart] = useState<c3.ChartAPI>();
  const [highestPlayerCount, setHighestPlayerCount] = useState(0);

  const currentPhase = gameState.phase;

  const getTeamName = (team: TeamState) => {
    const teamInfo = teamData.find((t) => t.botId === team.owner);
    return removeMilestoneBotPrefix(teamInfo?.teamName ?? '');
  };

  const teams = gameState?.teams ?? [];
  const teamIndexes: (string | number)[][] = teams.map((team) => [
    getTeamName(team),
  ]);

  // Counts will be appended to each index every phase change
  const [gamePlayerCounts, setGamePlayerCounts] = useState(teamIndexes);

  const initialChartData = {
    colors: teams.reduce((entry, team) => {
      return { ...entry, [getTeamName(team)]: getTeamColour(team.teamIndex) };
    }, {}),
    columns: [
      ['x', ...Array.from(Array(currentPhase).keys())],
      ...teamIndexes,
    ] as [string, ...c3.Primitive[]][],
    xs: teams.reduce((entry, team) => {
      return { ...entry, [getTeamName(team)]: 'x' };
    }, {}),
  };

  const chartConfiguration: c3.ChartConfiguration = {
    bindto: '#players-line-chart',
    axis: {
      y: {
        label: {
          text: 'Player total',
          position: 'outer-middle',
        },
        tick: {
          format: function (d) {
            if (d % 10 === 0) {
              return d;
            }
            return '';
          },
        },
      },
      y2: {
        show: true,
        tick: {
          outer: false,
        },
      },
      x: {
        label: {
          text: 'Game turn',
          position: 'outer-center',
        },
        tick: {
          values: [
            10, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325,
            350, 375, 400, 425, 450, 475, 500, 525,
          ], // Intervals up to current maximum turn count
        },
      },
    },
    data: initialChartData,
    legend: { hide: true },
    point: { r: 1.5 },
    tooltip: {
      format: {
        title: (x) => `Turn ${x?.toString()}`,
        value: (value) => value?.toString(),
      },
    },
    transition: { duration: 400 },
  };

  const getHighestPlayerCount = () => {
    const max = teams.reduce((prev, current) => {
      return prev && prev.playerCount > current.playerCount ? prev : current;
    });

    const phaseHighestPlayerCount = max.playerCount;
    return phaseHighestPlayerCount > highestPlayerCount
      ? phaseHighestPlayerCount
      : highestPlayerCount;
  };

  useEffect(() => {
    const chart = c3.generate(chartConfiguration);
    setPlayersChart(chart);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // Append new player counts to team indexes
    const newPlayerCounts = gamePlayerCounts;

    if (currentPhase !== 0) {
      teams.forEach((team, index) => {
        newPlayerCounts[index].push(team.playerCount); // Append next phase player count
      });
    }

    setGamePlayerCounts(newPlayerCounts);

    // Load new data
    playersChart?.load({
      columns: [
        ['x', ...Array.from(Array(currentPhase).keys())],
        ...newPlayerCounts,
      ] as [string, ...c3.Primitive[]][],
    });

    // Prevents graphical issues on replay
    playersChart?.flush();

    const newHighestPlayerCount = getHighestPlayerCount();

    // Set grid lines to middle and top of graph
    const quotient = Math.floor(highestPlayerCount / 2);
    const intervalAmount = highestPlayerCount / 10;
    const newYGridLines = [
      { value: quotient },
      { value: highestPlayerCount + intervalAmount },
    ];

    // Load new grid lines
    playersChart?.ygrids(newYGridLines);

    setHighestPlayerCount(newHighestPlayerCount);
  }, [playersChart, currentPhase]); // eslint-disable-line react-hooks/exhaustive-deps

  return <div id='players-line-chart' />;
};

export default PlayersChart;
