function applyUserSettings(){

    // ===== THEME =====
    let theme = localStorage.getItem("theme");

    if(theme === "dark"){
        document.body.classList.add("dark");
    }else{
        document.body.classList.remove("dark");
    }

    // ===== PROFILE IMAGE =====
    let image = localStorage.getItem("profile_image");

    let avatar = document.getElementById("userAvatar");

    if(avatar && image){
        avatar.src = image;
    }

    // ===== PROFILE NAME =====
    let name = localStorage.getItem("profile_name");

    let username = document.getElementById("userName");

    if(username && name){
        username.innerHTML = name;
    }
}