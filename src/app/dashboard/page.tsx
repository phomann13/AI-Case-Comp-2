import * as React from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';

import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import { getSources, getStatuses, getTickets, inProgressTickets, getTicketsByPriority } from '@/hooks/get-methods';
import { Status } from '@/components/dashboard/overview/status';
export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default async function Page(): Promise<React.JSX.Element> {
  const sources:any = await getSources();
  const statuses:any = await getStatuses();
  const tickets:any = await getTickets();
  const ipTickets:any = await inProgressTickets();
  const priorityTickets:any = await getTicketsByPriority();
  return (
    <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
        <Status diff={0} trend="up" sx={{ height: '100%' }} value={statuses['Open']} title="Open Tickets" icon={'open'} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
      <Status diff={0} trend="up" sx={{ height: '100%' }} value={statuses['Closed']} title="Closed Tickets" icon={'close'} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
      <Status diff={0} trend="up" sx={{ height: '100%' }} value={(ipTickets['Agent'])} title="Need to respond" icon={'waiting'} />
      </Grid>
      <Grid lg={3} sm={6} xs={12}>
      <Status diff={0} trend="up" sx={{ height: '100%' }} value={(ipTickets['Client'])} title="Waiting on Client Response" icon={'waiting'} />
      </Grid>
      <Grid lg={8} xs={12}>
        <Sales
          chartSeries={[
            { name: '2025', data: tickets['2025'] },
            { name: '2024', data: tickets['2024'] },
            { name: '2023', data: tickets['2023'] },
            { name: '2022', data: tickets['2022'] },
            { name: '2021', data: tickets['2021'] },
            { name: '2020', data: tickets['2020'] },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        
        <Traffic chartSeries={[(sources['Email to Jira']), (sources['Portal']), (sources['Phone']), (sources['Forwarded by Staff (Phone or Email)'])]} labels={['Email to Jira', 'Portal', 'Phone', 'Forwarded by Staff']} sx={{ height: '100%' }} />
      </Grid>
      <Grid lg={4} md={6} xs={12}>
        <LatestProducts
          products={[
            {
              id: 'PRD-005',
              name: 'Soja & Co. Eucalyptus',
              image: '/assets/product-5.png',
              updatedAt: dayjs().subtract(18, 'minutes').subtract(5, 'hour').toDate(),
            },
            {
              id: 'PRD-004',
              name: 'Necessaire Body Lotion',
              image: '/assets/product-4.png',
              updatedAt: dayjs().subtract(41, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-003',
              name: 'Ritual of Sakura',
              image: '/assets/product-3.png',
              updatedAt: dayjs().subtract(5, 'minutes').subtract(3, 'hour').toDate(),
            },
            {
              id: 'PRD-002',
              name: 'Lancome Rouge',
              image: '/assets/product-2.png',
              updatedAt: dayjs().subtract(23, 'minutes').subtract(2, 'hour').toDate(),
            },
            {
              id: 'PRD-001',
              name: 'Erbology Aloe Vera',
              image: '/assets/product-1.png',
              updatedAt: dayjs().subtract(10, 'minutes').toDate(),
            },
          ]}
          sx={{ height: '100%' }}
        />
      </Grid>
      <Grid lg={8} md={12} xs={12}>
        <LatestOrders
          orders={priorityTickets.map((ticket:any) => ({
            id: ticket.issueId,
            email: ticket.reporterEmail,
            amount: ticket.priorityScore,
            status: ticket.status,
            createdAt: ticket.created,
          }))}
          sx={{ height: '100%' }}
        />
      </Grid>
    </Grid>
  );
}
