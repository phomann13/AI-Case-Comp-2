'use client';

import { useState, useEffect } from 'react';
import {Button, Card, Input, TextField, Grid, Snackbar, Typography, Select, MenuItem} from '@mui/material';


interface Message {
    sender: 'user' | 'bot';
    text: string;
  }
export default function EmailingPage() {
  const [loading, setLoading] = useState(false);
  const [chatResponses, setChatResponses] = useState<string[]>([]);
  const [followUpMessage, setFollowUpMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [aiResponse, setAiResponse] = useState<any>({});
  const [formData, setFormData] = useState({
    summary: '',
    email: '',
    description: '',
    cause: '',
    region: '',
    requestType: '',
    source: '',
  });
  const [sessionId, setSessionId] =useState<string | null>(null);

  useEffect(() => {
    // Load the session ID from local storage or initialize a new one
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID(); // Generate new session ID
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);
  const causeOptions = [
    'Request of Customer Relations',
    'Other',
    'Partner Error',
    'Partner Knowledge/Training',
    'Menu Discrepancy',
    'Ops Issue',
    'System Error'
  ];

  const requestTypes = [
    'Email Request',
    'Request A Return or Refund',
    'Request Produce',
    'Questions about Shopping Menu Items',
    'Revise My Order',
    'Billing Support',
    'Pickup & Delivery Support',
    'General Questions',
    'Request New Shopper Access',
    'Website Assistance (PartnerLink)',
    'Grant Support',
    'Provide Menu Feedback',
    'Provide Operations/Transportation Feedback'
  ];

  const sourceOptions = [
    'Email to Jira',
    'Portal',
    'Phone'
  ];

  const regionOptions = ['DC', 'MD', 'VA'];

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionId || '',
        },
        body: JSON.stringify({
          message: `
              Summary: ${formData.summary}
              Description: ${formData.description}
              Email: ${formData.email}
              Cause: ${formData.cause}
              Region: ${formData.region}
              Request Type: ${formData.requestType}
              Source: ${formData.source}
            `
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // If a new session ID is returned, store it in local storage and update state
      if (data.sessionId && data.sessionId !== sessionId) {
        localStorage.setItem('sessionId', data.sessionId);
        setSessionId(data.sessionId);
      }

      const botMessage: Message = { sender: 'bot', text: data.reply };

      const companyInformation = botMessage.text.split('COMPANY INFORMATION:')[1];
      const clientResponse = botMessage.text.split('COMPANY INFORMATION:')[0];
      const priorityScore = companyInformation.split('Priority Score:')[1].split('\n')[0];
      const actionDate = companyInformation.split('Action Date:')[1].split('\n')[0];
      const customerName = companyInformation.split('Customer Name:')[1].split('\n')[0];
      const contact = companyInformation.split('Contact:')[1].split('\n')[0];
      const issueType = companyInformation.split('Issue Type:')[1].split('\n')[0];
      const urgency = companyInformation.split('Urgency:')[1].split('\n')[0];
      const orderNumber = companyInformation.split('Order Number:')[1].split('\n')[0];
      const comments = companyInformation.split('Comments:')[1].split('\n')[0];
      
      const newAIResponse = {
        customerName: customerName ? customerName : '',
        contact: contact ? contact : '',
        issueType: issueType ? issueType : '',
        urgency: urgency ? urgency : '',
        orderNumber: orderNumber ? orderNumber : '',
        comments: comments ? comments : '',
        priorityScore:  priorityScore === '' || priorityScore === null ? 0 : parseFloat(priorityScore) ? parseFloat(priorityScore) : 0,
        actionDate: actionDate ? actionDate : ''
      }
      setAiResponse(aiResponse);
      const response2 = await fetch('/api/log_response', {
        method: 'POST',
        body: JSON.stringify(newAIResponse)
      })
      const data2 = await response2.json();
      console.log(data2);
      setChatResponses(prev => [...prev, clientResponse, companyInformation]);
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('Submission failed. Please try again.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!followUpMessage.trim()) return;
    setLoading(true);
    console.log(sessionId);
    // return;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'session-id': sessionId || '',
        },
        body: JSON.stringify({
          message: followUpMessage
        }),
      });

      const data = await response.json();
      const botMessage: Message = { sender: 'bot', text: data.reply };
      const companyInformation = botMessage.text.split('COMPANY INFORMATION:')[1];
      const clientResponse = botMessage.text.split('COMPANY INFORMATION:')[0];
      const priorityScore = companyInformation.split('Priority Score:')[1].split('\n')[0];
      const actionDate = companyInformation.split('Action Date:')[1].split('\n')[0];
      const customerName = companyInformation.split('Customer Name:')[1].split('\n')[0];
      const contact = companyInformation.split('Contact:')[1].split('\n')[0];
      const issueType = companyInformation.split('Issue Type:')[1].split('\n')[0];
      const urgency = companyInformation.split('Urgency:')[1].split('\n')[0];
      const orderNumber = companyInformation.split('Order Number:')[1].split('\n')[0];
      const comments = companyInformation.split('Comments:')[1].split('\n')[0];
      console.log(priorityScore);
      const newAIResponse = {
        customerName: customerName ? customerName : '',
        contact: contact ? contact : '',
        issueType: issueType ? issueType : '',
        urgency: urgency ? urgency : '',
        orderNumber: orderNumber ? orderNumber : '',
        comments: comments ? comments : '',
        priorityScore: priorityScore === '' || priorityScore === null ? 0 : parseFloat(priorityScore) ? parseFloat(priorityScore) : 0,
        actionDate: actionDate ? actionDate : ''
      }
      setAiResponse(aiResponse);
      const response2 = await fetch('/api/log_response', {
        method: 'POST',
        body: JSON.stringify(newAIResponse)
      })
      const data2 = await response2.json();
      console.log(data2);
      setChatResponses(prev => [...prev, clientResponse, companyInformation]);
      setFollowUpMessage('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="container mx-auto p-6 max-w-4xl">
              <Button 
        onClick={() => {
          // Fill in the scenario
          setFollowUpMessage(''); // Clear follow-up message if needed
          // Set form values
          const formValues = {
            summary: 'Produce Request S016345',
            email: 'Jane@gmail.com',
            description: 'PLEASE ADD AVAILABLE VEGETABLES TO OUR ORDER. WE ARE EXPECTING APPROXIMATELY 320 FAMILIES. THANK YOU.',
            cause: 'Request of Customer Relations',
            region: 'MD',
            requestType: 'Request Produce',
            source: 'Email to Jira'
          };
          // Update the state for each field
          setChatResponses([]); // Clear previous responses if needed
          setFollowUpMessage(''); // Clear follow-up message if needed
          // Assuming you have state variables for each field
          setFormData(formValues);
        }}
        className="mb-4"
      >
        Fill Scenario 1
      </Button>
      <Button 
        onClick={() => {
          // Fill in the scenario
          setFollowUpMessage(''); // Clear follow-up message if needed
          // Set form values
          const formValues = {
            summary: 'Please move from 6/12 to 6/13',
            email: 'peter.piper@gmail.com',
            description: 'Greetings. Please move pick up my order from 6/12 to 6/13. We prefer a 10 AM pick up on 6/13 (Thursday). Thanks!  Peter',
            cause: 'Request of Customer Relations',
            region: 'DC',
            requestType: 'Revise My Order',
            source: 'Email to Jira'
          };
          // Update the state for each field
          setChatResponses([]); // Clear previous responses if needed
          setFollowUpMessage(''); // Clear follow-up message if needed
          // Assuming you have state variables for each field
          setFormData(formValues);
        }}
        className="mb-4"
      >
        Fill Scenario 2
      </Button>
      <Typography variant="h4" className="mb-6">Support Request Form</Typography>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Input
              name="summary"
              placeholder="Summary"
              required
              className="w-full"
              fullWidth
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full"
              fullWidth
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} className='w-full'>
            <TextField
              name="description"
              placeholder="Description"
              required
              className="w-full"
              multiline
              rows={4}
              fullWidth
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>

          
          <Grid item xs={12}>
            <Select
              name="cause"
              required
              fullWidth
              displayEmpty
              value={formData.cause}
              onChange={(e) => setFormData({ ...formData, cause: e.target.value })}
            >
              <MenuItem value="" disabled>
                Select Cause of Issue
              </MenuItem>
              {causeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Select
              name="region"
              required
              fullWidth
              displayEmpty
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
            >
              <MenuItem value="" disabled>
                Select Region
              </MenuItem>
              {regionOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Select
              name="requestType"
              required
              fullWidth
              displayEmpty
              value={formData.requestType}
              onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
            >
              <MenuItem value="" disabled>
                Select Request Type
              </MenuItem>
              {requestTypes.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12}>
            <Select
              name="source"
              required
              fullWidth
              displayEmpty
                value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            >
              <MenuItem value="" disabled>
                Select Source
              </MenuItem>
              {sourceOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        <Button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </form>

      {chatResponses.length > 0 && (
        <div className="mt-8 space-y-4">
          {chatResponses.map((response, index) => (
            <Card 
              key={index} 
              className="p-4"
            >
              <p 
                className="whitespace-pre-wrap"
              >
                {response}
              </p>
            </Card>
          ))}

            <TextField
              value={followUpMessage}
              onChange={(e) => setFollowUpMessage(e.target.value)}
              placeholder="Type your follow-up message..."
              className="w-full"
            />
            <Button 
              onClick={handleFollowUp}
              disabled={loading || !followUpMessage.trim()}
            >
              {loading ? 'Sending...' : 'Send Follow-up'}
            </Button>
          </div>
      )}

      

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </div>
  );
}
