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
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Customer } from '@/components/dashboard/customer/customers-table';
import { getIssueIds } from '@/hooks/get-methods';

export const metadata = { title: `Customers | Dashboard | ${config.site.name}` } satisfies Metadata;

const customers = [
  {
    id: 'USR-010',
    name: 'Alcides Antonio',
    avatar: '/assets/avatar-10.png',
    email: 'alcides.antonio@example.io',
    phone: '908-691-3242',
    address: { city: 'Alexandria', country: 'USA', state: 'Virginia', street: '4158 Hedge Street' },
    createdAt: dayjs().subtract(2, 'months').toDate(),
    ticketIds:['SO153494','SO153490 ','SO153491','SO153492','SO153493','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-009',
    name: 'Marcus Finn',
    avatar: '/assets/avatar-9.png',
    email: 'marcus.finn@example.io',
    phone: '415-907-2647',
    address: { city: 'Reston', country: 'USA', state: 'Virginia', street: '2188 Armbrester Drive' },
    createdAt: dayjs().subtract(2, 'hours').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-008',
    name: 'Jie Yan',
    avatar: '/assets/avatar-8.png',
    email: 'jie.yan.song@example.io',
    phone: '770-635-2682',
    address: { city: 'Washington', country: 'USA', state: 'DC', street: '4894 Lakeland Park Drive' },
    createdAt: dayjs().subtract(2, 'days').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-007',
    name: 'Nasimiyu Danai',
    avatar: '/assets/avatar-7.png',
    email: 'nasimiyu.danai@example.io',
    phone: '801-301-7894',
    address: { city: 'College Park', country: 'USA', state: 'MD', street: '368 Lamberts Branch Road' },
    createdAt: dayjs().subtract(9, 'hours').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-006',
    name: 'Iulia Albu',
    avatar: '/assets/avatar-6.png',
    email: 'iulia.albu@example.io',
    phone: '313-812-8947',
    address: { city: 'Greenbelt', country: 'USA', state: 'MD', street: '3934 Wildrose Lane' },
    createdAt: dayjs().subtract(90, 'hours').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-005',
    name: 'Fran Perez',
    avatar: '/assets/avatar-5.png',
    email: 'fran.perez@example.io',
    phone: '712-351-5711',
    address: { city: 'Silver Spring', country: 'USA', state: 'MD', street: '1865 Pleasant Hill Road' },
    createdAt: dayjs().subtract(1, 'days').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },

  {
    id: 'USR-004',
    name: 'Penjani Inyene',
    avatar: '/assets/avatar-4.png',
    email: 'penjani.inyene@example.io',
    phone: '858-602-3409',
    address: { city: 'Sterling', country: 'USA', state: 'VA', street: '317 Angus Road' },
    createdAt: dayjs().subtract(10, 'days').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-003',
    name: 'Carson Darrin',
    avatar: '/assets/avatar-3.png',
    email: 'carson.darrin@example.io',
    phone: '304-428-3097',
    address: { city: 'Washington', country: 'USA', state: 'DC', street: '2849 Fulton Street' },
    createdAt: dayjs().subtract(10, 'days').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-002',
    name: 'Siegbert Gottfried',
    avatar: '/assets/avatar-2.png',
    email: 'siegbert.gottfried@example.io',
    phone: '702-661-1654',
    address: { city: 'Washington', country: 'USA', state: 'DC', street: '1798 Hickory Ridge Drive' },
    createdAt: dayjs().subtract(15, 'days').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
  {
    id: 'USR-001',
    name: 'Miron Vitold',
    avatar: '/assets/avatar-1.png',
    email: 'miron.vitold@example.io',
    phone: '972-333-4106',
    address: { city: 'Columbia', country: 'USA', state: 'MD', street: '75247 17th Avenue' },
    createdAt: dayjs().subtract(20, 'days').toDate(),
    ticketIds:['SO123494','SO1490 ','SO153491','SO153492','SO153443','SO153494','SO153495','SO153496','SO153497','SO153498','SO153499','SO153500']
  },
] satisfies Customer[];

export default async function Page(): Promise<React.JSX.Element> {
  const page = 0;
  const rowsPerPage = 5;
  const issueIds = await getIssueIds();
  const paginatedCustomers = applyPagination(customers, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Customers</Typography>
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
      <CustomersTable
        count={paginatedCustomers.length}
        page={page}
        rows={paginatedCustomers}
        rowsPerPage={rowsPerPage}
        issueIds={issueIds}
      />
    </Stack>
  );
}

function applyPagination(rows: Customer[], page: number, rowsPerPage: number): Customer[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
