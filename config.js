const FB_APP_ID = "YOUR_APP_ID_HERE";

const FB_REDIRECT =
"https://www.facebook.com/connect/login_success.html";

function getFacebookLoginURL(){

    return (
        "https://www.facebook.com/v20.0/dialog/oauth" +
        "?client_id=" + FB_APP_ID +
        "&redirect_uri=" + FB_REDIRECT +
        "&response_type=token" +
        "&scope=pages_manage_posts,pages_read_engagement"
    );
}