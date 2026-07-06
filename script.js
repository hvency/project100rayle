const track = document.querySelector(".articles-track");

if (track) {
    track.addEventListener("mouseenter", () => {
        track.style.animationPlayState = "paused";
    });

    track.addEventListener("mouseleave", () => {
        track.style.animationPlayState = "running";
    });
}

// ===============================
// EMAILJS INITIALIZATION
// ===============================

emailjs.init({
    publicKey: "dhaBWdur04A0Xg9UV"
});

// ===============================
// CONSULTATION FORM
// ===============================

const consultationForm = document.getElementById("consultationForm");

if (consultationForm) {

    consultationForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const submitBtn = consultationForm.querySelector("button");

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        emailjs.sendForm(
            "service_4835g3f",
            "template_6lot8gq",
            consultationForm
        )

        .then(() => {

            alert("Your consultation request has been sent successfully!");

            consultationForm.reset();

        })

        .catch((error) => {

            console.error(error);

            alert("Something went wrong. Please try again.");

        })

        .finally(() => {

            submitBtn.disabled = false;
            submitBtn.textContent = "Send Consultation Request";

        });

    });

}

// ===============================
// LOGIN MODAL
// ===============================

const loginModal = document.getElementById("loginModal");

const openLogin = document.getElementById("openLogin");

const closeLogin = document.getElementById("closeLogin");

if(openLogin){

    openLogin.addEventListener("click", () => {

        loginModal.classList.add("active");

    });

}

if(closeLogin){

    closeLogin.addEventListener("click", () => {

        loginModal.classList.remove("active");

    });

}

window.addEventListener("click", function(e){

    if(e.target === loginModal){

        loginModal.classList.remove("active");

    }

});

// ===============================
// SIGNUP MODAL
// ===============================

const signupModal = document.getElementById("signupModal");

const openSignup = document.getElementById("openSignup");

const closeSignup = document.getElementById("closeSignup");

const switchSignup = document.getElementById("switchSignup");

const switchLogin = document.getElementById("switchLogin");

if(openSignup){

    openSignup.addEventListener("click", () => {

        signupModal.classList.add("active");

    });

}

if(closeSignup){

    closeSignup.addEventListener("click", () => {

        signupModal.classList.remove("active");

    });

}

// Switch Login → Signup

if(switchSignup){

    switchSignup.addEventListener("click", () => {

        loginModal.classList.remove("active");

        signupModal.classList.add("active");

    });

}

// Switch Signup → Login

if(switchLogin){

    switchLogin.addEventListener("click", () => {

        signupModal.classList.remove("active");

        loginModal.classList.add("active");

    });

}

window.addEventListener("click", function(e){

    if(e.target === signupModal){

        signupModal.classList.remove("active");

    }

});

// ===============================
// FAKE LOGIN / SIGN UP
// ===============================

const guestSection = document.getElementById("guestSection");
const userSection = document.getElementById("userSection");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function showLoggedInState(){

    loginModal.classList.remove("active");
    signupModal.classList.remove("active");

    guestSection.style.display = "none";
    userSection.style.display = "block";

}

if(loginForm){

    loginForm.addEventListener("submit", function(e){

        e.preventDefault();

        showLoggedInState();

    });

}

if(signupForm){

    signupForm.addEventListener("submit", function(e){

        e.preventDefault();

        showLoggedInState();

    });

}

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click", function(){

        userSection.style.display = "none";
        guestSection.style.display = "block";

    });

}

// ===============================
// BOOKING MODAL
// ===============================

const bookingModal = document.getElementById("bookingModal");

const closeBooking = document.getElementById("closeBooking");

const bookingService = document.getElementById("selectedService");

const bookButtons = document.querySelectorAll(".book-service-btn");

bookButtons.forEach(button => {

    button.addEventListener("click", function(){

        // User must sign in first

        if(userSection.style.display !== "block"){

            loginModal.classList.add("active");

            return;

        }

        // Fill selected service

        bookingService.value = this.dataset.service;

        // Open booking modal

        bookingModal.classList.add("active");

    });

});

// Close booking modal

if(closeBooking){

    closeBooking.addEventListener("click", () => {

        bookingModal.classList.remove("active");

    });

}

// Close when clicking outside

window.addEventListener("click", function(e){

    if(e.target === bookingModal){

        bookingModal.classList.remove("active");

    }

});

// ===============================
// BOOKING FORM
// ===============================

const bookingForm = document.getElementById("bookingForm");

if(bookingForm){

    bookingForm.addEventListener("submit", function(e){

        e.preventDefault();

        alert("Your booking request has been submitted successfully!");

        bookingForm.reset();

        bookingModal.classList.remove("active");

    });

}

// ===============================
// APPOINTMENTS MODAL
// ===============================

const appointmentsModal = document.getElementById("appointmentsModal");

const viewAppointments = document.getElementById("viewAppointments");

const closeAppointments = document.getElementById("closeAppointments");

const bookFromDashboard = document.getElementById("bookFromDashboard");

// Open Appointments Modal

if(viewAppointments){

    viewAppointments.addEventListener("click", function(){

        appointmentsModal.classList.add("active");

    });

}

// Close Appointments Modal

if(closeAppointments){

    closeAppointments.addEventListener("click", function(){

        appointmentsModal.classList.remove("active");

    });

}

// Close when clicking outside

window.addEventListener("click", function(e){

    if(e.target === appointmentsModal){

        appointmentsModal.classList.remove("active");

    }

});

// Book Consultation button inside Dashboard

if(bookFromDashboard){

    bookFromDashboard.addEventListener("click", function(){

        appointmentsModal.classList.remove("active");

        bookingModal.classList.add("active");

    });

}