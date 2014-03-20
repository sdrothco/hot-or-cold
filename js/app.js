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
		
		var $userGuessBox = $('#userGuess');
		$userGuessBox.focus();

		if(validateInput($userGuessBox.val())) {
			evaluateGuess($userGuessBox.val());
		}

		resetGuessBox();
		event.preventDefault();
	});

	// They made a guess by hitting the enter key in the input box, so process their guess.
	$('#userGuess').on('keypress', function(event) {
        if (event.keyCode === 13) {

			if(validateInput($(this).val())) {
				evaluateGuess($(this).val());
			}

			resetGuessBox();
			event.preventDefault();
        }
    });

	// Set the feedback box to the passed-in string
	function provideFeedback(feedbackStr, feedbackColorClass) {
		var $feedback = $('#feedback');
		$feedback.text(feedbackStr);
		$feedback.removeClass('very-hot hot lukewarm cold very-cold');
		if (feedbackColorClass !== "none") {
			$feedback.addClass(feedbackColorClass);
		}
	}

	// Clear the guess input box
	function resetGuessBox() {
		$('#userGuess').val('');
	}

	// Reset (or setup initially) all the values to start a new game, 
	// generate a new secret number, and clear any existing data.
	function newGame() {
		secretNum = generateSecretNumber(SECRET_NUM_MIN, SECRET_NUM_MAX);
		//console.log("Secret number: " + secretNum);
		
		$('#userGuess').css("visibility", "visible");

		numGuesses = 0;
		$('#count').text(numGuesses);
		
		$('#guessList').find('li').remove();

		previousGuessDiff = 0;

		provideFeedback("Make your Guess!", "none");
		$('#guessButton').show();
		$('#newGameButton').hide();
		$('body').removeClass('success');


	}

	// Check that the number they entered is a valid number in the specified range.
	function validateInput(guessNum) {
		var errorStr = "";
		var errorStrEnd = "  Please enter a number between " + SECRET_NUM_MIN +
				" and " + SECRET_NUM_MAX + ".";

		if (guessNum === null || typeof guessNum === "undefined" || guessNum.trim() === "") {
			errorStr = "Error: You didn't enter anything.";
		}
		else {
			guessNum = +guessNum;	// convert the input string to a number
			if (isNaN(guessNum)) {
				errorStr = "Error: That isn't a valid number.";
			}
			else if (guessNum % 1 !== 0) {
				errorStr = "Error: You can't use decimal numbers.";
			}
			else if (guessNum < SECRET_NUM_MIN) {
				errorStr = "Error: That number was too small.";
			}
			else if (guessNum > SECRET_NUM_MAX) {
				errorStr = "Error: That number was too big.";
			}
			else {
				// It was a good number!
				return true;
			}
			errorStr += errorStrEnd;
			provideFeedback(errorStr);
			console.log(errorStr);

		}
		// It was an invalid number, so don't try to process it.
		return false;
	}


	// Look at their guess and compare it to the secret number and give them feedback
	// on thier guess.
	function evaluateGuess(guessNum) {
	
		// compare to secret number
		var guessDifference = Math.abs(secretNum - guessNum);
		//console.log("Guess diff = " + guessDifference);

		var feedbackColor = "none";

		// Provide feedback:
		// If this is the first guess, then give absolute feedback (as in hot or cold).
		//  
		// If this is not the first guess, compare the new guess to the old guess and
		// tell them if they are getting warmer or colder. 
		if ( guessDifference === 0) {
			feedbackColor = "very-hot";
			provideFeedback("You guessed it!", feedbackColor);
			$('#guessButton').hide();
			$('#newGameButton').show();
			$('#userGuess').css("visibility", "hidden");
			$('body').addClass('success');

		}
		else if ( guessDifference >= 1 && guessDifference <= 10 ) {
			feedbackColor = "very-hot";
			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting hotter!", feedbackColor);
				}
				else provideFeedback("Getting less hot", feedbackColor);
			}
			else provideFeedback("Very hot!", feedbackColor);
		}
		else if ( guessDifference >= 11 && guessDifference <= 20 ) {
			feedbackColor = "hot";
			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting warmer", feedbackColor);
				}
				else provideFeedback("Getting less warm", feedbackColor);
			}
			else provideFeedback("Hot", feedbackColor);
		}
		else if ( guessDifference >= 21 && guessDifference <= 30 ) {
			feedbackColor = "lukewarm";
			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting warmer", feedbackColor);
				}
				else provideFeedback("Getting colder", feedbackColor);
			}
			else provideFeedback("Lukewarm", feedbackColor);
		}
		else if ( guessDifference >= 31 && guessDifference <= 50 ) {
			feedbackColor = "cold";
			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting a little warmer", feedbackColor);
				}
				else provideFeedback("Getting colder", feedbackColor);
			}
			else provideFeedback("Cold", feedbackColor);
		}
		else if ( guessDifference >= 51 && guessDifference <= 100 ) {
			feedbackColor = "very-cold";
			if ( previousGuessDiff !== 0 ) {
				if ( guessDifference <= previousGuessDiff ) {
					provideFeedback("Getting a little warmer", feedbackColor);
				}
				else provideFeedback("Getting even colder!", feedbackColor);
			}
			else provideFeedback("Very Cold!", feedbackColor);
		}

		previousGuessDiff = guessDifference;
		logGuess(guessNum, feedbackColor);
	}

	// Keep track of the old guesses, and output them for the user.
	function logGuess(guessNum, feedbackColor) {
		numGuesses++;
		$('#count').text(numGuesses);

		var newGuess = $("<li>" + guessNum + "</li>");
		newGuess.addClass(feedbackColor);
		$('#guessList').append(newGuess);
	}

	// Generate a random number within a specified range.
	function generateSecretNumber(bottom, top) {
		return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
	}

});


