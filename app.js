function openGooglePopup() {
    document.getElementById('googleModal').style.display = 'flex';
}

function closeGooglePopup() {
    document.getElementById('googleModal').style.display = 'none';
}

function finishLogin(name) {
    // Show a small loading state
    const content = document.querySelector('.popup-content');
    content.innerHTML = `
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-white">Signing in as ${name}...</p>
    `;

    // Simulate automatic redirect after "login"
    setTimeout(() => {
        closeGooglePopup();
        alert("Successfully logged in via Google!");
        // You can now update the UI or redirect the user
    }, 2000);
}

// Close popup if user clicks outside the modal
window.onclick = function(event) {
    const modal = document.getElementById('googleModal');
    if (event.target == modal) {
        closeGooglePopup();
    }
}