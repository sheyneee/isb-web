import React, { useEffect } from 'react';
import axios from 'axios'; // Assuming you will use this to fetch document request history

const Chatbotresponses = ({ inputMessage, addMessage }) => {
  useEffect(() => {
    if (inputMessage) {
      handleBotResponse(inputMessage);
    }
  }, [inputMessage]);

  const handleBotResponse = async (message) => {
    let responseText = '';

    // Check for specific keywords in the user's message
    if (message.toLowerCase().includes('document request history')) {
      // Simulate an API call to fetch document request history
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_API_KEY}/api/document-requests/history/${user._id}`);
        const documentHistory = response.data;

        if (documentHistory.length > 0) {
          responseText = 'Here is your document request history:\n';
          documentHistory.forEach((doc, index) => {
            responseText += `${index + 1}. ${doc.type} - ${doc.status} - ${new Date(doc.date).toLocaleDateString()}\n`;
          });
        } else {
          responseText = 'You have no document request history.';
        }
      } catch (error) {
        responseText = 'There was an error fetching your document request history. Please try again later.';
      }
    } else {
      // Default response for other inputs
      responseText = "I'm not sure how to respond to that. Could you please rephrase?";
    }

    // Add the bot's response to the message list in the parent component
    addMessage('bot', responseText);
  };

  return null; // No UI to render, it's just for handling responses
};

export default Chatbotresponses;
