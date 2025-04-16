document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const uploadForm = document.getElementById('upload-form');
    const pdfFile = document.getElementById('pdf-file');

    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = message;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, true);
        userInput.value = '';

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: message })
            });

            const data = await response.json();
            if (response.ok) {
                addMessage(data.response);
            } else {
                addMessage('Error: ' + data.error);
            }
        } catch (error) {
            addMessage('Error: Could not send message');
            console.error('Error:', error);
        }
    }

    uploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const file = pdfFile.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload-pdf', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                addMessage('PDF uploaded and processed successfully');
            } else {
                addMessage('Error: ' + data.error);
            }
        } catch (error) {
            addMessage('Error: Could not upload file');
            console.error('Error:', error);
        }
    });

    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});