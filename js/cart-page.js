// ============================================================
// CART PAGE — full-page cart summary (uses cart.js as source of truth)
// ============================================================

import { getCartItems, getCartTotal, removeFromCart, updateQty } from "./cart.js";
import { requireLogin, auth, db, collection, addDoc, serverTimestamp, showToast } from "./firebase-core.js";

const wrap = document.getElementById("cartPageWrap");

function render() {
    const items = getCartItems();

    if (!items.length) {
        wrap.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-bag-shopping"></i>
                <h3>Your cart is empty</h3>
                <p>Browse the collection and add your favorite little outfits.</p>
                <a href="index.html" class="btn btn-primary">Start shopping</a>
            </div>`;
        return;
    }

    const rows = items.map((i) => `
        <div class="cart-item" style="padding:16px 0;border-bottom:1px solid var(--line);">
            <img src="${i.image}" alt="${i.name}">
            <div class="cart-item-info">
                <h5>${i.name}</h5>
                <span>Size: ${i.size}</span>
                <div class="qty-control" style="margin-top:6px;">
                    <button data-qty-down="${i.id}|${i.size}">−</button>
                    <span>${i.qty}</span>
                    <button data-qty-up="${i.id}|${i.size}">+</button>
                </div>
                <span class="cart-item-price">Rs. ${(i.price * i.qty).toLocaleString()}</span>
                <button class="cart-item-remove" data-remove="${i.id}|${i.size}"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
        </div>`).join("");

    const total = getCartTotal();

    wrap.innerHTML = `
        <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:30px;align-items:flex-start;">
            <div style="background:#fff;border:1px solid var(--line);border-radius:16px;padding:10px 24px;">${rows}</div>
            <div style="background:#fff;border:1px solid var(--line);border-radius:16px;padding:24px;position:sticky;top:90px;">
                <h3 style="font-family:var(--font-display);font-size:19px;margin-bottom:16px;">Order summary</h3>
                <div class="cart-total-row"><span>Subtotal</span><span>Rs. ${total.toLocaleString()}</span></div>
                <div style="font-size:11.5px;color:var(--muted);margin-bottom:16px;">Delivery calculated at checkout on WhatsApp.</div>
                <button class="btn btn-primary btn-block" id="pageCheckoutBtn"><i class="fa-brands fa-whatsapp"></i> Checkout via WhatsApp</button>
            </div>
        </div>`;

    wrap.querySelectorAll("[data-qty-up]").forEach((btn) => btn.addEventListener("click", () => {
        const [id, size] = btn.dataset.qtyUp.split("|");
        const item = getCartItems().find((i) => i.id === id && i.size === size);
        updateQty(id, size, item.qty + 1);
        render();
    }));
    wrap.querySelectorAll("[data-qty-down]").forEach((btn) => btn.addEventListener("click", () => {
        const [id, size] = btn.dataset.qtyDown.split("|");
        const item = getCartItems().find((i) => i.id === id && i.size === size);
        if (item.qty <= 1) removeFromCart(id, size); else updateQty(id, size, item.qty - 1);
        render();
    }));
    wrap.querySelectorAll("[data-remove]").forEach((btn) => btn.addEventListener("click", () => {
        const [id, size] = btn.dataset.remove.split("|");
        removeFromCart(id, size);
        render();
    }));

    document.getElementById("pageCheckoutBtn")?.addEventListener("click", async () => {
        const ok = await requireLogin("checkout");
        if (!ok) return;

        const user = auth.currentUser;
        const currentItems = getCartItems();
        const currentTotal = getCartTotal();

        try {
            await addDoc(collection(db, "orders"), {
                uid: user.uid, customerName: user.displayName || "", customerEmail: user.email || "",
                items: currentItems, total: currentTotal, status: "pending", createdAt: serverTimestamp()
            });
        } catch (e) { console.error(e); }

        const lines = currentItems.map((i) => `• ${i.name} (Size ${i.size}) x${i.qty} — Rs. ${(i.price * i.qty).toLocaleString()}`);
        const message = ["Hi Najiha Closet! I'd like to place an order:", ...lines, `Total: Rs. ${currentTotal.toLocaleString()}`, `Name: ${user.displayName || ""}`, `Email: ${user.email || ""}`].join("\n");
        window.open(`https://wa.me/923001234567?text=${encodeURIComponent(message)}`, "_blank");
        localStorage.setItem("nc_cart_v1", "[]");
        showToast("Order sent! We'll confirm on WhatsApp shortly.", "success");
        render();
    });
}

document.addEventListener("nc-cart-updated", render);
render();
