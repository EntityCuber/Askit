// Linking Buttons (Add Question, Submit), input , Question number , submit box (hidden), survey submit button , survey topic input, survey.html next button, survey answer input
Btn_Add_Question = document.getElementsByClassName("add-question-button")[0];
Btn_Submit = document.getElementById("submit-button");
Input_Question = document.getElementsByClassName("question-input")[0];
Number_Question = document.getElementsByClassName("label")[0];
Box_Submit = document.getElementById("submit-box");
Box_Submit_Container = document.getElementById("pop-up-container");
Btn_Create_Survey = document.getElementById("create-survey-button");
Input_Survey_Topic = document.getElementById("survey-topic-input");
Label_Heading = document.getElementById("heading");
Btn_Show_Results = document.getElementById("ShowResultsBtn");
Btn_Copy_Link = document.getElementById("CopyBtn");
accountSigninSignup = document.getElementById("account-signin-signup");
copyNotify = document.getElementById("copy-notify");
popupActionLogout = document.getElementById("popup-action-logout");

Btn_Submit.disabled = true
//Adding Event listener (Add Question, Submit, Create Survey)
Btn_Submit.addEventListener("click", Submit)
Btn_Create_Survey.addEventListener("click", CreateSurvey)
Btn_Add_Question.addEventListener("click", AddQuestion)
Btn_Copy_Link.addEventListener("click", CopyToClipboard)

// Execute a function when the user releases a key on the keyboard
Input_Question.addEventListener("keyup", function (event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        Btn_Add_Question.click();
    }
});


// Variables
Questions = []
let actionLogout = false

//////Cookies

var createCookie = function (name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
    return "";
}

// check whether user has old surveys made from this website

if (getCookie('data') != "") {

    cookie_Data = getCookie('data')
    //document.getElementById("Last_Results_Popup_Box").style.display = "block"
    //createCookie('data', '', 1000)
}

function closeLastResultsPopupBox() {
    document.getElementById("Last_Results_Popup_Box").style.display = "none"
}

function openLastResults() {
    window.location.href = "/results.html#" + cookie_Data
}

// OpenResultsPopupBox
function closeLastResultsPopupBox() {
    document.getElementById("Last_Results_Popup_Box").style.display = "none"
}

function openLastResults() {
    window.location.href = "/results.html#" + cookie_Data
}


// Functions for buttons
function AddQuestion() {
    if (Input_Question.value == false) {
        Input_Question.focus();
    } else if (Input_Question.value.length > 201) {
        alert("Question shouldn't exeed 200 characters.")
    } else {
        Questions.push(Input_Question.value)
        Input_Question.value = ""
        Number_Question.innerHTML = "Question " + (Questions.length + 1)
        Input_Question.focus()
    }
}

function Submit() {

    if (Questions.length == false) {
        Btn_Add_Question.focus()
    } else {
        Box_Submit.style.display = "block"
        Box_Submit_Container.style.display = "block"
        //storeQuestions(Questions)

        var divsToHide = document.getElementsByClassName("step");
        for (var i = 0; i < divsToHide.length; i++) {
            //divsToHide[i].style.visibility = "hidden";
            divsToHide[i].style.display = "none";
        }

    }
}


function CreateSurvey() {
    if (Input_Survey_Topic.value == false) {
        alert("please add topic")
    } else {
        // upload all questions to db with topic as reference
        storeQuestions(Questions)

    }
}

function CopyToClipboard() {
    const el = document.createElement('textarea');
    el.value = survey_url;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy')
    document.body.removeChild(el);
    copyNotify.style.display = "block"
    setTimeout(function () {
        copyNotify.style.display = "none"
    }, 800);


}

function showKey(code) {
    createCookie('data', code, 1000)

    Box_Submit.style.display = "none"
    Box_Submit_Container.style.display = "none"
    hideAll()
    Btn_Copy_Link.style.display = "block"

    Number_Question.innerHTML = "share this url to your friends"
    survey_url = "https://askit.netlify.app/survey#" + code
    results_url = "https://askit.netlify.app/results#" + code
    Label_Heading.innerHTML = "<a href=" + survey_url + " target='_blank' >" + survey_url + "</a>"

    firebase.database().ref().child("Users").child(userid).child("surveys").child(code).set([Date(), Input_Survey_Topic.value])

    //Btn_Show_Results.innerHTML = "<a class='show-result-btn-a' href=" + results_url + " target='_blank' >" + " <button> Show Results </button> </a> "
}

function hideAll() {
    Btn_Add_Question.style.display = "none"
    Btn_Submit.style.display = "none"
    Box_Submit_Container.style.display = "none"
    Input_Question.style.display = "none"
    //Number_Question.style.display = "none"
    Box_Submit.style.display = "none"
    Btn_Create_Survey.style.display = "none"
    Input_Survey_Topic.style.display = "none"
}


firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        document.getElementById("accountButtons").innerHTML = `<a href="dashboard.html"><button>Results</button></a>
        <button class="btn-outline" onclick="logout()">Logout</button>`
        firebase.database().ref().child("Users").child(firebaseUser.uid).child("Credentials").on('value', snap => {
            console.log(snap.val())
            username = snap.val()[0]
            console.log("enabled")
            Btn_Submit.disabled = false
        })

        userid = firebaseUser.uid

    } else {

        if (actionLogout == false) {
            accountSigninSignup.style.display = "block"
        }

        document.getElementById("accountButtons").innerHTML = `<a href="signup.html"><button>Sign Up</button></a>
        <a href="login.html"><button class="btn-outline">Sign In</button></a>`
        Btn_Add_Question.disabled = "true"
        Btn_Submit.disabled = "true"
        Input_Question.disabled = "true"


    }
})

function logout() {
    popupActionLogout.style.display = "block";
}

function logoutNo() {
    popupActionLogout.style.display = "none";
}

function logoutYes() {
    actionLogout = true;
    firebase.auth().signOut();
    popupActionLogout.style.display = "none";
    window.location.href = "/";
}
