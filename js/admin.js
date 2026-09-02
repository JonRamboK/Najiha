// ============================================================
// ADMIN DASHBOARD
// Only emails in ADMIN_EMAILS (firebase-core.js) can view this.
// ============================================================

import {
    db, auth, onAuthReady, isAdminEmail, signOut, showToast,
    collection, doc, onSnapshot, updateDoc, deleteDoc, query, orderBy
} from "./firebase-core.js";

import { CATEGORIES, addProduct, updateProduct, deleteProduct, getAllProducts } from "./products.js";

let PRODUCTS = [], ORDERS = [], MESSAGES = [], USERS = [];

// ------------------------------------------------------------
// Guard
// ------------------------------------------------------------

onAuthReady((user) => {
    const gate = document.getElementById("adminGate");
    const shell = document.getElementById("adminShell");

    if (!user) {
        gate.innerHTML = accessDeniedHtml("Please sign in with an admin account to continue.", true);
        gate.style.display = "flex";
        shell.style.display = "none";
        return;
    }
    if (!isAdminEmail(user.email)) {
        gate.innerHTML = accessDeniedHtml("This account doesn't have admin access.", false);
        gate.style.display = "flex";
        shell.style.display = "none";
        return;
    }

    gate.style.display = "none";
    shell.style.display = "grid";
    document.getElementById("adminUserEmail").textContent = user.email;
    boot();
});

function accessDeniedHtml(message, showLogin) {
    return `
        <div class="empty-state">
            <i class="fa-solid fa-user-shield"></i>
            <h3>Admin access required</h3>
            <p>${message}</p>
            ${showLogin ? `<a href="login.html?next=admin.html" class="btn btn-primary">Login</a>` : `<a href="index.html" class="btn btn-primary">Back to store</a>`}
        </div>`;
}

// ------------------------------------------------------------
// Boot — live listeners
// ------------------------------------------------------------

function boot() {
    PRODUCTS = getAllProducts();
    renderStats(); renderProducts();
    document.addEventListener("nc:products-updated", () => {
        PRODUCTS = getAllProducts();
        renderStats(); renderProducts();
    });

    onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => {
        ORDERS = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        renderStats(); renderOrders();
    });
    onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc")), (snap) => {
        MESSAGES = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        renderStats(); renderMessages();
    });
    onSnapshot(collection(db, "users"), (snap) => {
        USERS = snap.docs.map((d) => ({ ...d.data(), id: d.id }));
        renderStats(); renderUsers();
    });

    document.querySelectorAll("[data-panel]").forEach((btn) => btn.addEventListener("click", () => switchPanel(btn.dataset.panel)));
    document.getElementById("adminLogoutBtn")?.addEventListener("click", async () => { await signOut(auth); location.href = "index.html"; });
    document.getElementById("adminMenuToggle")?.addEventListener("click", () => document.getElementById("adminSide").classList.toggle("open"));
    document.getElementById("addProductBtn")?.addEventListener("click", () => openProductForm());
    document.getElementById("productForm")?.addEventListener("submit", saveProductForm);
}

const PANEL_TITLES = { dashboard: "Dashboard", products: "Products", orders: "Orders", messages: "Messages", users: "Users" };

function switchPanel(name) {
    document.querySelectorAll("[data-panel]").forEach((b) => b.classList.toggle("active", b.dataset.panel === name));
    document.querySelectorAll(".admin-panel").forEach((p) => p.classList.toggle("active", p.id === `panel-${name}`));
    document.getElementById("adminSide")?.classList.remove("open");
    const title = document.getElementById("adminPageTitle");
    if (title) title.textContent = PANEL_TITLES[name] || "Dashboard";
}

// ------------------------------------------------------------
// Stats
// ------------------------------------------------------------

function renderStats() {
    const revenue = ORDERS.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById("statProducts").textContent = PRODUCTS.length;
    document.getElementById("statOrders").textContent = ORDERS.length;
    document.getElementById("statRevenue").textContent = `Rs. ${revenue.toLocaleString()}`;
    document.getElementById("statMessages").textContent = MESSAGES.filter((m) => m.status === "unread").length;
}

// ------------------------------------------------------------
// Products
// ------------------------------------------------------------

function renderProducts() {
    const tbody = document.getElementById("productsTableBody");
    if (!tbody) return;
    if (!PRODUCTS.length) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:30px;">No products yet.</td></tr>`;
        return;
    }
    tbody.innerHTML = PRODUCTS.map((p) => `
        <tr>
            <td><img class="thumb" src="${p.image}" alt=""></td>
            <td>${p.name}</td>
            <td>${p.categoryLabel || p.category}</td>
            <td>Rs. ${Number(p.price).toLocaleString()}</td>
            <td>${p.stock ?? "-"}</td>
            <td>${p.badge ? `<span class="badge-pill ${p.badge === "sale" ? "cancelled" : "active-badge"}">${p.badge}</span>` : "—"}</td>
            <td>
                <button class="icon-btn" data-edit="${p.id}"><i class="fa-solid fa-pen"></i></button>
                <button class="icon-btn danger" data-delete="${p.id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join("");

    tbody.querySelectorAll("[data-edit]").forEach((b) => b.addEventListener("click", () => openProductForm(PRODUCTS.find((p) => p.id === b.dataset.edit))));
    tbody.querySelectorAll("[data-delete]").forEach((b) => b.addEventListener("click", async () => {
        if (!confirm("Delete this product?")) return;
        await deleteProduct(b.dataset.delete);
        showToast("Product deleted", "success");
    }));
}

function openProductForm(product = null) {
    const modal = document.getElementById("productFormModal");
    const form = document.getElementById("productForm");
    form.reset();
    document.getElementById("productFormTitle").textContent = product ? "Edit product" : "Add product";
    document.getElementById("pfId").value = product?.id || "";
    document.getElementById("pfName").value = product?.name || "";
    document.getElementById("pfCategory").innerHTML = CATEGORIES.map((c) => `<option value="${c.id}" ${product?.category === c.id ? "selected" : ""}>${c.label}</option>`).join("");
    document.getElementById("pfPrice").value = product?.price || "";
    document.getElementById("pfComparePrice").value = product?.comparePrice || "";
    document.getElementById("pfStock").value = product?.stock ?? 20;
    document.getElementById("pfSizes").value = (product?.sizes || ["0-3M", "3-6M", "6-12M"]).join(", ");
    document.getElementById("pfImage").value = product?.image || "";
    document.getElementById("pfBadge").value = product?.badge || "";
    document.getElementById("pfDescription").value = product?.description || "";
    modal.classList.add("show");
    document.body.classList.add("no-scroll");
}

document.getElementById("productFormClose")?.addEventListener("click", () => {
    document.getElementById("productFormModal").classList.remove("show");
    document.body.classList.remove("no-scroll");
});

async function saveProductForm(e) {
    e.preventDefault();
    const id = document.getElementById("pfId").value;
    const category = document.getElementById("pfCategory").value;
    const data = {
        name: document.getElementById("pfName").value.trim(),
        category,
        categoryLabel: CATEGORIES.find((c) => c.id === category)?.label || category,
        price: Number(document.getElementById("pfPrice").value),
        comparePrice: document.getElementById("pfComparePrice").value ? Number(document.getElementById("pfComparePrice").value) : null,
        stock: Number(document.getElementById("pfStock").value),
        sizes: document.getElementById("pfSizes").value.split(",").map((s) => s.trim()).filter(Boolean),
        image: document.getElementById("pfImage").value.trim() || `https://picsum.photos/seed/${Date.now()}/600/760`,
        badge: document.getElementById("pfBadge").value || null,
        description: document.getElementById("pfDescription").value.trim()
    };

    try {
        if (id) await updateProduct(id, data);
        else await addProduct(data);
        showToast(id ? "Product updated" : "Product added", "success");
        document.getElementById("productFormModal").classList.remove("show");
        document.body.classList.remove("no-scroll");
    } catch (err) {
        console.error(err);
        showToast("Could not save product.", "error");
    }
}

// ------------------------------------------------------------
// Orders
// ------------------------------------------------------------

function ordersRowsHtml(list) {
    if (!list.length) return `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:30px;">No orders yet.</td></tr>`;
    return list.map((o) => `
        <tr>
            <td>#${o.id.slice(0, 6)}</td>
            <td>${o.customerName || "—"}<br><span style="color:var(--muted);font-size:11px;">${o.customerEmail || ""}</span></td>
            <td>${(o.items || []).length} item(s)</td>
            <td>Rs. ${Number(o.total || 0).toLocaleString()}</td>
            <td>
                <select class="sort-select" data-order-status="${o.id}" style="height:32px;font-size:11px;">
                    ${["pending", "paid", "cancelled"].map((s) => `<option value="${s}" ${o.status === s ? "selected" : ""}>${s}</option>`).join("")}
                </select>
            </td>
            <td>${formatDate(o.createdAt)}</td>
        </tr>
    `).join("");
}

function wireOrderStatusSelects(tbody) {
    tbody.querySelectorAll("[data-order-status]").forEach((sel) => sel.addEventListener("change", async () => {
        await updateDoc(doc(db, "orders", sel.dataset.orderStatus), { status: sel.value });
        showToast("Order status updated", "success");
    }));
}

function renderOrders() {
    const preview = document.getElementById("ordersTableBody");
    const full = document.getElementById("ordersTableBody2");

    if (preview) {
        preview.innerHTML = ordersRowsHtml(ORDERS.slice(0, 8));
        wireOrderStatusSelects(preview);
    }
    if (full) {
        full.innerHTML = ordersRowsHtml(ORDERS);
        wireOrderStatusSelects(full);
    }
}

// ------------------------------------------------------------
// Messages
// ------------------------------------------------------------

function renderMessages() {
    const tbody = document.getElementById("messagesTableBody");
    if (!tbody) return;
    if (!MESSAGES.length) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:30px;">No messages yet.</td></tr>`;
        return;
    }
    tbody.innerHTML = MESSAGES.map((m) => `
        <tr>
            <td><span class="badge-pill ${m.status === "unread" ? "pending" : "active-badge"}">${m.status}</span></td>
            <td>${m.name}<br><span style="color:var(--muted);font-size:11px;">${m.email}</span></td>
            <td>${m.subject || "—"}</td>
            <td style="max-width:260px;white-space:normal;">${m.body}</td>
            <td>
                <button class="icon-btn" data-mark="${m.id}" title="Mark read"><i class="fa-solid fa-envelope-open"></i></button>
                <button class="icon-btn danger" data-delmsg="${m.id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        </tr>
    `).join("");

    tbody.querySelectorAll("[data-mark]").forEach((b) => b.addEventListener("click", async () => {
        await updateDoc(doc(db, "messages", b.dataset.mark), { status: "read" });
    }));
    tbody.querySelectorAll("[data-delmsg]").forEach((b) => b.addEventListener("click", async () => {
        if (confirm("Delete this message?")) await deleteDoc(doc(db, "messages", b.dataset.delmsg));
    }));
}

// ------------------------------------------------------------
// Users
// ------------------------------------------------------------

function renderUsers() {
    const tbody = document.getElementById("usersTableBody");
    if (!tbody) return;
    if (!USERS.length) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--muted);padding:30px;">No registered users yet.</td></tr>`;
        return;
    }
    tbody.innerHTML = USERS.map((u) => `
        <tr>
            <td>${u.fullName || u.username || "—"}</td>
            <td>${u.email || "—"}</td>
            <td>${u.phone || "—"}</td>
            <td><span class="badge-pill active-badge">${u.status || "active"}</span></td>
        </tr>
    `).join("");
}

function formatDate(ts) {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
