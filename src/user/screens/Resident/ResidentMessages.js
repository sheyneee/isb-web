import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidSend } from 'react-icons/bi'; // Send icon
import { FaSmile } from 'react-icons/fa'; // Emoji icon
import ResidentHeader from '../../../component/Resident/ResidentHeader';
import ResidentNav from '../../../component/Resident/ResidentNav';
import AiAvatar from '../../../assets/images/bot.png'; // Bot avatar
import EmojiPicker from 'emoji-picker-react'; // Emoji picker
import { ChatList } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import io from 'socket.io-client';
import BotResponse from '../../../assets/botresponse/BotResponse'; // Import the BotResponse component

const ResidentMessages = () => {
  const navigate = useNavigate();
  const socketx = useRef(null); // Use ref for socket connection
  const chatWindowRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [residentData, setResidentData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [botMessage, setBotMessage] = useState('');
  const [chatList, setChatList] = useState([]); // For Chat List
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); // For emoji picker visibility
  const [chatmate, setChatmate] = useState({ name: 'Ambot', avatar: AiAvatar }); // Chatmate details
  const [userId, setUserId] = useState(null); // Store socket ID as userId
  const [isChatWithOfficialSelected, setIsChatWithOfficialSelected] = useState(false); // Track if 'Chat with Official' is selected

  useEffect(() => {
    socketx.current = io(process.env.REACT_APP_BACKEND_API_KEY || 'http://localhost:8000'); // Change this to your backend URL
    
    socketx.current.on('connect', () => {
      console.log('Connected with socket ID:', socketx.current.id);
      setUserId(socketx.current.id); // Set socket ID as userId
    });
  
    socketx.current.on('message', (message) => {
      console.log('Incoming message:', message);
      const newMessage = {
        id: Date.now(),
        text: message.text,
        senderName: message.user.name,
        position: message.user._id === 'bot' ? 'left' : 'right', // Determine if message is from bot or user
        createdAt: new Date(message.createdAt),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
      // Only show the buttons if "Chat with Official" has NOT been selected
      if (message.user._id === 'bot') {
        if (!isChatWithOfficialSelected && !message.text.includes('handing off')) {
          // Render buttons after bot message unless "Chat with Official" is selected
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: Date.now(),
              text: '',
              senderName: 'Bot',
              position: 'left',
              component: <BotResponse handleOptionClick={handleOptionClick} />, 
              createdAt: new Date(),
            },
          ]);
        }
      }
    });
  
    return () => {
      socketx.current.disconnect(); // Clean up socket connection on component unmount
    };
  }, [isChatWithOfficialSelected]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserName(`${user.firstName} ${user.middleName ? `${user.middleName[0]}.` : ''} ${user.lastName}`);
      setResidentData(user);
      setUserRole(user.roleinHousehold);
  
      // Send full user data when joining the socket
      socketx.current.emit('join', { userId: user._id, firstName: user.firstName, lastName: user.lastName, role: 'resident' });
    }
  
    // Set initial message from bot including greeting and action buttons
    setMessages([
      {
        id: 1,
        text: 'Hi there! How can I assist you today?',
        senderName: 'Ambot',
        position: 'left',
        createdAt: new Date(),
      },
      {
        id: 2,
        text: '',
        senderName: 'Ambot',
        position: 'left',
        component: <BotResponse handleOptionClick={handleOptionClick} />,
        createdAt: new Date(),
      },
    ]);
  
    setChatList([
      {
        title: 'Ambot',
        subtitle: 'Hi there! How can I assist you today?',
        date: new Date(),
        unread: 0,
        avatar: AiAvatar
      }
    ]);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Emoji Picker Handler
  const onEmojiClick = (event, emojiObject) => {
    setBotMessage(botMessage + emojiObject.emoji);
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible(!emojiPickerVisible);
  };

  const handleSend = () => {
    if (botMessage.trim()) {
      const user = JSON.parse(localStorage.getItem('user')); // Retrieve the user from localStorage
      const userMessage = {
        id: Date.now(),
        text: botMessage,
        user: {
          _id: user._id,  // Pass the user's _id from the stored user data
          name: `${user.firstName} ${user.middleName ? `${user.middleName[0]}.` : ''} ${user.lastName}`,
        },
        createdAt: new Date(),
      };
  
      // Add the message to the messages state
      setMessages((prevMessages) => [...prevMessages, {
        id: Date.now(),
        text: botMessage,
        senderName: user ? `${user.firstName} ${user.middleName ? `${user.middleName[0]}.` : ''} ${user.lastName}` : 'User', 
        position: 'right',
        createdAt: new Date(),
      }]);
  
      // Send the message to the backend via Socket.IO
      socketx.current.emit('message', userMessage);
  
      setBotMessage(''); // Clear input
    }
  };

  const handleOptionClick = (option) => {
    // Retrieve user info from the state
    const user = JSON.parse(localStorage.getItem('user'));
  
    // Handle the user's selection and add the message to the conversation with proper metadata
    setMessages((prevMessages) => [
      ...prevMessages,
      { 
        id: Date.now(), 
        text: `${option}`, 
        senderName: user ? `${user.firstName} ${user.middleName ? `${user.middleName[0]}.` : ''} ${user.lastName}` : 'User', 
        position: 'right', 
        createdAt: new Date() // Attach the current date
      }
    ]);
  
    // Check if the option is 'Chat with Official' and update the state
    if (option === 'Chat with Official') {
      setIsChatWithOfficialSelected(true); // Prevent buttons from rendering
    }
  
    // Send the selected option to the bot
    socketx.current.emit('message', { text: option, userId: user ? user._id : 'anonymous' });
  };

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' });
  };

  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div key={index} className={`flex mb-4 ${msg.position === 'right' ? 'justify-end' : ''}`}>
        <div className="flex items-center">
          {msg.position === 'left' && (
            <img
              src={AiAvatar} 
              alt="Ambot"
              className="w-10 h-10 rounded-full mr-3 hidden md:block"
              style={{ alignSelf: 'flex-start' }}
            />
          )}
          <div className={`flex flex-col ${msg.position === 'right' ? 'items-end' : 'items-start'} max-w-lg`}>
            <div className={`text-xs font-semibold mb-1 ${msg.position === 'right' ? 'text-right' : 'text-left'}`}>
              {msg.senderName}
            </div>
            <div className={`p-3 rounded-lg ${msg.position === 'right' ? 'bg-[#1346AC] text-white' : 'bg-gray-300 text-black'} max-w-full break-words`}>
              {msg.component ? msg.component : msg.text}
            </div>
            <small className={`block text-xs opacity-75 mt-1 ${msg.position === 'right' ? 'text-right' : 'text-left'}`}>
              {formatDate(msg.createdAt)}
            </small>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col min-h-screen max-h-screen">
      <ResidentHeader userName={userName} userRole={userRole} handleLogout={handleLogout} profilePic={residentData?.profilepic} />
      <div className="flex flex-1 overflow-hidden">
        <ResidentNav residentData={residentData} />
         <main className="flex-1 p-8 bg-gray-100">
    <div className="h-full w-full bg-white rounded-lg shadow-md relative flex border border-gray-300 max-h-full">
    
    {/* Chat List */}
    <div className="w-1/4 border-r border-gray-300 overflow-visible relative z-50">
      <div className="flex justify-between items-center p-2 px-4 border-b border-gray-300">
        <h2 className="text-lg font-semibold">Messages</h2>
        <div className="flex justify-center items-center mt-2">
          <div className="dropdown relative z-50">
              <button
                tabIndex={0}
                className="flex justify-center items-center text-black hover:text-white hover:bg-[#1346AC] rounded-full bg-[#F2F3F5] h-10 w-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-box z-50 w-52 p-2 shadow-lg"
              >
                <li className="font-semibold">
                  <a>Message Requests</a>
                </li>
                <li className="font-semibold">
                  <a>Archive</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <ChatList className="chat-list" dataSource={chatList} />
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col border-l border-gray-300 relative z-10">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-300 flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src={chatmate.avatar} alt={chatmate.name} className="w-full h-full object-cover" />
          </div>
          <h2 className="ml-4 text-lg font-bold">{chatmate.name}</h2>
        </div>

        {/* Chat Body */}
        <div ref={chatWindowRef} className="flex-1 overflow-y-auto p-4">
          {renderMessages()}
        </div>

        {/* Message Input and Emoji Picker */}
        <div className="p-4 bg-gray-100 flex items-center relative">
          {emojiPickerVisible && (
            <div className="absolute bottom-16 left-0">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
          <button onClick={toggleEmojiPicker} className="text-2xl text-gray-500 mr-2">
            <FaSmile />
          </button>
          <input
            type="text"
            className="border border-gray-300 flex-1 p-2 rounded"
            placeholder="Type your message here..."
            value={botMessage}
            onChange={(e) => setBotMessage(e.target.value)}
          />
          <button onClick={handleSend} className="ml-2 text-blue-500 text-2xl">
            <BiSolidSend />
          </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResidentMessages;
