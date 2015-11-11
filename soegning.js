var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;
var error_total = 0;
var SearchPlaceholderMemory;
// var CssObj = {};



function returnDropdownMarkup(DropdownObj) {
    var Selected = 0;
    var DO = DropdownObj;
    var HTML = '<select' + ((DO.hasOwnProperty("id")) ? ' id="' + DO.id + '"' : "") + ((DO.hasOwnProperty("class")) ? ' class="' + DO.class + '"' : "") + '>';
    if (DO.hasOwnProperty("selected"))
        Selected = parseInt(DO.selected);
    console.log("returnDropdownMarkup - Selected: " + Selected);
    var DOO = DropdownObj.options;
    for (n in DOO) {
        HTML += '<option' + ((DOO[n].hasOwnProperty("id")) ? ' id="' + DOO[n].id + '"' : "") + ((DOO[n].hasOwnProperty("class")) ? ' class="' + DOO[n].class + '"' : "") + ((n == Selected) ? ' disabled selected' : "") + ' value="' + ((n == Selected) ? '' : DOO[n].value) + '">' + DOO[n].value + '</option>';
        // HTML += '<option'+((DOO[n].hasOwnProperty("id"))?' id="'+DOO[n].id+'"':"")+((DOO[n].hasOwnProperty("class"))?' class="'+DOO[n].class+'"':"")+' value="'+DOO[n].value+'">'+DOO[n].value+'</option>';
    };
    HTML += "</select>";
    return HTML;
}
var TDropdown = {
    id: "Dropdown1",
    class: "Dropdown",
    selected: "1",
    options: [{
        id: "id1",
        class: "class1",
        value: "val 1"
    }, {
        id: "id2",
        class: "class2",
        value: "val 2"
    }, {
        id: "id3",
        class: "class3",
        value: "val 2"
    }]
};
var TDropdown2 = {
    options: [{
        value: "val 1"
    }, {
        value: "val 2"
    }, {
        value: "val 2"
    }]
};
// console.log("returnDropdownMarkup: " + returnDropdownMarkup(TDropdown));
// console.log("returnDropdownMarkup: " + returnDropdownMarkup(TDropdown2));


function returnButtonSecection(DropdownObj) {
    var Selected = 0;
    var DO = DropdownObj;
    // var HTML = '<div'+((DO.hasOwnProperty("id"))?' id="'+DO.id+'"':"")+((DO.hasOwnProperty("class"))?' class="'+DO.class+'"':"")+'>';
    var HTML = "";
    var DOO = DropdownObj.options;
    // for (n in DOO){
    for (var n = 1; n < DOO.length; n++) { // NOTE: n = 1 and up, since the "instruction" in the dropdown should not appear as a button:
        HTML += '<span' + ((DOO[n].hasOwnProperty("id")) ? ' id="' + DOO[n].id + '"' : "") + ' class="btn btn-default' + ((DOO[n].hasOwnProperty("class")) ? ' ' + DOO[n].class : "") + '">' + DOO[n].value + '</span>';
    };
    // HTML += "</div>";
    return HTML;
}
console.log("returnButtonSecection 1: " + returnButtonSecection(TDropdown));



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
        }
    }).fail(function() {
        alert("Ajax failed to fetch data - the requested quizdata might not exist...");
    });
}


function ReturnURLPerameters(UlrVarObj) {
    var UrlVarStr = window.location.search.substring(1);
    console.log("ReturnURLPerameters - UrlVarStr: " + UrlVarStr);
    var UrlVarPairArray = decodeURIComponent(UrlVarStr).split("&"); // decodeURIComponent handles %26" for the char "&" AND "%3D" for the char "=".
    console.log("ReturnURLPerameters - UrlVarPairArray: " + UrlVarPairArray);
    for (var i in UrlVarPairArray) {
        var UrlVarSubPairArray = UrlVarPairArray[i].split("="); // & = %3D
        if (UrlVarSubPairArray.length == 2) {
            UlrVarObj[UrlVarSubPairArray[0]] = UrlVarSubPairArray[1];
        }
    }
    console.log("ReturnURLPerameters - UlrVarObj: " + JSON.stringify(UlrVarObj));
    return UlrVarObj;
}


function returnSearchInterface(jsonData) {
    var JDD = jsonData.DropDowns;
    var HTML = '<div id="DropDownInterface">';
    HTML += '<input id="SearchText" type="text" placeholder="Skriv dine søgeord her..." /> <span class="ErrMsg"></span> <br/>';
    for (var n in JDD) {
        HTML += '<div class="DropdownContainer"> ';
        // HTML += '<div class="DropdownHeader">'+JDD[n].header+'</div>';
        HTML += '<span class="DropdownObj">' + returnDropdownMarkup(JDD[n].obj) + ' <span class="ErrMsg"></span> </span> ';
        HTML += '</div>';
        console.log("returnSearchInterface " + n);
    }
    HTML += '</div>';
    return HTML;
}


$(document).on('click', "#Databases > .btn", function(event) {
    $(this).toggleClass("btnPressed");
});

$(document).on('click', "#Media > .btn", function(event) {
    $("#Media > .btn").removeClass("btnPressed");
    $(this).addClass("btnPressed");
});


$(document).on('click', "#Search", function(event) {
    var SearchText = $("#SearchText").val();
    console.log("Search - SearchText: " + SearchText);

    var Databases = "";
    $("#Databases .btnPressed").each(function(index, element) {
        if ($(element).text().length > 0)
            Databases += ((index > 0) ? "+OR+" : "") + "site:" + $(element).text();
    });
    console.log("Search - Databases: " + Databases);

    var Media = "";
    $("#Media .btnPressed").each(function(index, element) {
        if ($(element).text() == jsonData.DropDowns[1].obj.options[2].value) Media = '&tbm=isch'; // Billede
        if ($(element).text() == jsonData.DropDowns[1].obj.options[3].value) Media = '&tbm=vid'; // Video
    });
    // $("#Media .btn").each(function( index, element ) {
    //     if ($(element).hasClass("btnPressed")){
    //         if ($(element).text() == jsonData.DropDowns[1].obj.options[2].value) Media += '&tbm=isch';  // Billede
    //         if ($(element).text() == jsonData.DropDowns[1].obj.options[3].value) Media += '&tbm=vid';   // Video
    //     }
    // });
    console.log("Search - Media: " + Media);

    var URL = 'http://www.google.dk/?#q=';

    console.log("jsonData.DropDowns[0].obj.options[0]: " + JSON.stringify(jsonData.DropDowns[0].obj.options[0].value));

    if (Databases.length > 0) {
        URL += Databases;
        // $("#Dropdown1").next().text("");
        // $("#Databases .ErrMsg").fadeOut("slow"); // OLD
        $("#DataBaseHeading").removeClass("ErrorColorHeading");
    } else {
        // $("#Databases .ErrMsg").text("Vælg en database!").fadeIn("slow");  // OLD
        $("#DataBaseHeading").addClass("ErrorColorHeading");
        return 0;
    }

    // if (Media.length > 0){
    //     URL += Media;
    //     $("#Media .ErrMsg").fadeOut("slow");
    // } else {
    //     $("#Media .ErrMsg").text("Vælg en medietype!").fadeIn("slow");
    //     return 0;
    // }


    // if (typeof(SearchPlaceholderMemory) === "undefined"){  // Save the placeholder text from the HTML form.
    //     SearchPlaceholderMemory = $("#SearchText").attr("placeholder");
    // }
    

    if (SearchText.length > 0) {
        URL += "+" + SearchText.replace(/\ +/g, "+");
        $("#SearchTextParent").removeClass("ErrorColor");  // NEW
        // $("#SearchText").attr("placeholder", SearchPlaceholderMemory);  // Inset old placeholder text again.
        // $("#SearchText").next().fadeOut("slow");  // OLD
    } else {
        // $("#SearchText").next().text("Skriv nogle søgeord her!").fadeIn("slow");  // OLD
        $("#SearchTextParent").addClass("ErrorColor");   // NEW
        // $("#SearchText").attr("placeholder","Skriv nogle søgeord her!").fadeIn("slow");  // NEW
        return 0;
    }

    URL += Media;

    console.log("Search - URL: " + URL);

    window.open(URL, '_blank');
    //window.location.href = URL;


    // window.location.href = 'https://www.google.dk?q=test';
    // window.location.href = 'https://www.google.dk/#q=test';
    // window.location.href = 'http://www.google.dk/?#q=test+site:google.dk'; // <---------  OK - UDFØRE SØGNING!
    // window.location.href = 'http://www.google.dk/?#q=test+site:eb.dk';  // <---------  OK - UDFØRE SØGNING!
});


$(document).ready(function() {
  
    modal();

    if (window.location.href[window.location.href.length - 6] == 2) {
        $(".modal-body").html("<img src='img/mindmap_ungdomsopror.png'/>");

    } else {
        $(".modal-body").html("<img src='img/mindmap_mockup.png'/>");

    }
    // $(window).load(function() {

    var UlrVarObj = {
        "file": ""
    }; // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj); // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj));

    ReturnAjaxData("GET", "json/QuizData" + UlrVarObj.file + ".json", false, "json");



    $("#DataInput").html(returnSearchInterface(jsonData)); // Insert carousel HTML

    console.log("jsonData: " + JSON.stringify(jsonData));

    $("#header").html(jsonData.userInterface.header); // Shows the initial heading.
    $("#subHeader").html(jsonData.userInterface.subHeader); // Shows the initial subheading.

    $("#Databases").prepend(returnButtonSecection(jsonData.DropDowns[0].obj));

    $("#Media").prepend(returnButtonSecection(jsonData.DropDowns[1].obj));

    $(".btnContainer").hide(); // Hides all button containers.
    $("#btnContainer_" + 0).show(); // Shows the first button container.

    // $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

    console.log("returnSearchInterface: " + returnSearchInterface(jsonData));


    ///////////////////////////////////////////////////


    // $("#id_description_iframe").contents().find("body").html()

    console.log("returnButtonSecection 2: " + returnButtonSecection(jsonData.DropDowns[0].obj));
});
