/*
====================================
Facebook Authentication (OAuth)
====================================
*/

const FB_APP_ID = "YOUR_FACEBOOK_APP_ID";
const REDIRECT_URI = "https://www.facebook.com/connect/login_success.html";


/*
LOGIN TO FACEBOOK
*/
function loginFacebook(){

  if(!APP_CONFIG.isCordova){

      // 🧪 BROWSER MODE (FAKE LOGIN)
      console.log("Browser mode: fake login");

      localStorage.setItem("fb_token", "TEST_TOKEN_123");

      alert("Fake Facebook Connected (Browser Mode)");

      return;
  }

  // 📱 REAL CORDOVA LOGIN
  let url =
      "https://www.facebook.com/v20.0/dialog/oauth" +
      "?client_id=" + FB_APP_ID +
      "&redirect_uri=https://www.facebook.com/connect/login_success.html" +
      "&response_type=token" +
      "&scope=pages_manage_posts";

  window.location.href = url;
}

/*
HANDLE FACEBOOK REDIRECT
*/
function handleFacebookRedirect(){

    let hash = window.location.hash;

    if(hash.includes("access_token")){

        let token = hash
            .split("access_token=")[1]
            .split("&")[0];

        localStorage.setItem("fb_token", token);

        console.log("Facebook Connected");

        notifyConnectionStatus(true);

    }

}


/*
CHECK IF FACEBOOK IS CONNECTED
*/
function isFacebookConnected(){

    let token =
        localStorage.getItem("fb_token");

    return token !== null;

}


/*
GET FACEBOOK TOKEN
*/
function getFacebookToken(){

    return localStorage.getItem("fb_token");

}


/*
LOGOUT FACEBOOK
*/
function logoutFacebook(){

    localStorage.removeItem("fb_token");

    console.log("Facebook Disconnected");

    notifyConnectionStatus(false);

}


/*
UPDATE UI STATUS
*/
function notifyConnectionStatus(status){

    let el =
        document.getElementById("facebookStatus");

    if(!el) return;

    if(status){

        el.innerHTML = "Connected ✔";
        el.style.color = "green";

    }else{

        el.innerHTML = "Not Connected ✖";
        el.style.color = "red";

    }

}