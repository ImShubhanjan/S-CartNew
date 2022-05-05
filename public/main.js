const navList = document.querySelector(".nav-list");
const formWrapper = document.querySelector(".form-wrapper");
const inputs = document.querySelectorAll(".form-box input[type = 'password']");
const icons = [...document.querySelectorAll(".form-icon")];
const spans = [...document.querySelectorAll(".form-box .top span")];
const userForm = document.querySelector(".user-form");

[".user-icon" , ".user-link"].forEach((p) => {
    window.onload  = function() {
    document.querySelector(p).onClick = () => {
        userForm.classList.add("show");
        navList.classList.remove("show");
        }
    };
});

document.querySelector(".close-form").onClick = () => {
    userForm.classList.remove("show");
}

spans.map((span) => {
    span.addEventListener("click", (e) => {
        const color = e.target.dataset.id;
        formWrapper.classList.toggle("active");
        userForm.classList.toggle("active");
        document.querySelector(":root").style.setProperty("--custom", color);
    });
});