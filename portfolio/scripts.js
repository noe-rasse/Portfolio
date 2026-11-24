const cards = document.querySelectorAll('.project-image');
cards.forEach(function(card) {
    card.addEventListener('mouseenter', function() {
        card.classList.add('revealed');
        const video = card.querySelector('video');
        if (video) {
            video.muted = true;
            video.play().catch(function(error) {
                console.log("Erreur vidéo :", error);
            });
        }
    });
});