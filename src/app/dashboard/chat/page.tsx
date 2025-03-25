'use client';

import * as React from 'react';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function Chat(): React.JSX.Element {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [sessionId, setSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Load the session ID from local storage or initialize a new one
    let storedSessionId = localStorage.getItem('sessionId');
    if (!storedSessionId) {
      storedSessionId = crypto.randomUUID(); // Generate new session ID
      localStorage.setItem('sessionId', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage: Message = { sender: 'user', text: inputValue };
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');

      // Send the user's message to the API with session ID
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'session-id': sessionId || '',
          },
          body: JSON.stringify({ message: inputValue }),
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
        alert(companyInformation);
        setMessages((prev) => [...prev, clientResponse]);
      } catch (error) {
        console.error('Error:', error);
        const errorMessage: Message = { sender: 'bot', text: 'Sorry, there was an error.' };
        setMessages((prev) => [...prev, errorMessage]);
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  React.useEffect(() => {
    const message = new URLSearchParams(window.location.search).get('message');
    if (message) {
      setInputValue(decodeURIComponent(message));
      handleSendMessage();
    }
  }, []);

  return (
    <Box sx={{ padding: 3, maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Chat with our AI Assistant!</Typography>
      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: 2, height: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <Box key={index} sx={{ marginBottom: 1, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <Typography variant="body1" sx={{ backgroundColor: msg.sender === 'user' ? '#d1e7dd' : '#f8d7da', borderRadius: '8px', padding: 1 }}>
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>
      <Stack direction="row" spacing={1} sx={{ marginTop: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Type your message..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
        />
        <Button variant="contained" onClick={handleSendMessage}>Send</Button>
      </Stack>
    </Box>
  );
}
