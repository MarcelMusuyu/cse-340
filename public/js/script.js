const password_shown = document.querySelector("#password-shown");
if(password_shown){
    password_shown.addEventListener("click", function(){
        const password= document.querySelector("#account_password");
        const type = password.getAttribute("type");
        if (type == "password"){
            password.setAttribute("type", "text");
            password_shown.innerHTML ="🔒";
        }else{
             password.setAttribute("type", "password");
            password_shown.innerHTML = "👁";
        }
    });
}