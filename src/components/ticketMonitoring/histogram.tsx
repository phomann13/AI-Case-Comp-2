'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';
import ButtonGroup from '@mui/material/ButtonGroup';
import { ContactlessOutlined } from '@mui/icons-material';

export interface HistogramProps {
  tickets: { [key: string]: number };
  sx?: SxProps;
  title: string;
  dataType: string;
}

export function Histogram({ tickets, sx, title, dataType  }: HistogramProps): React.JSX.Element {
  
  
  const chartOptions = useChartOptions(tickets, dataType);
  // console.log(tickets.map(ticket => ticket.assignee == null ? 'Unassigned' : ticket.assignee))
  const [transformedSeries, setTransformedSeries] = useState<{ name: string; data: { x: string; y: number }[] }[]>([]);
   // Removed selectedYears as it was not defined
   useEffect(() => {
    console.log(Object.keys(tickets));
    const transformedData = Object.entries(tickets).map(([key, value]) => ({
      x: key === 'null' || key === null ? 'Unknown' : key,
      y: value,
    }));

    setTransformedSeries([{ name: title, data: transformedData }]);
   }, [tickets]);
  //  console.log(transformedSeries)

  // Check if transformedSeries has valid data before rendering the Chart
  if (transformedSeries.length === 0 || !transformedSeries[0].data.length) {
    return <div>No data available</div>; // Handle empty data case
  }

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Sync
          </Button>
        }
        title={title}
      />
      
      <CardContent>
        
        <Chart height={350} options={chartOptions} series={transformedSeries} type="histogram" width="100%" />
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />} size="small">
          Overview
        </Button>
      </CardActions>
    </Card>
  );
}

function useChartOptions(tickets: { assignee: string; _count: { _all: number } }[], dataType: string): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: false, toolbar: { show: false } },
    colors: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.25)],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: { show: false },
    plotOptions: { bar: { columnWidth: '40px' } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: Object.keys(tickets).map(key => key === 'null' || key === null ? 'Unknown' : key),
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value: number) => (value > 0 ? `${value} ${dataType}` : `${value} ${dataType}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },

      },
    },
  };
}
