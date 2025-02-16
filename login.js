document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        
        if (email && password) {
            alert(`Logging in as: ${email}`);
            loginForm.reset();
        } else {
            alert("Please fill in all fields.");
        }
    });

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = signupForm.name.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        
        if (name && email && password) {
            alert(`Signing up as: ${name}`);
            signupForm.reset();
        } else {
            alert("Please fill in all fields.");
        }
    });
});
