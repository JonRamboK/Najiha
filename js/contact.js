// ============================================================
// CONTACT FORM — writes to Firestore "messages" collection
// ============================================================

import { db, collection, addDoc, serverTimestamp, showToast, auth } from "./firebase-core.js";

const form = document.getElementById("contactForm");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const phone = document.getElementById("contactPhone").value.trim();
        const subject = document.getElementById("contactSubject").value.trim();
        const body = document.getElementById("contactMessage").value.trim();

        if (!name || !email || !body) {
            showToast("Please fill in your name, email and message.", "error");
            return;
        }

        const btn = document.getElementById("contactSubmitBtn");
        btn.disabled = true;
        btn.innerHTML = `<span class="loading-spinner"></span><span>Sending...</span>`;

        try {
            await addDoc(collection(db, "messages"), {
                name, email, phone, subject: subject || "General inquiry", body,
                uid: auth.currentUser?.uid || null,
                status: "unread",
                createdAt: serverTimestamp()
            });
            showToast("Message sent! We'll get back to you soon.", "success");
            form.reset();
        } catch (err) {
            console.error(err);
            showToast("Could not send your message. Please try again.", "error");
        } finally {
            btn.disabled = false;
            btn.innerHTML = `<i class="fa-solid fa-paper-plane"></i> Send message`;
        }
    });
}
