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

let UsersNames = []

function snapshotToArray(snapshot) {
    var returnArr = [];

    snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        item.key = childSnapshot.key;

        returnArr.push(item);
    });


    UsersNames = returnArr
    // return returnArr;
    return true
};

firebase.database().ref('UsersNames').on('value', function (snapshot) {
    console.log(snapshotToArray(snapshot));
});






//get elements

txtname = document.getElementById("name");
txtEmail = document.getElementById("email");
txtPassword = document.getElementById("password")
txtPassword2 = document.getElementById("password2")
btnSignUp = document.getElementById("btnSignUp")

// sign out when page load
// firebase.auth().signOut()

// verify input

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// test in order
function verifyInput() {
    if (txtname.value == "") {
        alert("empty name")
    } else if (txtname.value.length < 4) {
        alert("minimum 4 length for name")
    } else if (UsersNames.includes(txtname.value)) {
        alert("name already exists")
    } else if (txtEmail.value == "") {
        alert("empty email")
    } else if (!validateEmail(txtEmail.value)) {
        alert("invalid gmail")
    } else if (txtPassword.value == "") {
        alert("empty password")
    } else if (txtPassword.value.length < 6) {
        alert("weak password use atleast 6 characters")
    } else if (txtPassword2.value == "") {
        alert("confirm password by typing again in next input")
    } else if (txtPassword.value != txtPassword2.value) {
        alert("password not matching")
    } else {
        return true
    }
}


// creating

btnSignUp.addEventListener('click', e => {
    if (verifyInput()) {
        const email = txtEmail.value;
        const pass = txtPassword.value;
        const auth = firebase.auth();

        const promise = auth.createUserWithEmailAndPassword(email, pass);
        promise.catch(e => alert(e.message))

    }


})

firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {




        firebase.database().ref().child("UsersNames").push(txtname.value,
            function (error) {
                if (error) {
                    console.log("Data could not be saved." + error);
                } else

                {
                    firebase.database().ref().child("Users").child(firebaseUser.uid).child("Credentials").set([txtname.value, firebaseUser.email, txtPassword.value], function (error) {
                        if (error) {
                            console.log("Data could not be saved." + error);
                        } else {
                            if (window.location.hash.substring(1) == "cs") {
                                window.location.href = window.location.href = "/create-survey.html"

                            } else if (window.location.hash[1] == "-") {

                                window.location.href = "/survey.html#" + window.location.hash.substring(1)

                            } else if (window.location.hash[1] == "d") {

                                window.location.href = "/dashboard.html#" + window.location.hash.substring(1)

                            } else {
                                window.location.href = window.location.href = "/"
                            }
                        }
                    })
                }




            })
    } else {
        console.log('not logged in')
    }
})