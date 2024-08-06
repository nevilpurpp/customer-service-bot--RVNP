// Select DOM elements
const chatbotToggler = document.querySelector(".toggle-chat");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".message-box");
const chatInput = document.querySelector(".message-input textarea");
const sendChatBtn = document.querySelector("#send-btn");


// Initialize variables
let userMessage = null; // To store the user message
const inputInitHeight = chatInput.scrollHeight; // Store initial textarea height

// Function to convert URLs in message text to clickable links
function linkifyText(text) {
  const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|$!:,.;]*[-A-Z0-9+&@#\/%?=~_|$])/ig;
  return text.replace(urlPattern, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });
}

// Creates a new chat <li> element with the given message and className
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("message", `${className}`); // Apply message class

    // Set content based on the message type (outgoing/incoming)
    let chatContent = className === "outgoing" ? `<p></p>` : `<img src="/static/images/rvistlogo.jpg" alt="RVIST" class="header-logo"><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").innerHTML = linkifyText(message); // Set the message text with clickable links

    return chatLi; // Return the created chat <li> element
}

// Generates a response using the Flask API and updates the chat element
const generateResponse = async (message) => {
    try {
        const response = await fetch('/chat', {
            method: 'POST',
            body: JSON.stringify({ message: message }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        return 'Error: Unable to connect to the server';
    }
}

// Handle sending the message
const handleSendMessage = async () => {
    userMessage = chatInput.value.trim(); // Get the user message and remove extra spaces
    if (!userMessage) return; // If the input is empty, return

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
    chatInput.value = ''; // Clear the input field

    // Send the user's message to the server and get the response
    const responseMessage = await generateResponse(userMessage);
    chatbox.appendChild(createChatLi(responseMessage, 'incoming')); // Append the response message to the chatbox

    // Scroll the chatbox to the bottom
    chatbox.scrollTop = chatbox.scrollHeight;
}

// Toggle chat interface visibility
const toggleChat = () => {
    document.body.classList.toggle('show-chatbot');
}

// Event listeners
sendChatBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); // Prevent the default form submission
        handleSendMessage();
    }
});
chatbotToggler.addEventListener('click', toggleChat);
closeBtn.addEventListener('click', toggleChat);
