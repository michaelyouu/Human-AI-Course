const sendBtn = document.querySelector('#send-btn');
const promptInput = document.querySelector('#prompt-input');
const messagesDiv = document.querySelector('#messages');

// Enable the send button when there is input
promptInput.addEventListener('input', function(event) {
    sendBtn.disabled = !event.target.value.trim();  // Enable button if input is not empty
});

// Function to append messages to the chat history
function appendMessage(role, content) {
    console.log(`Appending message from ${role}: ${content}`);  // Debugging log
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', role);  // Add CSS classes based on role
    messageElement.innerHTML = `<strong>${role}:</strong> ${content}`;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;  // Scroll to the bottom
}

// Function to send the message to the server and handle the response
function sendMessage() {
    const prompt = promptInput.value;
    console.log(`User prompt: ${prompt}`);  // Debugging log

    if (!prompt.trim()) {
        console.log('No prompt entered, exiting sendMessage.');
        return;  // Prevent sending empty messages
    }

    // Add user's message to the chat history
    appendMessage('User', prompt);
    promptInput.value = '';  // Clear input field

    // Make a POST request to the backend
    fetch('/query', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
    })
    .then(response => {
        console.log('Received response from server:', response);
        return response.json();  // Parse the JSON response
    })
    .then(data => {
        console.log('Parsed response data:', data);  // Debugging log

        // Check if the response is in the expected format
        if (data && data.response) {
            appendMessage('AI', data.response);  // Append the AI's response to the chat
        } else {
            appendMessage('Error', 'Unexpected response format.');
        }
    })
    .catch(error => {
        console.error('Error occurred while sending request:', error);
        appendMessage('Error', 'Something went wrong. Please try again.');
    });
}

// Trigger the send button when Enter key is pressed
promptInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});

// Send message when the button is clicked
sendBtn.addEventListener('click', sendMessage);