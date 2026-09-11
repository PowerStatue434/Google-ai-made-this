document.addEventListener('DOMContentLoaded', () => {
    const proxyForm = document.getElementById('proxy-form');
    const targetUrlInput = document.getElementById('target-url');
    const proxyViewport = document.getElementById('proxy-viewport');
    const welcomeMessage = document.getElementById('welcome-message');

    proxyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let rawUrl = targetUrlInput.value.trim();

        // 1. URL Validation & Sanitization Engine
        if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
            // Check if it looks like a standard site domain, else turn into a search query string
            if (rawUrl.includes('.') && !rawUrl.includes(' ')) {
                rawUrl = 'https://' + rawUrl;
            } else {
                rawUrl = 'https://google.com' + encodeURIComponent(rawUrl);
            }
        }

        // 2. Map structural execution path through proxy backend router endpoint
        // Points internally to our local proxy microserver defined below
        const proxyGatewayUrl = `/proxy?url=${encodeURIComponent(rawUrl)}`;

        // 3. UI Layer State Switch Transitions
        welcomeMessage.classList.add('hidden');
        proxyViewport.classList.remove('hidden');
       
        // Feed source directly inside sandboxed iframe element
        proxyViewport.src = proxyGatewayUrl;
    });
});
