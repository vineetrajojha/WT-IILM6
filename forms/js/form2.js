// Wait until the page loads
window.onload = function () {
    const form = document.querySelector("form");

    form.onsubmit = function (event) {
        // Prevent form submission until validation passes
        event.preventDefault();

        // Get values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const mobile = document.getElementById("mob").value.trim();
        const password = document.getElementById("pass").value.trim();

        // Name validation (minimum 3 characters)
        if (name.length < 3) {
            alert("Name must be at least 3 characters long.");
            return false;
        }

        // Email validation (basic regex)
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return false;
        }

        // Mobile validation (must be 10 digits)
        const mobilePattern = /^[0-9]{10}$/;
        if (!mobilePattern.test(mobile)) {
            alert("Mobile number must be exactly 10 digits.");
            return false;
        }

        // Password validation
        // At least 12 characters, with uppercase, lowercase, number, and symbol
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/;
        if (!passwordPattern.test(password)) {
            alert("Password must be at least 12 characters long and include uppercase, lowercase, number, and symbol.");
            return false;
        }

        // If all validations pass
        alert("Form submitted successfully!");
        form.submit(); // allow submission
    };
};
