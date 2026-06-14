*
========================================
Facebook Graph API Posting Engine
========================================
*/

const GRAPH_VERSION = "v20.0";


/*
POST TO FACEBOOK PAGE
*/
function postToFacebook(post){

    let token = getFacebookToken();

    if(!token){

        console.log("No Facebook token found");

        markAsFailed(post.id);

        return;

    }

    let pageId = localStorage.getItem("fb_page_id");

    if(!pageId){

        console.log("No Page ID set");

        markAsFailed(post.id);

        return;

    }

    let url =
        `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/feed`;


    let formData = new URLSearchParams();

    formData.append("message", post.content);
    formData.append("access_token", token);


    fetch(url, {
        method: "POST",
        body: formData
    })

    .then(response => response.json())

    .then(data => {

        if(data.id){

            console.log(
                "Posted Successfully:",
                data.id
            );

            markAsPosted(post.id);

            notifyUser(
                "Post Published Successfully"
            );

        }else{

            console.log(
                "Facebook Error:",
                data
            );

            increaseRetry(post.id);

            if(post.retries >= 3){

                markAsFailed(post.id);

            }

        }

    })

    .catch(error => {

        console.log(
            "Network Error:",
            error
        );

        increaseRetry(post.id);

        if(post.retries >= 3){

            markAsFailed(post.id);

        }

    });

}


/*
SET FACEBOOK PAGE ID
*/
function setFacebookPageId(pageId){

    localStorage.setItem("fb_page_id", pageId);

}


/*
GET FACEBOOK PAGE ID
*/
function getFacebookPageId(){

    return localStorage.getItem("fb_page_id");

}