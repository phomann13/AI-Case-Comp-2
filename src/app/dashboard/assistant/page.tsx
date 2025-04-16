'use client';
import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import dayjs, { Dayjs } from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { StaticDateRangePicker } from '@mui/x-date-pickers/StaticDateRangePicker';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import ReactMarkdown from 'react-markdown'
import TextField from '@mui/material/TextField';
// export const metadata = { title: `Integrations | Dashboard | ${config.site.name}` } satisfies Metadata;


const shortcutsItems = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

export default function Page(): React.JSX.Element {
  const [fromDate, setFromDate] = React.useState<Dayjs | null>(dayjs('2024-04-05'));
  const [toDate, setToDate] = React.useState<Dayjs | null>(dayjs('2024-04-17'));
  const [insights, setInsights] = React.useState<any>();
    /*### Ticket Information:
- **Issue ID:** 53236
- **Summary:** FISH of Laurel
- **Issue Key:** PART1-5082
- **Issue Type:** [System] Service request
- **Status:** Closed
- **Project:** Partner Support
- **Priority:** Medium
- **Resolution:** Done
- **Assignee:** DH
- **Reporter Email:** gofl@eiunlhdrlrsfaoia.
- **Creator Email:** erfo@snluah.droiilflga
- **Created:** 2024-04-16 11:30:00 UTC
- **Updated:** 2024-04-26 11:35:00 UTC
- **Resolved:** 2024-04-26 07:15:00 UTC
- **Description:** N/A
- **Partner Names:** F. of L.
- **Request Type:** General Questions
- **Request Language:** English
- **Source:** Portal
- **Status Category Changed:** 2024-04-17 09:50:00 UTC
- **Date of First Response:** 1970-01-01 00:00:00 UTC

### Comments:
1. **04/17/2024 06:04:**
   - **User:** "Good morning,
Thank you for reaching out to Customer Service. I have gone ahead and put a request into our Transportation Team to send a driver to pick up your pallets at your location.
Thank you,
"D"
   - **Commenter ID:** 61536ea272f6970069fc1dbd
  
2. **04/17/2024 09:50:**
   - **User:** "Our Transportation Department has reported that a driver will be there around noon to pick up the pallets. Thank you!"
   - **Commenter ID:** 61536ea272f6970069fc1dbd
   
3. **04/26/2024 07:15:**
   - **User:** "Ticket migrated to a new Jira Project. An automation set the Resolution field to Done. This updated the Resolved (a date) field to today's date.  Prior to the migration the Resolve date was not used in metrics."
   - **Commenter ID:** 557058:f58131cb-b67d-43c7-b30d-6b58d40bd077

### Additional Information:
- **Satisfaction Rating:** 0
- **Satisfaction Date:** N/A
- **Time to First Response:** N/A
- **Time to Resolution:** N/A
- **Relevant Departments:** N/A
- **Relevant Departments 1:** N/A
- **Request Category:** N/A
- **Resolution Action:** N/A
- **Priority Score:** 0
- **Category:** Unlabelled
- **Subcategory:** Unlabelled
- **Work Category:** Service Request
- **Status Category:** Done
- **Last Message:** N/A

This ticket seems to have been about coordinating the pick-up of pallets by the Transportation Team. The issue was successfully resolved and closed after the migration to a new Jira Project.*/
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Business Assistant</Typography>
          <LocalizationProvider >
            {/* <StaticDateRangePicker
                slotProps={{
                  shortcuts: {
                    items: shortcutsItems,
                  },
                  actionBar: { actions: [] },
                }}
                calendars={2}
              /> */}
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>  
              <Box sx={{ width: '50%' }}>
                <Typography variant="h6">From</Typography>
                <StaticDatePicker
                slotProps={{
                  actionBar: {
                    actions: ['today'],
                  },

                }} defaultValue={dayjs('2024-04-05')}  onChange={(value) => setFromDate(value)} />
              </Box>
              <Box sx={{ width: '50%' }}>
              <Typography variant="h6">To</Typography>
              <StaticDatePicker slotProps={{
                actionBar: {
                  actions: ['today'],
                },

              }} defaultValue={dayjs('2024-04-17')}  onChange={(value) => setToDate(value)} />
              </Box>
            </Stack>
          </LocalizationProvider>
          <Button variant="contained" color="primary" onClick={() => {
            fetch('/api/insights', {
              method: 'POST',
              body: JSON.stringify({ fromDate: fromDate?.format('YYYY-MM-DD HH:mm:ss.SSS'), toDate: toDate?.format('YYYY-MM-DD HH:mm:ss.SSS') }),
            }).then(res => res.json()).then(data => {
              setInsights(data.reply);
            });
          }}>Get Insights</Button>
        </Stack>

      </Stack>
      {insights && <ReactMarkdown>{insights}</ReactMarkdown>}

    </Stack>
  );
}
