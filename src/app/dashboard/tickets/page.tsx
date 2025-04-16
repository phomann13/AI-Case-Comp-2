
import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';

import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { getIssueIds, getAllTickets, getTicketsByAssigned } from '@/hooks/get-methods';
import { TicketTable } from '@/components/dashboard/tickets/ticket-table';
import {Box, ButtonGroup, Grid} from '@mui/material';
import DashboardPage from '@/components/ticketMonitoring/dashboard';
import { BarChart } from '@/components/ticketMonitoring/barChartCounts';
export const metadata = { title: `Tickets | Dashboard | ${config.site.name}` } satisfies Metadata;


export default async function Page(): Promise<React.JSX.Element> {
  const page = 0;
  const rowsPerPage = 5;
  const issueIds = await getIssueIds();
  const tickets = await getAllTickets();
  const ticketsByAssigned = await getTicketsByAssigned();
  // console.log(ticketsByAssigned);
  return (
    <Box>
      <div>
        <h1>Ticket Monitoring</h1>
      </div>
      <Grid container spacing={3}>  </Grid>
      <DashboardPage tickets={tickets}/>
     {/* <BarChart tickets={ticketsByAssigned}/> */}
    </Box>
    
  );
}

