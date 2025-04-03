'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import { useState } from 'react';

import { useSelection } from '@/hooks/use-selection';
import Grid from '@mui/material/Grid';

function noop(): void {
  // do nothing
}

export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
  ticketIds: string[];
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
  issueIds?: string[];
}

export function CustomersTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  issueIds = [],
}: CustomersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Signed Up</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              const isSelected = selected?.has(row.id);
              const [open, setOpen] = useState(false);

              return (
                <>
                  <TableRow hover key={row.id} selected={isSelected} onClick={() => setOpen(!open)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          if (event.target.checked) {
                            selectOne(row.id);
                          } else {
                            deselectOne(row.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        <Avatar src={row.avatar} />
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      {row.address.city}, {row.address.state}, {row.address.country}
                    </TableCell>
                    <TableCell>{row.phone}</TableCell>
                    <TableCell>{dayjs(row.createdAt).format('MMM D, YYYY')}</TableCell>
                  </TableRow>
                  {open && (
                    <TableRow>
                      <TableCell colSpan={12}>
                        <Grid container sx={{  width: '100%', }}>
                          {issueIds.slice(index * 10, index * 10 + 10).map((ticketId) => (
                            <Grid item xs={3} 
                            style={{ border: '1px solid #e0e0e0', padding: '10px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', flexDirection:'row' }} 
                            key={ticketId} 
                            onClick={() => {
                              window.open(`/dashboard/tickets/${ticketId}`, '_blank');
                            }}
                            >
                              <Typography variant="h6">Issue ID: {ticketId}</Typography>
                              <div><ArrowRightIcon style={{ transform: 'rotate(-45deg)' }} /></div>
                            </Grid>
                          ))}
                        </Grid>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
