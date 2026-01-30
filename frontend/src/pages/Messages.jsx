/* ---------- Bot Reply Logic ---------- */
const getBotReply = (userMessage) => {
  const msg = userMessage.toLowerCase();

  if (msg.includes("check-out") || msg.includes("checkout") || msg.includes("late")) {
    return "Late check-out is available until 2 PM for an additional fee of $50. Would you like me to arrange this for you?";
  }
  if (msg.includes("parking") || msg.includes("park")) {
    return "Yes, we offer complimentary parking for all guests. The parking lot is located behind the main building.";
  }
  if (msg.includes("wifi") || msg.includes("internet") || msg.includes("password")) {
    return "WiFi is available throughout the property. Network: Lodgify-Guest, Password: Welcome2024";
  }
  if (msg.includes("breakfast") || msg.includes("food") || msg.includes("restaurant")) {
    return "Breakfast is served daily from 7 AM to 10 AM in the dining hall. We also have a restaurant open for lunch and dinner.";
  }
  if (msg.includes("pool") || msg.includes("gym") || msg.includes("amenities")) {
    return "Our facilities include a heated pool (6 AM - 10 PM), fitness center (24/7), and spa services (by appointment).";
  }
  if (msg.includes("clean") || msg.includes("housekeeping") || msg.includes("towel")) {
    return "Housekeeping service is available daily. For additional towels or cleaning, please call extension 100 or let us know here.";
  }
  if (msg.includes("check-in") || msg.includes("checkin") || msg.includes("arrival")) {
    return "Check-in time is 3 PM. Early check-in may be available upon request, subject to availability.";
  }
  if (msg.includes("cancel") || msg.includes("refund")) {
    return "Cancellation policy varies by rate. Please provide your booking reference, and I'll check the specific terms for you.";
  }

  return "Thank you for your message! A member of our team will respond shortly. For urgent matters, please call the front desk.";
};

/* ---------- Send message ---------- */
const sendMessage = () => {
  if (!message.trim() || !activeChat) return;

  const newMsg = {
    id: Date.now(),
    sender: "admin",
    text: message,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const updated = conversations.map(c =>
    c.id === activeChat.id
      ? {
        ...c,
        lastMessage: message,
        messages: [...c.messages, newMsg],
      }
      : c
  );

  setConversations(updated);
  saveData(updated);
  setActiveChat(updated.find(c => c.id === activeChat.id));
  setMessage("");
};

/* ---------- Simulate Guest Message (for testing) ---------- */
const simulateGuestMessage = (text) => {
  if (!activeChat) return;

  const guestMsg = {
    id: Date.now(),
    sender: "guest",
    text: text,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  const botReply = {
    id: Date.now() + 1,
    sender: "admin",
    text: getBotReply(text),
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  setTimeout(() => {
    const updated = conversations.map(c =>
      c.id === activeChat.id
        ? {
          ...c,
          lastMessage: text,
          messages: [...c.messages, guestMsg],
        }
        : c
    );
    setConversations(updated);
    saveData(updated);
    setActiveChat(updated.find(c => c.id === activeChat.id));

    setTimeout(() => {
      const finalUpdated = conversations.map(c =>
        c.id === activeChat.id
          ? {
            ...c,
            lastMessage: botReply.text,
            messages: [...c.messages, guestMsg, botReply],
          }
          : c
      );
      setConversations(finalUpdated);
      saveData(finalUpdated);
      setActiveChat(finalUpdated.find(c => c.id === activeChat.id));
    }, 1000);
  }, 100);
};

import React from 'react'

const Messages = () => {
  const [conversations, setConversations] = React.useState(() => {
    const saved = localStorage.getItem('hotel_messages');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        guestName: "John Doe",
        lastMessage: "Thank you for the info!",
        messages: [
          { id: 1, sender: "guest", text: "Hello, what time is check-out?", time: "10:00 AM" },
          { id: 2, sender: "admin", text: "Check-out is at 11 AM. Would you like a late check-out?", time: "10:05 AM" },
          { id: 3, sender: "guest", text: "Yes, please. How much is the fee?", time: "10:10 AM" },
          { id: 4, sender: "admin", text: "Late check-out is available until 2 PM for an additional fee of $50.", time: "10:15 AM" },
          { id: 5, sender: "guest", text: "Thank you for the info!", time: "10:20 AM" },
        ],
      },
      {
        id: 2,
        guestName: "Jane Smith",
        lastMessage: "Great, see you then!",
        messages: [
          { id: 1, sender: "guest", text: "Is breakfast included with my room?", time: "9:00 AM" },
          { id: 2, sender: "admin", text: "Yes, breakfast is served daily from 7 AM to 10 AM in the dining hall.", time: "9:05 AM" },
          { id: 3, sender: "guest", text: "Great, see you then!", time: "9:10 AM" },
        ],
      },
    ];
  });
  const [activeChat, setActiveChat] = React.useState(null);
  const [message, setMessage] = React.useState("");

  const saveData = (data) => {
    localStorage.setItem('hotel_messages', JSON.stringify(data));
  };


  return (
    <div className="flex h-full">
      {/* Chat List */}
      <div className="w-1/4 border-r overflow-y-auto">
        <h2 className="text-xl font-bold p-4 border-b">Conversations</h2>
        {conversations.map(chat => (
          <div
            key={chat.id}
            className={`p-4 border-b cursor-pointer ${activeChat?.id === chat.id ? 'bg-gray-100' : ''}`}
            onClick={() => setActiveChat(chat)}
          >
            <p className="font-semibold">{chat.guestName}</p>
            <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="w-3/4 flex flex-col">
        {activeChat ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto border-b">
              {activeChat.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-4 ${msg.sender === 'admin' ? 'text-right' : 'text-left'}`}
                >
                  <p
                    className={`inline-block px-4 py-2 rounded-lg ${msg.sender === 'admin' ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-900'
                      }`}
                  >
                    {msg.text}
                  </p>
                  <div className="text-xs text-gray-500 mt-1">{msg.time}</div>
                </div>
              ))}
            </div>
            <div className="p-4 flex items-center border-t">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 border rounded-lg px-4 py-2 mr-4 focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Type your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') sendMessage();
                }}
              />
              <button
                onClick={sendMessage}
                className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;