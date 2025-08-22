// src/js/shop.js
import '../css/shop.scss';

document.addEventListener('DOMContentLoaded', () => {
  const $ = (s, r = document) => r.querySelector(s);
  const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

  // DOM
  const listProduct  = $('.listProduct');
  const listCart     = $('.listCart');
  const openCartBtn  = $('#openCart');
  const badge        = $('#openCart .badge') || $('.badge');
  const closeCartBtn = $('#closeCart');
  const checkoutBtn  = $('#checkoutBtn');
  const summaryQty   = $('#summaryQty');
  const summaryTotal = $('#summaryTotal');

  // State
  let products = [];   // [{ id, name, price, image }]
  let cart = [];       // [{ id, qty }]

  // UI toggles
  openCartBtn && openCartBtn.addEventListener('click', () => document.body.classList.toggle('showCart'));
  closeCartBtn && closeCartBtn.addEventListener('click', () => document.body.classList.remove('showCart'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') document.body.classList.remove('showCart'); });

  // Load products via fetch (no webpack JSON import)
  function loadProducts() {
    // Adjust the URL if you placed products.json elsewhere
    return fetch('/assets/products.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Could not load /assets/products.json');
        return res.json();
      })
      .then((data) => {
        products = Array.isArray(data) ? data : [];
        console.log('Loaded products (fetch):', products);
      })
      .catch((err) => {
        console.error(err);
        products = [];
      });
  }

  // Render product grid
  function renderProducts() {
    if (!listProduct) return;
    listProduct.innerHTML = '';

    if (!products.length) {
      const empty = document.createElement('p');
      empty.textContent = 'No products found.';
      listProduct.appendChild(empty);
      return;
    }

    products.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'item';
      card.dataset.id = p.id;
        card.innerHTML = `
        <img src="${p.image}" alt="${p.name}">
        <h2>${p.name}</h2>
        <div class="meta">
            <div class="price">${money(p.price)}</div>
            <button class="addCart" type="button" aria-label="Add ${p.name} to cart">Add to Cart</button>
        </div>
        `;
      listProduct.appendChild(card);
    });
  }

  // Add to cart (delegation)
  listProduct && listProduct.addEventListener('click', (e) => {
    const btn = e.target.closest('.addCart');
    if (!btn) return;
    const id = btn.closest('.item')?.dataset.id;
    if (id) addToCart(id);
  });

  function addToCart(id) {
    const i = cart.findIndex((x) => x.id === id);
    if (i === -1) cart.push({ id, qty: 1 });
    else cart[i].qty += 1;
    persist(); renderCart();
  }

  function setQty(id, qty) {
    const i = cart.findIndex((x) => x.id === id);
    if (i === -1) return;
    if (qty <= 0) cart.splice(i, 1); else cart[i].qty = qty;
    persist(); renderCart();
  }

  function persist() { localStorage.setItem('cart_v1', JSON.stringify(cart)); }
  function loadCart() {
    try { cart = JSON.parse(localStorage.getItem('cart_v1') || '[]'); }
    catch { cart = []; }
  }

  // Render cart
  function renderCart() {
    if (!listCart) return;
    listCart.innerHTML = '';

    let totalQty = 0, totalPrice = 0;

    for (const { id, qty } of cart) {
      const p = products.find((x) => String(x.id) === String(id));
      if (!p) continue;

      totalQty += qty;
      totalPrice += (p.price || 0) * qty;

      const row = document.createElement('div');
      row.className = 'item';
      row.dataset.id = id;
      row.innerHTML = `
        <div class="image"><img src="${p.image}" alt="${p.name}"></div>
        <div class="name">${p.name}</div>
        <div class="totalPrice">${money((p.price || 0) * qty)}</div>
        <div class="quantity">
          <button class="minus" aria-label="Decrease quantity">−</button>
          <span class="bubble" aria-live="polite">${qty}</span>
          <button class="plus" aria-label="Increase quantity">+</button>
        </div>
      `;
      listCart.appendChild(row);
    }

    if (badge)        badge.textContent = String(totalQty);
    if (summaryQty)   summaryQty.textContent = String(totalQty);
    if (summaryTotal) summaryTotal.textContent = money(totalPrice);
  }

  // Qty change (delegation)
  listCart && listCart.addEventListener('click', (e) => {
    const minus = e.target.closest('.minus');
    const plus  = e.target.closest('.plus');
    if (!minus && !plus) return;

    const row = e.target.closest('.item');
    const id  = row?.dataset.id;
    if (!id) return;

    const current = cart.find((x) => x.id === id)?.qty || 0;
    setQty(id, minus ? current - 1 : current + 1);
  });

  // Checkout without async/await
  checkoutBtn && checkoutBtn.addEventListener('click', () => {
    if (!cart.length) return alert('Your cart is empty.');

    const notes = (document.querySelector('#orderNotes')?.value || '').slice(0, 500);
    fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: cart, notes })
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data?.url) throw new Error(data?.error || 'Checkout init failed');
        window.location.assign(data.url);
      })
      .catch((err) => {
        console.error(err);
        alert('Could not start checkout. Please try again.');
      });
  });

  // Init
  loadProducts()
    .then(() => { loadCart(); renderProducts(); renderCart(); });
});
