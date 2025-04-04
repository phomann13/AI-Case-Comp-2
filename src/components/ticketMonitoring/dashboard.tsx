'use client'
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button, Box, Typography, Grid } from '@mui/material';
import { Sales } from '../dashboard/overview/sales';
import { BarChart } from './barChartCounts';
import { Issue } from '@prisma/client';
import { Histogram } from './histogram';
const DashboardPage = ({tickets}: {tickets: Issue[]}) => {
  const [filter, setFilter] = useState('assignee');
  const [data, setData] = useState([]); // State to hold data based on the selected filter
  const [counts, setCounts] = useState<any>({});
  const [averageResolutionTime, setAverageResolutionTime] = useState<any>({});
  // console.log(tickets);
  useEffect(() => {
    if (tickets && tickets.length > 0) {
      const counts:any = {};
      const keys = Array.from(new Set(tickets.map((ticket: any) => ticket[filter])));
      tickets.forEach((ticket: any) => {
        const key = ticket[filter];
        counts[key] = (counts[key] || 0) + 1;
      });
      setCounts(counts);
      
      //Response time
      const responseTime:any = {};
      tickets.forEach((ticket: any) => {
        const key = ticket[filter];
        const time = ticket.timeToResolution;
        if (!responseTime[key]) {
          responseTime[key] = { total: 0, count: 0 };
        }
        responseTime[key].total += time;
        responseTime[key].count += 1;
      });
      console.log(responseTime);
      const averageResponseTime:any = {};
      for (const key in responseTime) {
        averageResponseTime[key] = ((responseTime[key].total / responseTime[key].count) / 60).toFixed(2);
      }
      setAverageResolutionTime(averageResponseTime);
    }
  }, [tickets, filter]);
  
 


  return (
    <div>
      <ButtonGroup>
        <Button onClick={() => setFilter('source')}>By Source</Button>
        <Button onClick={() => setFilter('status')}>By Status</Button>
        <Button onClick={() => setFilter('priority')}>By Priority</Button>
        <Button onClick={() => setFilter('region')}>By Region</Button>
        <Button onClick={() => setFilter('assignee')}>By Assignee</Button>
        <Button onClick={() => setFilter('issueType')}>By Issue Type</Button>
        <Button onClick={() => setFilter('causeOfIssue')}>By Cause of Issue</Button>
        <Button onClick={() => setFilter('requestType')}>By Request Type</Button>
      </ButtonGroup>
      <Box>
        <Typography variant="h6">
          {filter}
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {/* Ticket counts */}
        <Grid lg={12} xs={12}>
          <BarChart tickets={counts} title="Ticket Counts" dataType="tickets"/>
        </Grid>
        {/* Average response time */}
        <Grid lg={12} xs={12}>
          <BarChart tickets={averageResolutionTime} title="Average Time to Resolution" dataType="minutes"/>
        </Grid>
        {/* Histogram */}
        <Grid lg={12} xs={12}>
          <Histogram tickets={counts} title="Ticket Counts" dataType="tickets"/>
        </Grid>
        
      </Grid>
    </div>
  );
};

export default DashboardPage;