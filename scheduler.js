*
==================================
Facebook Scheduler Engine
==================================
*/

document.addEventListener("deviceready", function(){

    console.log("Scheduler Started");

    startScheduler();

});


function startScheduler(){

    setInterval(function(){

        checkScheduledPosts();

    }, 60000); // Every 1 minute

}


function checkScheduledPosts(){

    if(typeof db === "undefined"){

        console.log("Database not ready");

        return;

    }

    let now = new Date();

    let currentTime = now.getTime();

    db.transaction(function(tx){

        tx.executeSql(

            `SELECT *
             FROM posts
             WHERE status='pending'`,

            [],

            function(tx,result){

                for(
                    let i = 0;
                    i < result.rows.length;
                    i++
                ){

                    let post =
                        result.rows.item(i);

                    let postTime =
                        new Date(
                            post.schedule_time
                        ).getTime();

                    if(
                        postTime <= currentTime
                    ){

                        processPost(post);

                    }

                }

            },

            function(tx,error){

                console.log(
                    error.message
                );

            }

        );

    });

}


/*
==================================
Process Post
==================================
*/
function processPost(post){

    if(!APP_CONFIG.isCordova){

        // 🧪 FAKE POST IN BROWSER
        console.log("FAKE POST:", post.content);

        markAsPosted(post.id);

        return;
    }

    // 📱 REAL FACEBOOK POST
    postToFacebook(post);
}


/*
==================================
Mark As Posted
==================================
*/

function markAsPosted(id){

    db.transaction(function(tx){

        tx.executeSql(

            `UPDATE posts
             SET status='posted'
             WHERE id=?`,

            [id],

            function(){

                console.log(
                    "Post Marked Posted"
                );

            }

        );

    });

}


/*
==================================
Mark Failed
==================================
*/

function markAsFailed(id){

    db.transaction(function(tx){

        tx.executeSql(

            `UPDATE posts
             SET status='failed'
             WHERE id=?`,

            [id]

        );

    });

}


/*
==================================
Increase Retry Count
==================================
*/

function increaseRetry(id){

    db.transaction(function(tx){

        tx.executeSql(

            `UPDATE posts
             SET retries = retries + 1
             WHERE id=?`,

            [id]

        );

    });

}


/*
==================================
Retry Failed Posts
==================================
*/

function retryFailedPosts(){

    db.transaction(function(tx){

        tx.executeSql(

            `SELECT *
             FROM posts
             WHERE status='failed'
             AND retries < 5`,

            [],

            function(tx,result){

                for(
                    let i = 0;
                    i < result.rows.length;
                    i++
                ){

                    let post =
                        result.rows.item(i);

                    processPost(post);

                }

            }

        );

    });

}


/*
==================================
Notification
==================================
*/

function notifyUser(message){

    alert(message);

}