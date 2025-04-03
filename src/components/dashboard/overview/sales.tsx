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

export interface SalesProps {
  chartSeries: { name: string; data: { created: string }[] }[];
  sx?: SxProps;
}

export function Sales({ chartSeries, sx }: SalesProps): React.JSX.Element {
  // Transform the date-based data into the required format
  console.log(chartSeries);
  // chartSeries.map(series => {
  //   series.data.map((value, index) => {
  //     console.log(value['created']);
  //   });
  // });
  
  // console.log(transformedSeries);
  const chartOptions = useChartOptions();
  const [selectedYears, setSelectedYears] = useState<{ [key: string]: boolean }>({'2025': true});
  const handleSelectedYears = (year: string) => {
    setSelectedYears(prev => ({ ...prev, [year]: !prev[year] }));
  };
  const [transformedSeries, setTransformedSeries] = useState<{ name: string; data: { x: string; y: number }[] }[]>([]);
  useEffect(() => {
    const transformedSeries = chartSeries.map(series => {
      if (selectedYears[series.name]) {
        return {
          name: series.name,
          data: series.data.reduce((acc, value) => {
            const month = new Date(value['created']).toLocaleString('default', { month: 'long' }).substring(0, 3);
            const existingMonth = acc.find(item => item.x === month);
            if (existingMonth) {
              existingMonth.y += 1; // Increment the count for the existing month
            } else {
              acc.push({ x: month, y: 1 }); // Initialize count for the new month
            }
            return acc;
          }, []),
        };
      }
      return null;
    });
    setTransformedSeries(transformedSeries.filter(Boolean));
  }, [chartSeries, selectedYears]);
  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Button color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
            Sync
          </Button>
        }
        title="Tickets"
      />
      
      <CardContent>
        <ButtonGroup>
          <Button variant={selectedYears['2025'] ? 'contained' : 'outlined'} onClick={() => handleSelectedYears('2025')}>2025</Button>
          <Button variant={selectedYears['2024'] ? 'contained' : 'outlined'} onClick={() => handleSelectedYears('2024')}>2024</Button>
          <Button variant={selectedYears['2023'] ? 'contained' : 'outlined'} onClick={() => handleSelectedYears('2023')}>2023</Button>
          <Button variant={selectedYears['2022'] ? 'contained' : 'outlined'} onClick={() => handleSelectedYears('2022')}>2022</Button>
          <Button variant={selectedYears['2021'] ? 'contained' : 'outlined'} onClick={() => handleSelectedYears('2021')}>2021</Button>
          <Button variant={selectedYears['2020'] ? 'contained' : 'outlined'} onClick={() => handleSelectedYears('2020')}>2020</Button>
        </ButtonGroup>
        <Chart height={350} options={chartOptions} series={transformedSeries} type="bar" width="100%" />
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

function useChartOptions(): ApexOptions {
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value > 0 ? `${value}` : `${value}`),
        offsetX: -10,
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
