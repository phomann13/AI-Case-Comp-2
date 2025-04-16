'use client'
import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button, Box, Typography, Grid } from '@mui/material';
import { Sales } from '../dashboard/overview/sales';
import { BarChart } from './barChartCounts';
import { Issue } from '@prisma/client';
import { Histogram } from './histogram';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const DashboardPage = ({tickets}: {tickets: Issue[]}) => {
  const [filter, setFilter] = useState('assignee');
  const [data, setData] = useState([]); // State to hold data based on the selected filter
  const [counts, setCounts] = useState<any>({});
  const [averageResolutionTime, setAverageResolutionTime] = useState<any>({});
  const [averageFirstResponseTime, setAverageFirstResponseTime] = useState<any>({});
  const [startDate, setStartDate] = useState<any>(new Date('2024-04-15'));
  const [endDate, setEndDate] = useState<any>(new Date('2024-04-31'));
  // console.log(tickets);
  useEffect(() => {
    console.log(new Date(tickets[0].created));
    console.log(startDate);
    console.log(new Date(endDate));
    const filteredTickets = tickets.filter((ticket: any) => new Date(ticket.created) >= new Date(startDate) && new Date(ticket.created) <= new Date(endDate));
    console.log(filteredTickets);
    if (filteredTickets && filteredTickets.length > 0) {
      const counts:any = {};
      const keys = Array.from(new Set(filteredTickets.map((ticket: any) => ticket[filter])));
      console.log(keys);
      filteredTickets.forEach((ticket: any) => {
        const key = ticket[filter];
        counts[key] = (counts[key] || 0) + 1;
      });
      setCounts(counts);
      
      //Response time
      const responseTime:any = {};
      filteredTickets.forEach((ticket: any) => {
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
      console.log(averageResponseTime);
      setAverageResolutionTime(averageResponseTime);

      //Average time to first response
      const firstResponseTime:any = {};
      filteredTickets.forEach((ticket: any) => {
        const key = ticket[filter];
        const time = ticket.timeToFirstResponse;
        if (!firstResponseTime[key]) {
          firstResponseTime[key] = { total: 0, count: 0 };
        }
        firstResponseTime[key].total += time;
        firstResponseTime[key].count += 1;
      });
      console.log(firstResponseTime);
      const averageFirstResponseTime:any = {};
      for (const key in firstResponseTime) {
        averageFirstResponseTime[key] = ((firstResponseTime[key].total / firstResponseTime[key].count) / 60).toFixed(2);
      }
      console.log(averageFirstResponseTime);
      setAverageFirstResponseTime(averageFirstResponseTime);
      
    }
  }, [tickets, filter, startDate, endDate]);
  
 


  return (
    <div>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <ButtonGroup>
          <Button onClick={() => setFilter('source')} variant={filter === 'source' ? 'contained' : 'outlined'}>By Source</Button>
          <Button onClick={() => setFilter('status')} variant={filter === 'status' ? 'contained' : 'outlined'}>By Status</Button>
        <Button onClick={() => setFilter('priority')} variant={filter === 'priority' ? 'contained' : 'outlined'}>By Priority</Button>
        <Button onClick={() => setFilter('region')} variant={filter === 'region' ? 'contained' : 'outlined'}>By Region</Button>
        <Button onClick={() => setFilter('assignee')} variant={filter === 'assignee' ? 'contained' : 'outlined'}>By Assignee</Button>
        <Button onClick={() => setFilter('issueType')} variant={filter === 'issueType' ? 'contained' : 'outlined'}>By Issue Type</Button>
        <Button onClick={() => setFilter('causeOfIssue')} variant={filter === 'causeOfIssue' ? 'contained' : 'outlined'}>By Cause of Issue</Button>
        <Button onClick={() => setFilter('requestType')} variant={filter === 'requestType' ? 'contained' : 'outlined'}>By Request Type</Button>
      </ButtonGroup>
      </Box>
      <Grid container spacing={2} sx={{mt: 2}}>
        <Grid lg={12} xs={12} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <DatePicker defaultValue={dayjs('2024-04-15')} onChange={(date) => setStartDate(date)} /> <Typography variant="h6" sx={{mx: 2}}>-</Typography> <DatePicker defaultValue={dayjs('2024-04-31')} onChange={(date) => setEndDate(date)} />
        </Grid>
        {/* Ticket counts */}
        <Grid lg={12} xs={12}>
          <BarChart tickets={counts} title="Ticket Counts" dataType="tickets" />
        </Grid>
        {/* Average response time */}
        <Grid lg={12} xs={12}>
          <BarChart tickets={averageResolutionTime} title="Average Time to Resolution" dataType="minutes"/>
        </Grid>
        {/* Histogram */}
        <Grid lg={12} xs={12}>
          {/* <Histogram tickets={counts} title="Ticket Counts" dataType="tickets"/> */}
          <BarChart tickets={averageFirstResponseTime} title="Average Time to First Response" dataType="minutes"/>
        </Grid>
        
      </Grid>
    </div>
  );
};

export default DashboardPage;