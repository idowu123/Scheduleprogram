

(function(){

    /*
    =========================
    AUTO WORKER ENGINE
    =========================
    Runs every 10 seconds
    */
    
    function runWorker(){
    
        let posts = JSON.parse(localStorage.getItem("posts") || "[]");
    
        let now = new Date();
        let changed = false;
    
        posts.forEach(post => {
    
            let postTime = new Date(post.schedule_time);
    
            // If time passed and still pending → mark missed
            if(post.status === "pending" && postTime < now){
                post.status = "missed";
                changed = true;
            }
    
        });
    
        if(changed){
            localStorage.setItem("posts", JSON.stringify(posts));
    
            // Notify pages if open
            window.dispatchEvent(new Event("storageUpdate"));
        }
    }
    
    
    /*
    =========================
    START LOOP
    =========================
    */
    
    setInterval(runWorker, 10000); // every 10 seconds
    
    runWorker(); // run immediately
    
    })();