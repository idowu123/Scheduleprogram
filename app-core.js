
function applyTheme(){

    let theme = localStorage.getItem("theme");

    if(theme === "dark"){
        document.body.classList.add("dark");
    }else{
        document.body.classList.remove("dark");
    }
}