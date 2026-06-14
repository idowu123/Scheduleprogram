var db;

/*
==================================
WAIT FOR DATABASE
==================================
*/

window.onload = function(){

    if(typeof window.db !== "undefined"){

        db = window.db;

    }

};


/*
==================================
CREATE POST
==================================
*/

function createPost(content, media, scheduleTime){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                `INSERT INTO posts
                (
                    content,
                    media,
                    schedule_time,
                    status,
                    retries
                )
                VALUES
                (
                    ?,?,?,?,?
                )`,

                [
                    content,
                    media,
                    scheduleTime,
                    "pending",
                    0
                ]

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        posts.push({

            id: Date.now(),

            content: content,

            media: media,

            schedule_time: scheduleTime,

            status: "pending",

            retries: 0

        });

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );

    }

}


/*
==================================
GET POSTS
==================================
*/

function getPosts(callback){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                "SELECT * FROM posts ORDER BY id DESC",

                [],

                function(tx,result){

                    callback(result.rows);

                }

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        callback(posts);

    }

}


/*
==================================
DELETE POST
==================================
*/

function deletePost(id){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                "DELETE FROM posts WHERE id=?",

                [id]

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        posts = posts.filter(function(post){

            return post.id != id;

        });

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );

    }

}


/*
==================================
UPDATE STATUS
==================================
*/

function updateStatus(id,status){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                `UPDATE posts
                 SET status=?
                 WHERE id=?`,

                [status,id]

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        posts.forEach(function(post){

            if(post.id == id){

                post.status = status;

            }

        });

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );

    }

}


/*
==================================
INCREASE RETRIES
==================================
*/

function increaseRetry(id){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                `UPDATE posts
                 SET retries=retries+1
                 WHERE id=?`,

                [id]

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        posts.forEach(function(post){

            if(post.id == id){

                post.retries++;

            }

        });

        localStorage.setItem(
            "posts",
            JSON.stringify(posts)
        );

    }

}


/*
==================================
COUNT POSTS
==================================
*/

function countPosts(callback){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                "SELECT COUNT(*) as total FROM posts",

                [],

                function(tx,result){

                    callback(
                        result.rows.item(0).total
                    );

                }

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        callback(posts.length);

    }

}


/*
==================================
COUNT PENDING
==================================
*/

function countPending(callback){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                `SELECT COUNT(*) as total
                 FROM posts
                 WHERE status='pending'`,

                [],

                function(tx,result){

                    callback(
                        result.rows.item(0).total
                    );

                }

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        let total = posts.filter(function(post){

            return post.status === "pending";

        }).length;

        callback(total);

    }

}


/*
==================================
COUNT POSTED
==================================
*/

function countPosted(callback){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                `SELECT COUNT(*) as total
                 FROM posts
                 WHERE status='posted'`,

                [],

                function(tx,result){

                    callback(
                        result.rows.item(0).total
                    );

                }

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        let total = posts.filter(function(post){

            return post.status === "posted";

        }).length;

        callback(total);

    }

}


/*
==================================
GET NEXT POST
==================================
*/

function getNextPost(callback){

    if(IS_CORDOVA){

        db.transaction(function(tx){

            tx.executeSql(

                `SELECT *
                 FROM posts
                 WHERE status='pending'
                 ORDER BY schedule_time ASC
                 LIMIT 1`,

                [],

                function(tx,result){

                    if(result.rows.length > 0){

                        callback(
                            result.rows.item(0)
                        );

                    }else{

                        callback(null);

                    }

                }

            );

        });

    }else{

        let posts = JSON.parse(
            localStorage.getItem("posts") || "[]"
        );

        let pending = posts.filter(function(post){

            return post.status === "pending";

        });

        pending.sort(function(a,b){

            return new Date(a.schedule_time)
                 - new Date(b.schedule_time);

        });

        if(pending.length > 0){

            callback(pending[0]);

        }else{

            callback(null);

        }

    }

}