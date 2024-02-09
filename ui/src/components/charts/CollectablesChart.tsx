import { Box } from '@mui/material';
import * as c3 from 'c3';
import 'c3/c3.min.css';
import { useEffect, useState } from 'react';
import {
  COLLECTABLES_MAX_SPAWN_NUMBER,
  COLLECTABLES_PLENTIFUL,
  COLLECTABLES_SCARCE,
  getCollectableChartColour,
} from '~/utils/chart-utils';

import './chartStyles.css';

interface CollectablesChartProps {
  collectablesCount: number;
}

const CollectablesChart = ({ collectablesCount }: CollectablesChartProps) => {
  const [collectablesChart, setCollectablesChart] = useState<c3.ChartAPI>();

  const chartConfiguration: c3.ChartConfiguration = {
    bindto: '#collectables-bar-chart',
    axis: {
      y: { show: false },
      y2: {
        max: COLLECTABLES_MAX_SPAWN_NUMBER,
        show: true,
      },
      x: {
        label: {
          text: 'Collectables',
          position: 'outer-center',
        },
      },
    },
    data: {
      axes: {
        Collectables: 'y2',
      },
      columns: [['Collectables', collectablesCount]],
      type: 'bar',
      colors: {
        Collectables: (d: c3.DataPoint | c3.DataSeries | string) => {
          const { value } = d as c3.DataPoint;

          return getCollectableChartColour(value);
        },
      },
    },
    grid: {
      y: {
        lines: [
          {
            axis: 'y2',
            position: 'middle',
            text: COLLECTABLES_SCARCE.text,
            value: COLLECTABLES_SCARCE.count,
          } as c3.GridLineOptionsWithAxis,
          {
            axis: 'y2',
            position: 'middle',
            text: COLLECTABLES_PLENTIFUL.text,
            value: COLLECTABLES_PLENTIFUL.count,
          } as c3.GridLineOptionsWithAxis,
        ],
      },
    },
    legend: { hide: true },
    transition: { duration: 400 },
  };

  useEffect(() => {
    const chart = c3.generate(chartConfiguration);
    setCollectablesChart(chart);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    collectablesChart?.load({
      columns: [['Collectables', collectablesCount]],
    });
  }, [collectablesChart, collectablesCount]);

  return (
    <Box sx={{ height: '43rem', mt: 5 }}>
      <svg id='collectables-bar-chart' height='100%' width='100%' />
    </Box>
  );
};

export default CollectablesChart;
