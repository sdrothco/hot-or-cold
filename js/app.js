var SECRET_NUM_MIN = 1;
var SECRET_NUM_MAX = 100;


$(document).ready(function(){

	var secretNum = 0;
	var numGuesses = 0;
	var previousGuessDiff = 0;  // the difference between the previous guess & the secret number.

	newGame();
	
	/*--- Display information modal box ---*/
	$(".what").click(function(){
		$(".overlay").fadeIn(1000);
	});

	/*--- Hide information modal box ---*/
	$("a.close").click(function(){
		$(".overlay").fadeOut(1000);
	});

	// If they clicked the new game button...
	$('.new, #newGameButton').click(function() {
		newGame();
	});

	// They clicked the guess button, so process their guess.
	$('#guessButton').click(function() {
		//console.log("Guess via button. Guess = >" + $('#userGuess').val() + "<");
		$('#userGuess').focus();

		if(validateInput($('#userGuess').val())) {
			evaluateGuess($('#userGuess').val());
		}
		//else console.log("Input was invalid.");

		resetGuessBox();
		event.preventDefault();
	});

	// They made a guess by hitting the enter key in the input box, so process their guess.
	$('#userGuess').on('keypress', function(event) {
        if (event.keyCode === 13) {
			//console.log("Guess via enter key. Guess = >" + $(this).val() + "<");

			if(validateInput($(this).val())) {
				evaluateGuess($(this).val());
			}
			//else console.log("Input was invalid.");

			resetGuessBox();
			event.preventDefault();
        }
    });

	// Set the feedback box to the passed-in string
	function provideFeedback(feedbackStr) {
		$('#feedback').text(feedbackStr);
	}

	// Clear the guess input box
	function resetGuessBox() {
		$('#userGuess').val('');
	}

	// Reset (or setup initially) all the values to start a new game, 
	// generate a new secret number, and clear any existing data.
	function newGame() {
		secretNum = generateSecretNumber(SECRET_NUM_MIN, SECRET_NUM_MAX);
		console.log("Secret number: " + secretNum);
		
		$('#userGuess').css("visibility", "visible");

		numGuesses = 0;
		$('#count').text(numGuesses);
		
		$('#guessList').find('li').remove();

		previousGuess = 0;

		provideFeedback("Make your Guess!");
		$('#guessButton').show();
		$('#newGameButton').hide();
		$('body').removeClass('success');

	}

	// Check that the number they entered is a valid number in the specified range.
	function validateInput(guessNum) {
		var errorStr = "Enter a number between " + SECRET_NUM_MIN +
				" and " + SECRET_NUM_MAX;

		console.log("Validating guess number: " + guessNum);

		if (guessNum === null || typeof guessNum === "undefined" || guessNum.trim() === "") {

			provideFeedback(errorStr);
			console.log(errorStr);
		}
		else {
			guessNum = +guessNum;	// convert the input string to a number
			if (isNaN(guessNum) || guessNum % 1 !== 0 ||
				guessNum < SECRET_NUM_MIN || guessNum > SECRET_NUM_MAX) {

				provideFeedback(errorStr);
				console.log(errorStr);
			}
			else {
				// It was a good number!
				return true;
			}
		}
		// It was an invalid number, so don't try to process it.
		return false;
	}


	// Look at their guess and compare it to the secret number and give them feedback
	// on thier guess.
	function evaluateGuess(guessNum) {
	
		// compare to secret number
		var guessDifference = Math.abs(secretNum - guessNum);
		console.log("Guess diff = " + guessDifference);

		// Provide feedback:
		// If this is the first guess, then give absolute feedback (as in hot or cold).
		//  
		// If this is not the first guess, compare the new guess to the old guess and
		// tell them if they are getting warmer or colder. 
		if ( guessDifference === 0) {
			provideFeedback("You guessed it!");
			$('#guessButton').hide();
			$('#newGameButton').show();
			$('#userGuess').css("visibility", "hidden");
			$('body').addClass('success');

		}
		else if ( guessDifference >= 1 && guessDifference <= 10 ) {

			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting hotter!");
				}
				else provideFeedback("Getting less hot");
			}
			else provideFeedback("Very hot!");
		}
		else if ( guessDifference >= 11 && guessDifference <= 20 ) {

			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting warmer");
				}
				else provideFeedback("Getting less warm");
			}
			else provideFeedback("Hot");
		}
		else if ( guessDifference >= 21 && guessDifference <= 30 ) {

			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting warmer");
				}
				else provideFeedback("Getting colder");
			}
			else provideFeedback("Lukewarm");
		}
		else if ( guessDifference >= 31 && guessDifference <= 50 ) {

			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting a little warmer");
				}
				else provideFeedback("Getting colder");
			}
			else provideFeedback("Cold");
		}
		else if ( guessDifference >= 51 && guessDifference <= 100 ) {

			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting a little warmer");
				}
				else provideFeedback("Getting even colder!");
			}
			else provideFeedback("Very Cold!");
		}

		previousGuessDiff = guessDifference;
		logGuess(guessNum);
	}

	// Keep track of the old guesses, and output them for the user.
	function logGuess(guessNum) {
		numGuesses++;
		$('#count').text(numGuesses);

		var newGuess = $("<li>" + guessNum + "</li>");
		$('#guessList').append(newGuess);
	}

	// Generate a random number within a specified range.
	function generateSecretNumber(bottom, top) {
		return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
	}

});


