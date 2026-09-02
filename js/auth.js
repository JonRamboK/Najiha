// ============================================================
// Firebase Authentication — Login / Register forms
// ============================================================

import {
    auth, db, googleProvider, facebookProvider,
    doc, setDoc, getDoc, serverTimestamp,
    postLoginRedirect
} from "./firebase-core.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function getElement(id) { return document.getElementById(id); }

function showMessage(message, type = "error") {
    const box = getElement("message");
    if (!box) return;
    box.textContent = message;
    box.className = `message show ${type}`;
}

function hideMessage() {
    const box = getElement("message");
    if (!box) return;
    box.className = "message";
}

function setButtonLoading(button, loading, text) {
    if (!button) return;
    button.disabled = loading;
    button.innerHTML = loading
        ? `<span class="loading-spinner"></span><span>Please wait...</span>`
        : text;
}

function firebaseErrorMessage(error) {
    const code = error?.code || "";
    const messages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "The password is too weak.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/invalid-credential": "Email or password is incorrect.",
        "auth/popup-closed-by-user": "Login popup was closed.",
        "auth/popup-blocked": "Your browser blocked the login popup.",
        "auth/account-exists-with-different-credential": "An account already exists using another login method.",
        "auth/network-request-failed": "Network error. Please check your internet connection.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/operation-not-allowed": "Email/Password sign-in isn't enabled for this project yet. In Firebase Console → Authentication → Sign-in method, enable Email/Password.",
        "auth/unauthorized-domain": "This domain isn't authorized in Firebase. Add it under Authentication → Settings → Authorized domains.",
        "auth/api-key-not-valid": "This Firebase project's API key looks invalid — check config.js.",
        "permission-denied": "Firestore blocked this write. Check your Firestore security rules.",
        "timeout": "This is taking too long — check your internet connection and Firebase project setup, then try again."
    };
    return messages[code] || error?.message || "Something went wrong. Please try again.";
}

/** Rejects with { code: "timeout" } if the given promise doesn't settle in time,
 *  so a submit button can never stay stuck on "Please wait..." forever. */
function withTimeout(promise, ms = 15000) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject({ code: "timeout" }), ms))
    ]);
}

// ------------------------------------------------------------
// Password validation + strength UI
// ------------------------------------------------------------

function checkPassword(password) {
    return {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
}

function isStrongPassword(password) {
    return Object.values(checkPassword(password)).every(Boolean);
}

function updatePasswordStrength(password) {
    const progress = getElement("strengthProgress");
    const text = getElement("strengthText");
    if (!progress || !text) return;

    const result = checkPassword(password);
    const score = Object.values(result).filter(Boolean).length;
    const percentage = score * 20;
    progress.style.width = `${percentage}%`;
    progress.style.background =
        score <= 2 ? "var(--danger)" : score <= 4 ? "var(--warning)" : "var(--success)";

    text.textContent = score === 0 ? "Enter password" : score <= 2 ? "Weak" : score <= 4 ? "Good" : "Strong";

    const rules = {
        ruleLength: result.length, ruleUpper: result.upper, ruleLower: result.lower,
        ruleNumber: result.number, ruleSpecial: result.special
    };
    Object.entries(rules).forEach(([id, valid]) => {
        const el = getElement(id);
        if (el) el.classList.toggle("valid", valid);
    });
}

// ------------------------------------------------------------
// Password show / hide
// ------------------------------------------------------------

document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const target = getElement(button.dataset.target);
        if (!target) return;
        const icon = button.querySelector("i");
        if (target.type === "password") {
            target.type = "text";
            icon.className = "fa-regular fa-eye-slash";
        } else {
            target.type = "password";
            icon.className = "fa-regular fa-eye";
        }
    });
});

// ------------------------------------------------------------
// Save / merge a user profile document in Firestore
// ------------------------------------------------------------

async function saveUserProfile(user, extra = {}) {
    await setDoc(
        doc(db, "users", user.uid),
        {
            uid: user.uid,
            email: user.email || "",
            photoURL: user.photoURL || "",
            fullName: user.displayName || extra.fullName || "",
            status: "active",
            updatedAt: serverTimestamp(),
            ...extra
        },
        { merge: true }
    );
}

// ------------------------------------------------------------
// Register
// ------------------------------------------------------------

const registerForm = getElement("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideMessage();

        const firstName = getElement("firstName").value.trim();
        const lastName = getElement("lastName").value.trim();
        const username = getElement("username").value.trim().toLowerCase();
        const email = getElement("registerEmail").value.trim().toLowerCase();
        const dob = getElement("dateOfBirth").value;
        const gender = getElement("gender").value;
        const password = getElement("registerPassword").value;
        const confirmPassword = getElement("confirmPassword").value;
        const terms = getElement("terms").checked;

        if (!firstName || !lastName) return showMessage("Please enter your first and last name.");
        if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) return showMessage("Username must be 3–30 characters and contain only letters, numbers or underscore.");
        if (!email.endsWith("@gmail.com")) return showMessage("Please use a Gmail address ending with @gmail.com.");
        if (!dob) return showMessage("Please select your date of birth.");
        if (!gender) return showMessage("Please select your gender.");
        if (!isStrongPassword(password)) return showMessage("Please create a strong password with 8+ characters, uppercase, lowercase, number and special character.");
        if (password !== confirmPassword) return showMessage("Passwords do not match.");
        if (!terms) return showMessage("Please accept the Terms & Conditions.");

        let internationalPhone = "";
        if (typeof getInternationalPhone === "function") internationalPhone = getInternationalPhone();

        const button = getElement("registerBtn");
        setButtonLoading(button, true, "Create Account");

        try {
            const userCredential = await withTimeout(createUserWithEmailAndPassword(auth, email, password));
            const user = userCredential.user;
            const fullName = `${firstName} ${lastName}`;

            await withTimeout(updateProfile(user, { displayName: fullName }));

            await withTimeout(saveUserProfile(user, {
                firstName, lastName, fullName, username,
                phone: internationalPhone, dateOfBirth: dob, gender,
                provider: "password", createdAt: serverTimestamp()
            }));

            showMessage("Account created successfully! Redirecting...", "success");
            setTimeout(() => { window.location.href = postLoginRedirect(); }, 1200);

        } catch (error) {
            console.error(error);
            showMessage(firebaseErrorMessage(error));
        } finally {
            setButtonLoading(button, false, "Create Account");
        }
    });
}

// ------------------------------------------------------------
// Login
// ------------------------------------------------------------

const loginForm = getElement("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        hideMessage();

        const email = getElement("loginEmail").value.trim().toLowerCase();
        const password = getElement("loginPassword").value;

        if (!email) return showMessage("Please enter your email.");
        if (!password) return showMessage("Please enter your password.");

        const button = getElement("loginBtn");
        setButtonLoading(button, true, "Login");

        try {
            await withTimeout(signInWithEmailAndPassword(auth, email, password));
            showMessage("Login successful! Redirecting...", "success");
            setTimeout(() => { window.location.href = postLoginRedirect(); }, 900);
        } catch (error) {
            console.error(error);
            showMessage(firebaseErrorMessage(error));
        } finally {
            setButtonLoading(button, false, "Login");
        }
    });
}

// ------------------------------------------------------------
// Google / Facebook
// ------------------------------------------------------------

async function socialLogin(provider, providerName) {
    hideMessage();
    try {
        const result = await withTimeout(signInWithPopup(auth, provider));
        const user = result.user;
        await withTimeout(saveUserProfile(user, { provider: providerName }));
        window.location.href = postLoginRedirect();
    } catch (error) {
        console.error(error);
        showMessage(firebaseErrorMessage(error));
    }
}

["googleLogin", "googleRegister"].forEach((id) => {
    const el = getElement(id);
    if (el) el.addEventListener("click", () => socialLogin(googleProvider, "google"));
});

["facebookLogin", "facebookRegister"].forEach((id) => {
    const el = getElement(id);
    if (el) el.addEventListener("click", () => socialLogin(facebookProvider, "facebook"));
});

function instagramLogin() {
    showMessage("Instagram Login requires a Meta/Instagram OAuth application and a secure backend. Firebase does not provide Instagram as a built-in provider.", "info");
}

["instagramLogin", "instagramRegister"].forEach((id) => {
    const el = getElement(id);
    if (el) el.addEventListener("click", instagramLogin);
});

// ------------------------------------------------------------
// Forgot password
// ------------------------------------------------------------

const forgotPassword = getElement("forgotPassword");

if (forgotPassword) {
    forgotPassword.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = getElement("loginEmail").value.trim().toLowerCase();
        if (!email) return showMessage("First enter your Gmail address, then click Forgot Password.");
        if (!email.endsWith("@gmail.com")) return showMessage("Please enter a valid Gmail address.");
        try {
            await sendPasswordResetEmail(auth, email);
            showMessage("Password reset email has been sent to your Gmail.", "success");
        } catch (error) {
            console.error(error);
            showMessage(firebaseErrorMessage(error));
        }
    });
}

// ------------------------------------------------------------
// Password strength listener
// ------------------------------------------------------------

const passwordInput = getElement("registerPassword");
if (passwordInput) {
    passwordInput.addEventListener("input", () => updatePasswordStrength(passwordInput.value));
}

// ------------------------------------------------------------
// If already logged in, skip straight to home
// ------------------------------------------------------------

import { onAuthReady } from "./firebase-core.js";
let firstCheck = true;
onAuthReady((user) => {
    if (firstCheck && user) {
        window.location.href = postLoginRedirect();
    }
    firstCheck = false;
});

// ------------------------------------------------------------
// Phone input library
// ------------------------------------------------------------

const phoneScript = document.createElement("script");
phoneScript.src = "https://cdn.jsdelivr.net/npm/intl-tel-input@25.3.1/build/js/intlTelInput.min.js";
phoneScript.onload = () => {
    if (typeof initializePhoneInput === "function") initializePhoneInput();
};
document.head.appendChild(phoneScript);
