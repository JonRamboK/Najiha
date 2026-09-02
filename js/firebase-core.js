// ============================================================
// FIREBASE CORE — shared across every page
// Initializes Firebase once and exposes auth / Firestore /
// storage plus small cross-page helpers (toast, login gate).
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut,
    GoogleAuthProvider,
    FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    where,
    limit,
    onSnapshot,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-storage.js";

import { firebaseConfig } from "./config.js";

// ------------------------------------------------------------
// Init
// ------------------------------------------------------------

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
export const facebookProvider = new FacebookAuthProvider();

// Re-export the Firestore helpers so other modules only need one import line
export {
    collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc,
    query, orderBy, where, limit, onSnapshot, serverTimestamp, onAuthStateChanged, signOut
};

// ------------------------------------------------------------
// Admin allow-list — emails here get access to admin.html
// ------------------------------------------------------------

export const ADMIN_EMAILS = [
    "admin@najihacloset.com",
    "owner@najihacloset.com",
    "ali1@gmail.com"
];

export function isAdminEmail(email) {
    return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

// ------------------------------------------------------------
// Current user cache (kept in sync by onAuthStateChanged below)
// ------------------------------------------------------------

export let currentUser = null;
const authReadyCallbacks = [];

onAuthStateChanged(auth, (user) => {
    currentUser = user;
    authReadyCallbacks.forEach((cb) => cb(user));
    document.dispatchEvent(new CustomEvent("nc-auth-changed", { detail: { user } }));
});

export function onAuthReady(callback) {
    authReadyCallbacks.push(callback);
}

// ------------------------------------------------------------
// Toast notifications (used on every page)
// ------------------------------------------------------------

export function showToast(message, type = "success") {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-stack";
        document.body.appendChild(stack);
    }
    const icon = type === "success" ? "fa-circle-check" : type === "error" ? "fa-circle-exclamation" : "fa-circle-info";
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    stack.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "opacity .3s";
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// ------------------------------------------------------------
// Login gate — shows the "please sign in" modal and, on confirm,
// sends the visitor to index.html with a return path so they land
// back where they were (e.g. after adding to cart or checking out).
// ------------------------------------------------------------

export function requireLogin(actionLabel = "continue") {
    return new Promise((resolve) => {
        if (currentUser) {
            resolve(true);
            return;
        }
        openLoginGate(actionLabel);
        resolve(false);
    });
}

function openLoginGate(actionLabel) {
    let overlay = document.getElementById("loginGateModal");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loginGateModal";
        overlay.className = "modal-overlay";
        overlay.innerHTML = `
            <div class="modal-box modal-narrow">
                <button class="modal-close" data-close-gate><i class="fa-solid fa-xmark"></i></button>
                <div class="modal-icon"><i class="fa-solid fa-user-lock"></i></div>
                <h3>Please sign in</h3>
                <p id="loginGateText">Sign in to your account to ${actionLabel}. It only takes a moment.</p>
                <div class="modal-actions">
                    <button class="btn btn-primary btn-block" data-gate-login><i class="fa-solid fa-arrow-right-to-bracket"></i> Login</button>
                    <button class="btn btn-outline btn-block" data-gate-register><i class="fa-solid fa-user-plus"></i> Create account</button>
                </div>
            </div>`;
        document.body.appendChild(overlay);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay || e.target.closest("[data-close-gate]")) {
                overlay.classList.remove("show");
                document.body.classList.remove("no-scroll");
            }
        });
        overlay.querySelector("[data-gate-login]").addEventListener("click", () => {
            const returnTo = encodeURIComponent(location.pathname.split("/").pop() + location.search);
            location.href = `login.html?next=${returnTo}`;
        });
        overlay.querySelector("[data-gate-register]").addEventListener("click", () => {
            const returnTo = encodeURIComponent(location.pathname.split("/").pop() + location.search);
            location.href = `register.html?next=${returnTo}`;
        });
    } else {
        overlay.querySelector("#loginGateText").textContent = `Sign in to your account to ${actionLabel}. It only takes a moment.`;
    }
    overlay.classList.add("show");
    document.body.classList.add("no-scroll");
}

// After a successful login/register, send the visitor back to wherever
// they came from (stored as ?next=page.html), defaulting to index.html.
export function postLoginRedirect() {
    const params = new URLSearchParams(location.search);
    const next = params.get("next");
    return next ? decodeURIComponent(next) : "index.html";
}
