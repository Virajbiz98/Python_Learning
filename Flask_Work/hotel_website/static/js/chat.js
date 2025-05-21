// Chat form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    
    // Rate limiting variables
    let lastRequestTime = 0;
    const minRequestInterval = 2000; // Minimum 2 seconds between requests

    if (chatForm) {
        chatForm.addEventListener('submit', async function(e) {
            const now = Date.now();
            if (now - lastRequestTime < minRequestInterval) {
                e.preventDefault();
                const waitTime = Math.ceil((minRequestInterval - (now - lastRequestTime)) / 1000);
                alert(`Please wait ${waitTime} seconds before sending another message.`);
                return;
            }
            lastRequestTime = now;
            e.preventDefault();
            
            const userMessage = userInput.value.trim();
            if (!userMessage) return;

            try {
                // Disable input and button while processing
                userInput.disabled = true;
                const submitButton = this.querySelector('button[type="submit"]');
                submitButton.disabled = true;

                // Add user message to chat
                chatMessages.innerHTML += `
                    <div class="message user-message">
                        <strong>You:</strong> ${userMessage}
                    </div>
                `;

                // Send request to backend
                const response = await fetch('/ask_bot', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: 'user_input=' + encodeURIComponent(userMessage)
                });

                const data = await response.json();
                console.log('Response:', data); // Debug log

                if (data.status === 'success') {
                    chatMessages.innerHTML += `
                        <div class="message bot-message">
                            <strong>Hotel Assistant:</strong> ${data.response}
                        </div>
                    `;
                } else {
                    chatMessages.innerHTML += `
                        <div class="message error-message">
                            <strong>Error:</strong> ${data.response}
                        </div>
                    `;
                }

            } catch (error) {
                console.error('Error:', error);
                chatMessages.innerHTML += `
                    <div class="message error-message">
                        <strong>Error:</strong> An error occurred while processing your request. Please try again later.
                    </div>
                `;
                chatMessages.innerHTML += `
                    <div class="message bot-message error">
                        <strong>Error:</strong> ${error.message || 'Sorry, there was an error processing your request.'}
                    </div>
                `;
            } finally {
                // Re-enable input and button
                userInput.disabled = false;
                submitButton.disabled = false;
                
                // Clear input and focus it
                userInput.value = '';
                userInput.focus();
                
                // Scroll to bottom
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });
    }
});
