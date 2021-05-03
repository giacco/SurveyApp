// function to randomize array order
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
}

var SurveyAppManager = (function() {
    
   var questionArrayAll = []; // all question randomized
   var questionTotalNumber = 0; // total question number
   var questionNumber = 0; // number of question
   var questionAnsweredByUser = []; // user's answers
   var questionToAsk = []; // storing which question remain to ask
   var correctAnswer = 0;

   var displayQuestionFn;
   var displaySurveyResultFn;
   var callbackErrorFn;

  
   function callbackFailure( response)
   {
       callbackErrorFn("Questions JSON file not found. Error: " +response.status)
   } 
      
   function getQuestionsJSONCallbackSuccess(response) {
       questionArrayAll = shuffle(response.survey);

       questionArrayAll.forEach(quest => {
            shuffle(quest.answers)
       });       
       questionTotalNumber = questionArrayAll.length;
       questionToAsk.push(...questionArrayAll)
       //questionToAsk = questionArrayAll

       // Display First Question from questionArray and question number
       questionNumber ++;
       displayQuestionFn( questionToAsk[0], questionNumber, questionTotalNumber );
       questionToAsk.shift()
   }

   function finalResult() {
        console.log("a",questionArrayAll)
        console.log("a",correctAnswer)

        displaySurveyResultFn(questionArrayAll, questionAnsweredByUser,correctAnswer)
   }

   function nextQuestion() {
        
        displayQuestionFn( questionToAsk[0], questionNumber, questionTotalNumber);
        questionToAsk.shift()
    }
   
   var publicAPI = {
       /**
        *  Pass the display functions to SurveyAppManager 
        */
       init: function( displayObjs ) {
           displayQuestionFn = displayObjs.displayQuestionFn;
           displaySurveyResultFn = displayObjs.displaySurveyResultFn;
           callbackErrorFn = displayObjs.callbackErrorFn;
           return this;
       },
   
       /**
        * Retrieve the value from async call on questions.json file , 
        * and display the interface version if the call is successful.
        */
       getQuestionFromJSON: function() {
            $.ajax({
                type: "Get",
                url: "./js/questions.json",
                dataType: "json",
                success: getQuestionsJSONCallbackSuccess,
                error: callbackFailure,
            });
       },

       setUserAnswer: function( value ) {
           questionAnsweredByUser.push(value)
           //check if answer is correct
           if(value == questionArrayAll[questionNumber-1].correctAnswer )
           {
               correctAnswer++
           }
           //check if there are other question
           if(questionAnsweredByUser.length == questionTotalNumber) {
                finalResult();
           } else {
                questionNumber ++;
                nextQuestion();
           }
       }
   };
   return publicAPI;
})();	
