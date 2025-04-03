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
import { getIssueIds, getAllTickets } from '@/hooks/get-methods';
import { TicketTable } from '@/components/dashboard/tickets/ticket-table';
export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;



export default async function Page(): Promise<React.JSX.Element> {
  const page = 0;
  const rowsPerPage = 5;
  const issueIds = await getIssueIds();
  const tickets = await getAllTickets();
  const paginatedTickets = applyPagination(tickets, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Tickets</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <TicketTable
        count={paginatedTickets.length}
        page={page}
        rows={paginatedTickets}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: any[], page: number, rowsPerPage: number): any[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
