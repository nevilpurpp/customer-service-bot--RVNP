// Select DOM elements
const chatbotToggler = document.querySelector(".toggle-chat");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".message-box");
const chatInput = document.querySelector(".message-input textarea");
const sendChatBtn = document.querySelector("#send-btn");
const containerText = document.querySelector(".container p");

// Initialize variables
let userMessage = null; // To store the user message
const inputInitHeight = chatInput.scrollHeight; // Store initial textarea height

// Creates a new chat <li> element with the given message and className
const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("message", `${className}`); // Apply message class

    // Set content based on the message type (outgoing/incoming)
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message; // Set the message text

    return chatLi; // Return the created chat <li> element
}

// Generates a response using the Flask API and updates the chat element
const generateResponse = (chatElement) => {
    const messageElement = chatElement.querySelector("p");

    // Define request options for the Flask API call
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage
        })
    }

    // Fetch API response from Flask backend and update the chat element
    fetch("/chat", requestOptions) // Assuming Flask endpoint is '/chat'
        .then(res => res.json())
        .then(data => {
            messageElement.textContent = data.response.trim(); // Update with the response from Flask
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

// Handles sending a chat message and generating a response
const handleChat = () => {
    userMessage = chatInput.value.trim(); // Get and trim user input
    if (!userMessage) return; // Exit if message is empty

    // Clear input textarea and reset height
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    // Simulate Typing and generate response after a short delay
    setTimeout(() => {
        const incomingChatLi = createChatLi("Typing...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

// Adjust textarea height dynamically based on input
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

// Handle Enter key for sending message on larger screens
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

// Handle click events for sending message and toggling chatbot visibility
sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));