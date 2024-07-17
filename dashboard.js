// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCNchpc1VOQO9RRuY_LRvb-eCbzK6Uva7E",
    authDomain: "askit-2f176.firebaseapp.com",
    databaseURL: "https://askit-2f176.firebaseio.com",
    projectId: "askit-2f176",
    storageBucket: "askit-2f176.appspot.com",
    messagingSenderId: "653490212793",
    appId: "1:653490212793:web:6c97202ffc216578"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);



list = document.getElementById("surveys-listing-container");
accountSigninSignup = document.getElementById("account-signin-signup");
popupActionLogout = document.getElementById("popup-action-logout");
popupActionDelete = document.getElementById("popup-action-delete");
popupActionCopy = document.getElementById("popup-action-copy");
copyNotify = document.getElementById("copy-notify");

let actionLogout = false;


function CopyToClipboard(value) {
    const el = document.createElement('textarea');
    el.value = "https://askit.netlify.app/survey#" + value;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    copyNotify.style.display = "block"
    setTimeout(function () {
        copyNotify.style.display = "none"
    }, 800);

}

function deleteSurvey(value) {
    firebase.database().ref().child("PublicSurveys").child(value).set(null)
    firebase.database().ref().child("Users").child(userId).child("surveys").child(value).set(null)
    hideActionDeleteSurvey();
}



firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        userId = firebaseUser.uid
        document.getElementById("accountButtons").innerHTML = `<a href="dashboard.html" style="visibility:hidden"><button>Results</button></a>
        <button class="btn-outline" onclick="logout()">Logout</button>`
        firebase.database().ref().child("Users").child(firebaseUser.uid).child("surveys").on('value', snap => {

            // return

            list.innerHTML = ""
            console.log(snap.val())
            var data = snap.val()

            if (data == null) {
                list.innerHTML += "<h2>you have no surveys</h2>"
            }


            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    //console.log(key + " -> " + data[key]);
                    console.log(key);
                    console.log(data[key])


                    var date = new Date(data[key][0])

                    var options = {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                    };

                    var time = date.toLocaleTimeString('en-US', options);
                    var day = date.toLocaleDateString('en-GB', {
                        timeZone: 'UTC'
                    });
                    list.innerHTML += `<div class="surveys-listing">
                    <div class="survey-topic">
                        <a href="https://askit.netlify.app/results#` + key + `">
                            <h2 class="survey-topic-text">` + data[key][1] + `</h2>
                        </a>
                    </div>
                    <div class="time-and-date-wrapper">
                        <div class="time">` + time + `</div>
                        <div class="date">` + day + `</div>
                    </div>
                    <div class="copy-and-delete-wrapper">
                        <div class="copy"><input class="survey-icons"  onclick="actionCopyToClipboard('` + key + `')"  type="image"
                                src="/img/clipboard.png"></div>
                        <div class="delete"><input class="survey-icons"  onclick="actionDeleteSurvey('` + key + `','` + data[key][1] + `')"  type="image"
                                src="/img/delete.png"></div>
                    </div>
                    </div>`
                }
            }

        });

    } else {

        if (actionLogout == false) {
            accountSigninSignup.style.display = "block";
        }



        console.log('not logged in')
        document.getElementById("accountButtons").innerHTML = `<a href="signup.html"><button>Sign Up</button></a>
          <a href="login.html"><button class="btn-outline">Sign In</button></a>`
    }
});

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

function actionDeleteSurvey(value, topic) {
    popupActionDelete.innerHTML = `
    
    <h1>Delete survey "` + topic + `" ?</h1> 
    <button onclick="deleteSurvey('` + value + `')"> yes </button>
    <button onclick="hideActionDeleteSurvey()">no</button>`;

    popupActionDelete.style.display = "block";

}

function hideActionDeleteSurvey() {
    popupActionDelete.style.display = "none";
}

function actionCopyToClipboard(value) {
    popupActionCopy.style.display = "block";

    popupActionCopy.innerHTML = `      
    
    <h2 class="popup-action-copy-link"><a href="https://askit.netlify.app/survey.html#` + value + `" target="_blank"> https://askit.netlify.app/survey.html#` + value + `</a></h2>
  
    <button onclick="hideActionCopyToClipboard()">Close</button>
  
    <button onclick="CopyToClipboard('` + value + `')">Copy Link</button>    
    
    `

}

function hideActionCopyToClipboard() {
    popupActionCopy.style.display = "none";

}
