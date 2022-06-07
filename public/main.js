// const navList = document.querySelector(".nav-list");
// const formWrapper = document.querySelector(".form-wrapper");
// const inputs = document.querySelectorAll(".form-box input[type = 'password']");
// const icons = [...document.querySelectorAll(".form-icon")];
// const spans = [...document.querySelectorAll(".form-box .top span")];
// const userForm = document.querySelector(".user-form");

// [".user-icon" , ".user-link"].forEach((p) => {
//     window.onload  = function() {
//     document.querySelector(p).onClick = () => {
//         userForm.classList.add("show");
//         navList.classList.remove("show");
//         }
//     };
// });

// document.querySelector(".close-form").onClick = () => {
//     userForm.classList.remove("show");
// }

// spans.map((span) => {
//     span.addEventListener("click", (e) => {
//         const color = e.target.dataset.id;
//         formWrapper.classList.toggle("active");
//         userForm.classList.toggle("active");
//         document.querySelector(":root").style.setProperty("--custom", color);
//     });
// });
// document.querySelectorAll(".itemId").forEach((input) => {
//     input.style.visibility = "hidden";
// })
var logged = document.getElementsByClassName('loggedOut');
if(logged.length > 0){
    document.querySelector(".register").style.visibility = "visible";
    document.querySelector(".login").style.visibility = "visible";
    document.querySelector(".order").remove();
    document.querySelector(".cart").remove();
    console.log(document.querySelector(".logout").remove());
    //console.log(document.querySelectorAll(".dis-btn").length);
    document.querySelectorAll(".dis-btn").forEach((button) => {
        button.remove();
    })
}else{
    document.querySelector(".register").remove();
    document.querySelector(".login").remove()
    document.querySelector(".order").style.visibility = "visible";
    document.querySelector(".cart").style.visibility = "visible";
    document.querySelector(".logout").style.visibility = "visible";
}