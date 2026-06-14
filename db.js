var db;
var IS_CORDOVA = false;

/*
==================================
INITIALIZE DATABASE
==================================
*/

function initDatabase(){

    IS_CORDOVA =
        typeof window.cordova !== "undefined";

    /*
    ==========================
    CORDOVA + SQLITE
    ==========================
    */
    if(IS_CORDOVA){

        document.addEventListener("deviceready", function(){

            db = window.sqlitePlugin.openDatabase({
                name: "scheduler.db",
                location: "default"
            });

            db.transaction(function(tx){

                tx.executeSql(`
                    CREATE TABLE IF NOT EXISTS posts(
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        content TEXT,
                        media TEXT,
                        schedule_time TEXT,
                        status TEXT,
                        retries INTEGER
                    )
                `);

            });

            console.log("SQLite Ready");

        });

    }

    /*
    ==========================
    NORMAL BROWSER
    ==========================
    */
    else{

        console.log("Browser Mode Ready");

        if(!localStorage.getItem("posts")){

            localStorage.setItem(
                "posts",
                JSON.stringify([])
            );

        }

    }

}

/*
==================================
RUN INITIALIZATION
==================================
*/

initDatabase();