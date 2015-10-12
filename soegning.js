var jsonData = "<h1>OK</h1>";
var CurrentQuestionId = 0;
var correct_total = 0;
var error_total = 0;
// var CssObj = {};



function returnDropdownMarkup(DropdownObj){
    var Selected = 0;
    var DO = DropdownObj;
    var HTML = '<select'+((DO.hasOwnProperty("id"))?' id="'+DO.id+'"':"")+((DO.hasOwnProperty("class"))?' class="'+DO.class+'"':"")+'>';
    if (DO.hasOwnProperty("selected"))
            Selected = parseInt( DO.selected );
            console.log("returnDropdownMarkup - Selected: " + Selected);
    var DOO = DropdownObj.options;
    for (n in DOO){
        HTML += '<option'+((DOO[n].hasOwnProperty("id"))?' id="'+DOO[n].id+'"':"")+((DOO[n].hasOwnProperty("class"))?' class="'+DOO[n].class+'"':"")+((n == Selected)?' disabled selected':"")+' value="'+((n == Selected)?'':DOO[n].value)+'">'+DOO[n].value+'</option>';
        // HTML += '<option'+((DOO[n].hasOwnProperty("id"))?' id="'+DOO[n].id+'"':"")+((DOO[n].hasOwnProperty("class"))?' class="'+DOO[n].class+'"':"")+' value="'+DOO[n].value+'">'+DOO[n].value+'</option>';
    };
    HTML += "</select>";
    return HTML;
}
var TDropdown = {id:"Dropdown1", class:"Dropdown", selected: "1",
                    options:[
                        {id:"id1", class:"class1", value:"val 1"},
                        {id:"id2", class:"class2", value:"val 2"},
                        {id:"id3", class:"class3", value:"val 2"}
                    ]
                };
var TDropdown2 = {options:[
                    {value:"val 1"},
                    {value:"val 2"},
                    {value:"val 2"}]
                };
// console.log("returnDropdownMarkup: " + returnDropdownMarkup(TDropdown));
// console.log("returnDropdownMarkup: " + returnDropdownMarkup(TDropdown2));


function returnButtonSecection(DropdownObj){
    var Selected = 0;
    var DO = DropdownObj;
    var HTML = '<div'+((DO.hasOwnProperty("id"))?' id="'+DO.id+'"':"")+((DO.hasOwnProperty("class"))?' class="'+DO.class+'"':"")+'>';
    var DOO = DropdownObj.options;
    for (n in DOO){
        HTML += '<span'+((DOO[n].hasOwnProperty("id"))?' id="'+DOO[n].id+'"':"")+((DOO[n].hasOwnProperty("class"))?' class="'+DOO[n].class+'"':"")+'>'+DOO[n].value+'</span>';
    };
    HTML += "</div>";
    return HTML;
}
console.log("returnButtonSecection: " + returnButtonSecection(TDropdown));


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


function returnSearchInterface(jsonData){
    var JDD = jsonData.DropDowns;
    var HTML = '<div id="DropDownInterface">';
    HTML += '<input id="SearchText" type="text" placeholder="Skriv dine søgeord her..." /> <span class="ErrMsg"></span> <br/>';
    for(var n in JDD){
        HTML += '<div class="DropdownContainer"> ';
            // HTML += '<div class="DropdownHeader">'+JDD[n].header+'</div>';
            HTML += '<span class="DropdownObj">'+returnDropdownMarkup(JDD[n].obj)+' <span class="ErrMsg"></span> </span> ';
        HTML += '</div>';
        console.log("returnSearchInterface " + n);
    }
    HTML += '</div>';
    return HTML;
}





$(document).on('click', "#Search", function(event) { 
    var SearchText = $("#SearchText").val();
    var Dropdown1 = $('#Dropdown1').find(":selected").text();
    var Dropdown2 = $('#Dropdown2').find(":selected").text();
    console.log("Search - SearchText: " + SearchText);
    console.log("Search - Dropdown1: " + Dropdown1);
    console.log("Search - Dropdown2: " + Dropdown2);

    var URL = 'http://www.google.dk/?#q=';
    if (SearchText.length > 0){
        URL += SearchText.replace(/\ +/g, "+");
        // $("#SearchText").next().text("");
        $("#SearchText").next().fadeOut("slow");
    } else {
        $("#SearchText").next().text("Skriv nogle søgeord her!").fadeIn("slow");
        return 0;
    }

    console.log("jsonData.DropDowns[0].obj.options[0]: " + JSON.stringify( jsonData.DropDowns[0].obj.options[0].value ) );

    if (Dropdown1 !== jsonData.DropDowns[0].obj.options[0].value){
        URL += '+site:'+Dropdown1;
        // $("#Dropdown1").next().text("");
        $("#Dropdown1").next().fadeOut("slow");
    } else {
        $("#Dropdown1").next().text("Vælg en database fra listen!").fadeIn("slow");
        return 0;
    }

    if (Dropdown2 !== jsonData.DropDowns[1].obj.options[0].value){
        if (Dropdown2 == jsonData.DropDowns[1].obj.options[2].value) URL += '&tbm=isch';  // Billed
        if (Dropdown2 == jsonData.DropDowns[1].obj.options[3].value) URL += '&tbm=vid';   // Video
        // $("#Dropdown2").next().text("");
        $("#Dropdown2").next().fadeOut("slow");
    } else {
        $("#Dropdown2").next().text("Vælg en medietype fra listen!").fadeIn("slow");
        return 0;
    }

    console.log("Search - URL: " + URL);

    window.location.href = URL;

    // window.location.href = 'https://www.google.dk?q=test';
    // window.location.href = 'https://www.google.dk/#q=test';
    // window.location.href = 'http://www.google.dk/?#q=test+site:google.dk'; // <---------  OK - UDFØRE SØGNING!
    // window.location.href = 'http://www.google.dk/?#q=test+site:eb.dk';  // <---------  OK - UDFØRE SØGNING!
});


$(document).ready(function() {
// $(window).load(function() {

    var UlrVarObj = {"file" : ""};   // Define a default file-refrence (empty) ---> "QuizData.json"
    UlrVarObj = ReturnURLPerameters(UlrVarObj);  // Get URL file perameter.
    console.log("UlrVarObj: " + JSON.stringify(UlrVarObj) );

	ReturnAjaxData("GET", "json/QuizData"+UlrVarObj.file+".json", false, "json");

	

    $("#DataInput").html(returnSearchInterface(jsonData));  // Insert carousel HTML

    console.log("jsonData: " + JSON.stringify(jsonData) );

    $("#header").html(jsonData.userInterface.header);   // Shows the initial heading.
    $("#subHeader").html(jsonData.userInterface.subHeader);    // Shows the initial subheading.

    $(".btnContainer").hide();      // Hides all button containers.
    $("#btnContainer_"+0).show();   // Shows the first button container.

    // $(".QuestionCounter").text(correct_total+'/'+jsonData.length);   // Counts the initial number of correctly answered questions and total number questions and displays them.

    console.log("returnSearchInterface: " + returnSearchInterface(jsonData));


    ///////////////////////////////////////////////////


    // $("#id_description_iframe").contents().find("body").html()


});