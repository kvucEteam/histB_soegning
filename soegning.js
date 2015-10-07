var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;
var error_total = 0;
// var CssObj = {};

// The function makes the carousel-indicator for the carousel:
function returnCarouselIndicators(jsonData){
	var HTML = '';
	for (var i = 0; i < jsonData.length; i++) {
		HTML += '<li data-target="#questionCarousel" data-slide-to="'+i+'"'+((i==0)?' class="active"':'')+'></li>';
	};
	console.log("returnCarouselIndicators: " + HTML);

	return HTML;
}
// XXX = [{1:1},{2:2},{3:3},{4:4},{5:5}];
// returnCarouselIndicators(XXX);


function returnCarouselItem(questionNum, jsonData){
	var itemData = jsonData[questionNum].quizData;

	var HTML = '<div id="question_'+questionNum+'" class="item'+((questionNum==0)?' active':'')+'">' +
					'<h2 class="indent">'+itemData.taskText+'</h2>';

	switch(itemData.slideData.type) {
	    case "img":
	        HTML += '<img class="img-responsive" src="'+itemData.slideData.src+'" alt="'+itemData.slideData.alt+'"/>';
	        break;
	    case "text":
	        HTML += '<div class="TextHolder">'+itemData.slideData.text+'</div>';
	        break;
	    case "video":
	        HTML += '<div class="embed-responsive embed-responsive-16by9 col-xs-12 col-md-12">' + 
                        '<iframe class="embed-responsive-item" src="'+itemData.slideData.src+'?rel=0" allowfullscreen="1"></iframe>' + 
                    '</div>';
	        break;
	    default:
	        alert('Invalid "type"');
	}

	HTML += '</div>';
	
	console.log("returnCarouselItem: " + HTML);

	return HTML;
}


function returnCarouseList(jsonData){
	var HTML = '';
	for (n in jsonData){
		HTML += returnCarouselItem(n, jsonData);
	}

	console.log("returnCarouseList: " + HTML);
	
	return HTML;
}



function returnBtnContainer(jsonData){
	var HTML = '';
	for (k in jsonData){
		var btnArray = jsonData[k].userInterface.btn;
		HTML += '<span id="btnContainer_'+k+'" class="btnContainer">';
		for (n in btnArray){
			HTML += '<a class="btn btn-default StudentAnswer" href="#">'+btnArray[n]+'</a>';
		}
		HTML += '</span>';
	}
	return HTML;
}


function returnCarouselHtml(questionNum, jsonData, UlrVarObj){
	
	var HTML = '';

	HTML += returnBtnContainer(jsonData);

	console.log("ReturnQustionHtml - btnHtml: " + HTML);

	// HTML += '<a class="btn btn-default checkAnswer" href="#"> Tjek svar </a>';

	HTML += '<div id="questionCarousel" class="carousel slide'+((parseInt(UlrVarObj.file) == 3)?" QuizData3_exception":"")+'" data-ride="carousel" data-interval="false">' +
                '<ol class="carousel-indicators">' +
                    returnCarouselIndicators(jsonData) + 
                '</ol>' +
                '<div class="carousel-inner" role="listbox">' +
                    returnCarouseList(jsonData) + 
                '</div>' +
                '<a class="left carousel-control" href="#questionCarousel" role="button" data-slide="prev">' +
                    '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>' +
                    '<span class="sr-only">Previous</span>' +
                '</a>' +
                '<a class="right carousel-control" href="#questionCarousel" role="button" data-slide="next">' +
                    '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>' +
                    '<span class="sr-only">Next</span>' +
                '</a>' +
            '</div>';
	return HTML;
}


function userInterfaceChanger(jsonData){
	var questionId, nextQuestionId;

	// When the left carousel button is pressed...
    $(document).on('click', ".left", function(event) {
        questionId = parseInt($(".carousel-inner > .active").prop("id").split("_")[1]);
        nextQuestionId = ((questionId - 1) < 0) ? jsonData.length - 1 : questionId - 1;
        console.log("userInterfaceChanger - questionId: " + questionId + ", nextQuestionId: " + nextQuestionId);
        CurrentQuestionId = nextQuestionId;

        $("#header").html(jsonData[CurrentQuestionId].userInterface.header);        // Shows the next heading.
        $("#subHeader").html(jsonData[CurrentQuestionId].userInterface.subHeader);  // Shows the next subheading.

        $(".btnContainer").hide();                                                  // Hides all the button containers.
        $("#btnContainer_"+CurrentQuestionId).show();                               // Shows the next button container.
    });

    // When the right carousel button is pressed...
    $(document).on('click', ".right", function(event) {
        var questionId = parseInt($(".carousel-inner > .active").prop("id").split("_")[1]);
        nextQuestionId = ((questionId + 1) > jsonData.length - 1) ? 0 : questionId + 1;
        console.log("userInterfaceChanger - questionId: " + questionId + ", nextQuestionId: " + nextQuestionId);
        CurrentQuestionId = nextQuestionId;

        $("#header").html(jsonData[CurrentQuestionId].userInterface.header);        // Shows the previous heading.
        $("#subHeader").html(jsonData[CurrentQuestionId].userInterface.subHeader);  // Shows the previous subheading.

        $(".btnContainer").hide();                                                  // Hides all the button containers.
        $("#btnContainer_"+CurrentQuestionId).show();                               // Shows the previous button container.
    });

    // // When a carousel-indicator button is pressed... 
    $(document).on('click', ".carousel-indicators > li", function(event) {
        var Index = $(".carousel-indicators > li").index( this );  // Get the zero-based li number.
        console.log("Index: " + Index);

        CurrentQuestionId = Index;

        $("#header").html(jsonData[CurrentQuestionId].userInterface.header);        // Shows the requested heading.
        $("#subHeader").html(jsonData[CurrentQuestionId].userInterface.subHeader);  // Shows the requested subheading.

        $(".btnContainer").hide();                                                  // Hides all the button containers.
        $("#btnContainer_"+CurrentQuestionId).show();                               // Shows the requested button container.
    });
}

function elementInArray(tArray, element){
    for (x in tArray){
        if (tArray[x] == element) return true 
    }
    return false;
}
console.log("elementInArray - true: " + elementInArray([1,2,3,4,5], 3));
console.log("elementInArray - false: " + elementInArray([1,2,3,4,5], 6));



function countCorrectAnswers(jsonData){
	correct_total = 0;
	error_total = 0;
    var error_displayed_total = 0;
    var numOfQuestions = 0;
	for (k in jsonData){
		var correct = 0; var error_missed = 0; var error_wrong = 0; var error_displayed = 0;
	    var answerArray = jsonData[k].quizData.correctAnswer;
	    var numOfSrudentAnswers = $("#btnContainer_"+k+" > .btnPressed").length;
	    var numOfCorrectAnswers = answerArray.length;
	    for (var n in answerArray){
	       if ($("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").hasClass("btnPressed")){
	           correct++;   // Counting correct answers.
               $("#btnContainer_"+k+" > .StudentAnswer:eq("+answerArray[n]+")").toggleClass("CorrectAnswer");
	       } else {
	    		error_missed++;  // Counting missed correct answers, eg. if there are two or more correct answers and the student does not answer all of the answers, then this counter counts the missed correct answers.
	       }
            error_wrong += numOfSrudentAnswers - (correct + error_missed); // Counts all the wrong answers chosen by the student. 
            error_wrong = (error_wrong < 0) ?  0 : error_wrong;

            console.log("countCorrectAnswers - CurrentQuestionId: " + CurrentQuestionId + 
            "\nnumOfSrudentAnswers: " + numOfSrudentAnswers + ", numOfCorrectAnswers: " + numOfCorrectAnswers + 
            "\ncorrect: " + correct  + ", error_missed: " + error_missed  + ", error_wrong: " + error_wrong);
		}

        $("#btnContainer_"+k+" > .StudentAnswer").each(function( index, element ) {
            if (($(element).hasClass("btnPressed")) && !(elementInArray(answerArray, index))){
                ++error_displayed;
                $(element).toggleClass("WrongAnswer");
            }
        });

        // correct_total += (correct  // <-------------------------   IMPORTANT: THIS WILL GIVE TWO POINTS IF TWO CORRECT ANSWERS ARE GIVEN IN ONE QUESTION!!!
	    correct_total += (correct >= 1)? 1 : 0;   // <-------------------------   IMPORTANT: THIS ENFORCES _ONE_ POINT IF THERE ARE TWO OR MORE CORRECT ANSWERS!!!!!
	    error_total += error_wrong + error_missed - correct;
        error_displayed_total += error_displayed;

        ++numOfQuestions;
	}

    $(".QuestionCounter").text(correct_total+'/'+numOfQuestions);
    $(".ErrorCount").text(error_displayed_total);
	console.log("countCorrectAnswers - correct_total: " + correct_total + ", error_total: " + error_total + ", error_displayed_total: " + error_displayed_total);
}


function giveFeedback(jsonData, questionNum){
    var HTML = "<h2>Feedback</h2>";
    var questionArray = jsonData[questionNum].userInterface.btn;
    var feedbackArray = jsonData[questionNum].quizData.feedbackData; 
    for (var n in questionArray){
        if ($("#btnContainer_"+questionNum+" > .StudentAnswer:eq("+n+")").hasClass("btnPressed"))
            HTML += "<p>"+feedbackArray[n]+"</p>";
    }

    console.log("giveFeedback - CurrentQuestionId: " + ", HTML: " + JSON.stringify(HTML));

    UserMsgBox("body", HTML);
    UserMsgBox_SetWidth(".container-fluid", 0.7);
}



function CheckStudentAnswers(jsonData){

    $(document).on('click', ".StudentAnswer", function(event) {
    	event.preventDefault(); // Prevents sending the user to "href". 

        if (jsonData[CurrentQuestionId].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
            UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse.");
            UserMsgBox_SetWidth(".container-fluid", 0.7);
        } else {
            $(this).toggleClass("btnPressed");

            // var CssGet = ["background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color"];
            // var CssSet = {
            //     "background-color": "#1da6db",
            //     "border-top-color": "#1da6db",
            //     "border-right-color": "#1da6db",
            //     "border-bottom-color": "#1da6db",
            //     "border-left-color": "#1da6db",
            //     "color": "#FFF"
            // };

            // // Get 
            // if ($.isEmptyObject(CssObj)) {
            //     CssObj.StudentAnswer = $(".StudentAnswer").css(CssGet);
            // }
            // console.log("GivePosetiveFeedback - CssObj: " + JSON.stringify(CssObj));

            // This is a bad solution - a better one would be to let CSS handle the color-changes...
            // if ($(this).hasClass("btnPressed"))
            //     $(this).css(CssSet);
            // else
            //     $(this).css(CssObj.StudentAnswer);

            if ($(this).hasClass("btnPressed"))
            	$(this).css(CSS_OBJECT.btnPressed);
            else
                $(this).css(CSS_OBJECT.StudentAnswer);


        }

    });

    $(document).on('click', ".checkAnswer", function(event) {
        event.preventDefault(); // Prevents sending the user to "href".

        if (jsonData[CurrentQuestionId].hasOwnProperty("answered")) {  // Prevent the students from altering their first/initial answer.
            UserMsgBox("body", "Du har allerede svaret på denne opgave, og kan derfor ikke lave en ny besvarelse.");
            UserMsgBox_SetWidth(".container-fluid", 0.7);
        } else {
            countCorrectAnswers(jsonData);

            // Gives the right answer a green color, and display a list of feedback:
            $("#btnContainer_"+CurrentQuestionId+" > .StudentAnswer").each(function( index, element ) {
                if ($(element).hasClass("CorrectAnswer"))
                    $(element).css(CSS_OBJECT.CorrectAnswer); // Sets the color to the style of .CorrectAnswer which is green...
        
                if ($(element).hasClass("btnPressed")){  // Only if the student has marked an answer as correct, do...
                    // jsonData[CurrentQuestionId].answered = true; // Locks the student question for further answers/alterations to their first/initial answer.
                    if (!$(element).hasClass("CorrectAnswer"))
                        $(element).css(CSS_OBJECT.WrongAnswer); // Sets the color to the style of .WrongtAnswer which is red...
                    giveFeedback(jsonData, CurrentQuestionId);   // Give feedback
                }
            });
        }
    });
}


function ReturnAjaxData(Type, Url, Async, DataType) {
    $.ajax({
        type: Type,
        url: Url,
        async: Async,
        dataType: DataType,
        success: function(Data) {
            console.log("ReturnAjaxData: " + JSON.stringify(Data));
            jsonData = JSON.parse(JSON.stringify(Data));
            // JsonExternalData = JSON.parse(JSON.stringify(Data));
            // console.log("HowWhyData: " + HowWhyData);
        }
    }).fail(function() {
        alert("Ajax failed to fetch data - the requested quizdata might not exist...");
    });
}


function ReturnURLPerameters(UlrVarObj){
    var UrlVarStr = window.location.search.substring(1);
    console.log("ReturnURLPerameters - UrlVarStr: " + UrlVarStr);
    var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&");  // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
    console.log("ReturnURLPerameters - UrlVarPairArray: " + UrlVarPairArray);
    for (var i in UrlVarPairArray){
        var UrlVarSubPairArray = UrlVarPairArray[i].split("=");  // & = %3D
        if (UrlVarSubPairArray.length == 2){
            UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
        }
    }
    console.log("ReturnURLPerameters - UlrVarObj: " + JSON.stringify( UlrVarObj ));
    return UlrVarObj;
}



// TEST URL:
// file:///Users/THAN/main-gulp-folder/objekter/kemi_drag/builds/development/index.html?pn=1&dm=1    NOTE: 0 = false, 1 = true
// file:///Users/THAN/main-gulp-folder/objekter/kemi_drag/builds/development/index.html?pn=1&dm=0    NOTE: 0 = false, 1 = true
function SetProgramPerameter(UlrVarObj, file){
    if (UlrVarObj.hasOwnProperty("file") && ((1 <= parseInt(UlrVarObj["file"])) || (parseInt(UlrVarObj["file"]) <= 10000))) file = UlrVarObj["file"];  // PrincipleNum  =  pn
    console.log("SetProgramPerameter - ReturnURLPerameters - Level: " + Level ); 
}


// Controles til width of the UserMsgBox
function UserMsgBox_SetWidth(TargetSelector, WidthPercent){
    var Width = $(TargetSelector).width();
    $("#UserMsgBox").width(WidthPercent*Width);
}

// MARK - 2 -

function getCss(selectorArray, CssProp){
    var sa = selectorArray;
    window.CSS_OBJECT = {};  // Set global object.
    var HTML = '<div id="CSS_OBJECT">';
    for (n in selectorArray){
        HTML += '<span '+((sa[n].indexOf("#")!==-1)?' id="'+sa[n].replace("#","")+'" ':' class="'+((sa[n].indexOf(".")!==-1)?sa[n].replace(".",""):sa[n])+'"')+'>XXX</span>';
    }
    HTML += '</div>';
    console.log("getCss - HTML: " + HTML);
    $("body").append(HTML);
    for (n in selectorArray){
        CSS_OBJECT[sa[n].replace("#","").replace(".","").replace(" ","")] = $(((sa[n].indexOf("#")!==-1)?sa[n]:((sa[n].indexOf(".")!==-1)?sa[n]:'.'+sa[n].replace(" "," .")))).css(CssProp);
        // console.log('XXXX: '+((sa[n].indexOf("#")!==-1)?sa[n]:((sa[n].indexOf(".")!==-1)?sa[n]:'.'+sa[n].replace(" "," ."))));
    }
    console.log("getCss - CSS_OBJECT: " + JSON.stringify(CSS_OBJECT) );
    $("#CSS_OBJECT").remove();
}


function hoverCss(selectorHoverArray){
    console.log("hoverCss - selectorHoverArray 1: " + selectorHoverArray);

    for (n in selectorHoverArray){
        selectorHoverArray[n] = selectorHoverArray[n].split("_hover")[0];
    }
    console.log("hoverCss - selectorHoverArray 2: " + selectorHoverArray);

    Selector = selectorHoverArray.join();
    console.log("hoverCss - Selector 1: " + Selector);

    // return 0;

    Selector = selectorHoverArray.join();
    console.log("hoverCss - Selector 2: " + Selector);

    $( Selector ).hover(
        function() {
            $( this ).addClass( "hover" );
            // $( this ).css(CSS_OBJECT[returnHoverSelector(selectorArray, this) + "_hover"]);

        }, function() {
            $( this ).removeClass( "hover" );
            // $( this ).css(CSS_OBJECT[returnHoverSelector(selectorArray, this)]);
        }
    );

    function returnHoverSelector(selectorArray, thisObj){
        for (n in selectorArray){
            if (selectorArray[n].indexOf(".")!==-1){
                if ($(thisObj).hasClass(selectorArray[n]))
                    return selectorArray[n];
            }
            if (selectorArray[n].indexOf("#")!==-1){
                if ($(thisObj).prop("id") == selectorArray[n])
                    return selectorArray[n];
            }
        }
    }
}



$(document).ready(function() {
// $(window).load(function() {

    var CssProp = ["background-color", "border-top-color", "border-right-color", "border-bottom-color", "border-left-color", "color"];
    getCss([".StudentAnswer", ".CorrectAnswer", ".WrongAnswer", ".btnPressed", ".WrongAnswer_hover"], CssProp);
    console.log("CSS_OBJECT: " + CSS_OBJECT);


    var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj) );

	ReturnAjaxData("GET", "json/QuizData"+UlrVarObj.file+".json", false, "json");

	// returnCarouselHtml(0, jsonData, UlrVarObj);  // TEST

	// returnCarouselItem(3, jsonData);  // TEST

	// returnCarouseList(jsonData);      // TEST

    $("#DataInput").html(returnCarouselHtml(0, jsonData, UlrVarObj));  // Insert carousel HTML

    console.log("jsonData: " + JSON.stringify(jsonData) );

    $("#header").html(jsonData[0].userInterface.header);   // Shows the initial heading.
    $("#subHeader").html(jsonData[0].userInterface.subHeader);    // Shows the initial subheading.

    $(".btnContainer").hide();      // Hides all button containers.
    $("#btnContainer_"+0).show();   // Shows the first button container.

    $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

    CheckStudentAnswers(jsonData);

	userInterfaceChanger(jsonData);

    hoverCss([".CorrectAnswer_hover", ".WrongAnswer_hover"]);

});