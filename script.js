$(document).ready(function() {
    // Step 1: Define an array containing pairs of image names for the game
    let images = [
        'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg',
        'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg',
        'image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg',
        'image5.jpg', 'image6.jpg', 'image7.jpg', 'image8.jpg'
    ];

    // Step 2: Check screen width to decide the number of cards
    if (window.innerWidth < 768) {
        // Use fewer cards for smaller screens (3x4 grid)
        // Randomly pick 6 pairs (12 cards total)
        const uniqueImages = [...new Set(images)].slice(0, 6); // Get 6 unique images
        images = uniqueImages.concat(uniqueImages); // Create pairs
        images.sort(() => 0.5 - Math.random()); // Shuffle the 12 cards
    } else {
        // Shuffle the full 16 cards for larger screens
        images.sort(() => 0.5 - Math.random());
    }

    // Step 3: Select the game board container
    const gameBoard = $('#game-board');

    // Step 4: Loop through each shuffled image and create a card element
    images.forEach((image) => {
        // Create a card div with a class of 'card' and 'cover', and a data attribute for the image name
        const card = $('<div class="card cover" data-image="' + image + '"></div>');
        
        // Create an image element and set its source to the respective image
        const img = $('<img src="assets/' + image + '" alt="Card Image">');
        
        // Append the image to the card
        card.append(img);
        
        // Append the card to the game board
        gameBoard.append(card);
    });

    // Variables to keep track of the first and second card clicked by the player
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;

    // Load sound files
    const clickSound = new Audio('assets/sounds/click.mp3');
    const correctSound = new Audio('assets/sounds/correct.mp3');
    const wrongSound = new Audio('assets/sounds/wrong.mp3');
    const endSound = new Audio('assets/sounds/end.mp3');

    // Event listener for clicking on a card
    $('.card').click(function() {
        if (lockBoard) return; // Check if the board is locked; if yes, exit the function to prevent further clicks
        if ($(this).hasClass('flipped')) return; // Check if the clicked card is already flipped; if yes, exit the function

        // Play click sound
        playSound(clickSound);

        $(this).addClass('flipped'); // Add the 'flipped' class to visually show the card is flipped
        $(this).removeClass('cover'); // Remove the 'cover' class to reveal the image underneath

        if (!firstCard) { // Check if firstCard is null, indicating this is the first card flipped
            firstCard = $(this); // Assign the clicked card to firstCard
            return; // Exit the function since we only need to store the first card for now
        }

        secondCard = $(this); // Assign the clicked card to secondCard
        checkForMatch(); // Call the function to check if the two flipped cards match
    });

    // Function to check if the two flipped cards match
    function checkForMatch() {
        if (firstCard.data('image') === secondCard.data('image')) {
            // If the images match, play correct sound
            playSound(correctSound);
            firstCard = null; // Reset firstCard for the next turn
            secondCard = null; // Reset secondCard for the next turn

            // Check if all cards are revealed
            if ($('.card.cover').length === 0) {
                playSound(endSound); // Play end sound when all cards are matched
            }
        } else {
            lockBoard = true; // Lock the board to prevent clicks while cards are being flipped back
            playSound(wrongSound); // Play wrong sound
            setTimeout(() => {
                firstCard.removeClass('flipped').addClass('cover'); // Flip the first card back
                secondCard.removeClass('flipped').addClass('cover'); // Flip the second card back
                firstCard = null; // Reset firstCard for the next turn
                secondCard = null; // Reset secondCard for the next turn
                lockBoard = false; // Unlock the board so the player can continue
            }, 1000); // Wait 1 second before flipping the cards back
        }
    }

    // Function to play sound and prevent overlap
    function playSound(sound) {
        sound.pause(); // Pause the sound if it's currently playing
        sound.currentTime = 0; // Reset to the beginning
        sound.play(); // Play the sound
    }
});
