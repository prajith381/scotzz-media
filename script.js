document.getElementById('bookingForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.querySelector('.submit-btn');
    const statusMsg = document.getElementById('statusMessage');

    // UI Feedback
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    // Collect Data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        serviceType: document.getElementById('serviceType').value,
        date: document.getElementById('date').value,
        message: document.getElementById('message').value
    };

    try {
        const response = await fetch('/send-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            statusMsg.style.color = "#4BB543";
            statusMsg.innerText = "Booking request sent successfully!";
            document.getElementById('bookingForm').reset();
        } else {
            throw new Error(result.message || 'Error sending');
        }
    } catch (error) {
        statusMsg.style.color = "red";
        statusMsg.innerText = "Error: " + (error.message || "Failed to send. DM on Insta.");
        console.error(error);
    } finally {
        submitBtn.innerText = "Send Request";
        submitBtn.disabled = false;
    }
});

// Animation Observer
// Animation Observer
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);


document.querySelectorAll('.animate-text').forEach(el => {
    observer.observe(el);
});

// Reels Playlist
const reelsVideo = document.getElementById('reelsVideo');
if (reelsVideo) {
    const playlist = [
        'assets/video.mp4',
        'assets/video4.mp4.mp4',
        'assets/video2.mp4.mp4',
        'assets/video5.mp.mp4',
        'assets/video3.mp4.mp4'
    ];
    let currentVideoIndex = 0;

    reelsVideo.addEventListener('ended', () => {
        currentVideoIndex++;
        if (currentVideoIndex >= playlist.length) {
            currentVideoIndex = 0;
        }
        reelsVideo.src = playlist[currentVideoIndex];
        reelsVideo.play();
    });
}