// ===== MENU DATA =====
const menuData = [
  {
    id: 1, name: "Veg Steamed Momos", price: 120,
    desc: "Soft, juicy dumplings filled with fresh seasonal vegetables.",
    img: "images/momo-steam-veg.jpg.jpeg",
    category: "momos", badge: "Bestseller", bestseller: true
  },
  {
    id: 2, name: "Cheese Kurkure Momos", price: 150,
    desc: "Crispy crunchy shell with a gooey melted cheese filling.",
    img: "images/momo-kurkure-cheese.jpg.jpeg",
    category: "momos", badge: "Popular", bestseller: true
  },
  {
    id: 3, name: "Paneer Fried Momos", price: 140,
    desc: "Golden fried to perfection with rich paneer stuffing.",
    img: "images/momo-fried-paneer.jpg.jpeg",
    category: "momos", badge: "", bestseller: false
  },
  {
    id: 4, name: "Cheese Fried Momos", price: 150,
    desc: "Deep-fried dumplings oozing with cheesy goodness.",
    img: "images/momo-fried-cheese.jpg.jpeg",
    category: "momos", badge: "New", bestseller: false
  },
  {
    id: 5, name: "Veg Kurkure Momos", price: 130,
    desc: "Extra crispy coating with savoury veggie filling.",
    img: "images/momo-kurkure-veg.jpg.jpeg",
    category: "momos", badge: "", bestseller: false
  },
  {
    id: 6, name: "Paneer Kurkure Momos", price: 150,
    desc: "Crunchy kurkure style with creamy paneer filling.",
    img: "images/momo-kurkure-paneer.jpg.jpeg",
    category: "momos", badge: "", bestseller: false
  },
  {
    id: 7, name: "Cheese Steamed Momos", price: 140,
    desc: "Silky steamed dumplings with melted cheese inside.",
    img: "images/momo-steam-cheese.jpg.jpeg",
    category: "momos", badge: "", bestseller: true
  },
  {
    id: 8, name: "Paneer Aloo Paratha", price: 100,
    desc: "Rich buttery stuffed paratha with paneer and potato.",
    img: "images/paratha-paneer-aloo.jpg.jpeg",
    category: "paratha", badge: "Classic", bestseller: true
  },
  {
    id: 9, name: "Aloo Paratha with Curd", price: 90,
    desc: "Traditional aloo paratha served with fresh chilled curd.",
    img: "images/paratha-aloo-curd.jpg.jpeg",
    category: "paratha", badge: "", bestseller: false
  }
];

// ===== CART STATE =====
let cart = [];
let currentMenuFilter = "all";
let menuTransitionToken = 0;

const MENU_FILTER_EXIT_MS = 260;
const MENU_FILTER_ENTER_MS = 430;
const MENU_FILTER_STAGGER_MS = 55;
const menuFilterOrder = ["all", "momos", "paratha", "bestseller"];

// ===== DOM ELEMENTS =====
const menuGrid = document.getElementById("menuGrid");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cartItems");
const cartEmpty = document.getElementById("cartEmpty");
const cartFooter = document.getElementById("cartFooter");
const cartTotal = document.getElementById("cartTotal");
const cartBadge = document.getElementById("cartBadge");
const toast = document.getElementById("toast");
const toastMsg = document.getElementById("toastMsg");
const preloader = document.getElementById("preloader");
const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");

// ===== PRELOADER =====
window.addEventListener("load", () => {
  setTimeout(() => {
    preloader.classList.add("hidden");
  }, 1200);
});

// ===== NAVBAR SCROLL =====
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  backToTop.classList.toggle("show", window.scrollY > 400);
  updateActiveNav();
});

// ===== HAMBURGER MENU =====
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

// Close mobile menu on link click
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id]");
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle("active", scrollPos >= top && scrollPos < top + height);
    }
  });
}

// ===== SCROLL REVEAL =====
const revealObserver = "IntersectionObserver" in window
  ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.2 })
  : null;

function observeRevealElement(el) {
  if (!el) return;
  if (revealObserver) revealObserver.observe(el);
  else el.classList.add("visible");
}

function initScrollReveal() {
  document.querySelectorAll(".reveal").forEach(observeRevealElement);
}

// ===== SCROLL TO SECTION =====
function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// ===== BACK TO TOP =====
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function getMenuItems(filter = "all") {
  let items = menuData;
  if (filter === "bestseller") items = menuData.filter(i => i.bestseller);
  else if (filter !== "all") items = menuData.filter(i => i.category === filter);
  return items;
}

// ===== RENDER MENU =====
function renderMenu(filter = "all", options = {}) {
  const items = getMenuItems(filter);
  const { animate = false, direction = 1 } = options;

  menuGrid.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "menu-card reveal";
    card.dataset.itemId = item.id;
    card.style.setProperty("--reveal-delay", `${(index % 3) * 0.1}s`);
    const inCart = cart.find(c => c.id === item.id);
    card.innerHTML = `
      <div class="menu-card-img">
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ""}
      </div>
      <div class="menu-card-body">
        <h4>${item.name}</h4>
        <p class="desc">${item.desc}</p>
        <div class="menu-card-footer">
          <span class="menu-price">₹${item.price}</span>
          <button class="add-cart-btn ${inCart ? 'added' : ''}" 
                  onclick="addToCart(${item.id})" 
                  id="addBtn${item.id}"
                  aria-label="Add ${item.name} to cart">
            ${inCart ? '✓' : '+'}
          </button>
        </div>
      </div>
    `;
    initMenuCardSpotlight(card);
    menuGrid.appendChild(card);
    if (animate) {
      card.classList.add("visible", "menu-card-flow-enter");
      card.style.setProperty("--flow-start-x", `${direction * 34}px`);
      card.style.setProperty("--flow-delay", `${index * MENU_FILTER_STAGGER_MS}ms`);
      card.dataset.scrollInit = "true";
      requestAnimationFrame(() => card.classList.add("menu-card-flow-enter-active"));
    } else {
      observeRevealElement(card);
    }
  });

  if (animate) {
    const enterDuration = MENU_FILTER_ENTER_MS + (Math.max(items.length - 1, 0) * MENU_FILTER_STAGGER_MS);
    setTimeout(() => {
      menuGrid.querySelectorAll(".menu-card-flow-enter").forEach(card => {
        card.classList.remove("menu-card-flow-enter", "menu-card-flow-enter-active");
        card.style.removeProperty("--flow-start-x");
        card.style.removeProperty("--flow-delay");
      });
    }, enterDuration + 60);
  } else if (typeof initMenuScrollAnimation === 'function') {
    setTimeout(initMenuScrollAnimation, 100);
  }
}

// ===== MENU CARD SPOTLIGHT + SELECT ANIMATION =====
function initMenuCardSpotlight(card) {
  card.addEventListener("pointermove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    card.style.setProperty("--menu-glow-x", `${xPercent}%`);
    card.style.setProperty("--menu-glow-y", `${yPercent}%`);
    card.style.setProperty("--menu-glow-intensity", "1");
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--menu-glow-intensity", "0");
  });

  card.addEventListener("click", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement("span");

    ripple.className = "menu-card-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;

    card.classList.remove("selected");
    card.appendChild(ripple);
    void card.offsetWidth;
    card.classList.add("selected");

    setTimeout(() => ripple.remove(), 720);
    setTimeout(() => card.classList.remove("selected"), 760);
  });
}

// ===== FILTER MENU =====
function filterMenu(filter) {
  if (filter === currentMenuFilter) return;

  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });

  const previousIndex = menuFilterOrder.indexOf(currentMenuFilter);
  const nextIndex = menuFilterOrder.indexOf(filter);
  const direction = nextIndex >= previousIndex ? 1 : -1;
  const transitionToken = ++menuTransitionToken;
  const outgoingCards = Array.from(menuGrid.querySelectorAll(".menu-card"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  currentMenuFilter = filter;

  if (!outgoingCards.length || reduceMotion) {
    renderMenu(filter);
    menuGrid.classList.remove("is-filtering");
    menuGrid.style.removeProperty("height");
    return;
  }

  const gridHeight = menuGrid.getBoundingClientRect().height;
  menuGrid.style.height = `${gridHeight}px`;
  menuGrid.classList.add("is-filtering");

  outgoingCards.forEach((card, index) => {
    card.style.setProperty("--flow-exit-x", `${direction * -34}px`);
    card.style.setProperty("--flow-delay", `${Math.min(index, 5) * 22}ms`);
    card.classList.add("menu-card-flow-leave");
  });

  setTimeout(() => {
    if (transitionToken !== menuTransitionToken) return;

    renderMenu(filter, { animate: true, direction });
    const renderedCards = Array.from(menuGrid.querySelectorAll(".menu-card"));
    const targetHeight = renderedCards.reduce((height, card) => {
      return Math.max(height, card.offsetTop + card.offsetHeight);
    }, 0);
    requestAnimationFrame(() => {
      if (transitionToken === menuTransitionToken) {
        menuGrid.style.height = `${targetHeight}px`;
      }
    });

    const itemCount = getMenuItems(filter).length;
    const unlockDelay = MENU_FILTER_ENTER_MS + (Math.max(itemCount - 1, 0) * MENU_FILTER_STAGGER_MS) + 80;
    setTimeout(() => {
      if (transitionToken !== menuTransitionToken) return;
      menuGrid.classList.remove("is-filtering");
      menuGrid.style.removeProperty("height");
    }, unlockDelay);
  }, MENU_FILTER_EXIT_MS);
}

// Filter button clicks
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => filterMenu(btn.dataset.filter));
});

// ===== CART FUNCTIONS =====
function openCart() {
  cartDrawer.classList.add("active");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("active");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}


document.getElementById("cartToggleBtn").addEventListener("click", openCart);
document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function addToCart(id) {
  const item = menuData.find(i => i.id === id);
  if (!item) return;
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCart();
  showToast(`${item.name} added to cart!`);

  // Animate button
  const btn = document.getElementById(`addBtn${id}`);
  if (btn) {
    btn.classList.add("added");
    btn.innerHTML = "✓";
    setTimeout(() => {
      btn.classList.remove("added");
      const still = cart.find(c => c.id === id);
      btn.innerHTML = still ? "✓" : "+";
    }, 600);
  }
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCart();
  renderMenu(getCurrentFilter());
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCart();
  renderMenu(getCurrentFilter());
}

function getCurrentFilter() {
  const active = document.querySelector(".filter-btn.active");
  return active ? active.dataset.filter : "all";
}

function updateCart() {
  const count = cart.reduce((sum, c) => sum + c.qty, 0);
  const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);

  // Badge
  cartBadge.textContent = count;
  cartBadge.classList.toggle("show", count > 0);

  // Footer
  cartFooter.style.display = count > 0 ? "block" : "none";
  cartEmpty.style.display = count > 0 ? "none" : "block";
  cartTotal.textContent = `₹${total}`;

  // Render items
  if (count > 0) {
    let html = "";
    cart.forEach(item => {
      html += `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.img}" alt="${item.name}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            <span class="cart-item-price">₹${item.price * item.qty}</span>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
          <button class="cart-item-remove" onclick="removeFromCart(${item.id})" aria-label="Remove">🗑</button>
        </div>
      `;
    });
    cartItems.innerHTML = html;
  } else {
    cartItems.innerHTML = `<div class="cart-empty" id="cartEmpty"><div class="cart-empty-icon">🛒</div><p>Your cart is empty</p></div>`;
  }
}

// ===== WHATSAPP ORDER =====
function sendWhatsApp() {
  let message = "🛒 *New Order from Megha's Kitchen*%0A%0A";

  if (cart.length > 0) {
    cart.forEach(item => {
      message += `▸ ${item.name} × ${item.qty} — ₹${item.price * item.qty}%0A`;
    });
    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    message += `%0A*Total: ₹${total}*`;
  } else {
    message += "Hi! I'd like to place an order.";
  }

  window.open(`https://wa.me/6354003710?text=${message}`, "_blank");
}

// ===== TOAST =====
function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ===== BORDER GLOW — Vanilla JS Port =====
(function initBorderGlow() {
  const glowEls = document.querySelectorAll('.bg-glow');
  if (!glowEls.length) return;

  function getCenter(el) {
    const { width, height } = el.getBoundingClientRect();
    return [width / 2, height / 2];
  }

  function edgeProximity(el, x, y) {
    const [cx, cy] = getCenter(el);
    const dx = x - cx, dy = y - cy;
    let kx = Infinity, ky = Infinity;
    if (dx !== 0) kx = cx / Math.abs(dx);
    if (dy !== 0) ky = cy / Math.abs(dy);
    return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
  }

  function cursorAngle(el, x, y) {
    const [cx, cy] = getCenter(el);
    const dx = x - cx, dy = y - cy;
    if (dx === 0 && dy === 0) return 0;
    let deg = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (deg < 0) deg += 360;
    return deg;
  }

  glowEls.forEach(el => {
    el.addEventListener('pointermove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const prox = edgeProximity(el, x, y);
      const angle = cursorAngle(el, x, y);
      el.style.setProperty('--edge-proximity', (prox * 100).toFixed(2));
      el.style.setProperty('--cursor-angle', `${angle.toFixed(2)}deg`);
    });

    el.addEventListener('pointerleave', () => {
      el.style.setProperty('--edge-proximity', '0');
    });
  });
})();

// ===== SUBTLE CARD SPOTLIGHTS =====
(function initPremiumCardSpotlights() {
  const cards = document.querySelectorAll('.testimonial-card, .order-cta-card');
  if (!cards.length) return;

  cards.forEach(card => {
    let rafId = null;
    let nextX = 50;
    let nextY = 50;

    function updateSpotlight() {
      card.style.setProperty('--spotlight-x', `${nextX}%`);
      card.style.setProperty('--spotlight-y', `${nextY}%`);
      rafId = null;
    }

    card.addEventListener('pointermove', e => {
      const rect = card.getBoundingClientRect();
      nextX = ((e.clientX - rect.left) / (rect.width || 1)) * 100;
      nextY = ((e.clientY - rect.top) / (rect.height || 1)) * 100;
      card.style.setProperty('--spotlight-opacity', '1');
      if (rafId === null) rafId = requestAnimationFrame(updateSpotlight);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  });
})();

// ===== BUTTON MICRO INTERACTIONS =====
(function initButtonMicroInteractions() {
  const selector = 'button, .btn-primary, .btn-secondary, .nav-order-btn, .nav-cart-btn, .filter-btn, .add-cart-btn, .qty-btn, .cart-close, .cart-item-remove, .cart-checkout, .back-to-top';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getInteractiveButton(target) {
    if (!target || typeof target.closest !== 'function') return null;
    const el = target.closest(selector);
    if (!el || el.disabled || el.classList.contains('ui-no-motion')) return null;
    return el;
  }

  document.addEventListener('pointerdown', e => {
    const button = getInteractiveButton(e.target);
    if (!button) return;
    button.classList.add('ui-pressing');
  });

  ['pointerup', 'pointercancel', 'pointerleave'].forEach(eventName => {
    document.addEventListener(eventName, e => {
      const button = getInteractiveButton(e.target);
      if (button) button.classList.remove('ui-pressing');
    });
  });

  document.addEventListener('click', e => {
    if (reduceMotion) return;
    const button = getInteractiveButton(e.target);
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height) * 1.9;

    ripple.className = 'ui-click-ripple';
    ripple.style.setProperty('--ripple-size', `${size}px`);
    ripple.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
    ripple.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);

    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 520);
    setTimeout(() => button.classList.remove('ui-pressing'), 120);
  });
})();


(function initMagicBento() {
  if (typeof gsap === 'undefined') return; // guard if CDN fails

  const GLOW_COLOR = '255, 107, 61';
  const SPOTLIGHT_R = 400;
  const PARTICLE_MAX = 10;

  const catSection = document.querySelector('.categories');
  const cards = document.querySelectorAll('.cat-grid .cat-card');
  if (!catSection || !cards.length) return;

  /* --- Spotlight element --- */
  const spotlight = document.createElement('div');
  spotlight.className = 'mb-spotlight';
  document.body.appendChild(spotlight);

  const proximity = SPOTLIGHT_R * 0.5;
  const fadeDistance = SPOTLIGHT_R * 0.75;

  document.addEventListener('mousemove', e => {
    const sRect = catSection.getBoundingClientRect();
    const inside = e.clientX >= sRect.left && e.clientX <= sRect.right &&
      e.clientY >= sRect.top && e.clientY <= sRect.bottom;

    if (!inside) {
      gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      cards.forEach(c => c.style.setProperty('--glow-intensity', '0'));
      return;
    }

    gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.12, ease: 'power2.out' });

    let minDist = Infinity;
    cards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2);
      minDist = Math.min(minDist, dist);

      let intensity = 0;
      if (dist <= proximity) intensity = 1;
      else if (dist <= fadeDistance) intensity = (fadeDistance - dist) / (fadeDistance - proximity);

      const rx = ((e.clientX - r.left) / r.width) * 100;
      const ry = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--glow-x', `${rx}%`);
      card.style.setProperty('--glow-y', `${ry}%`);
      card.style.setProperty('--glow-intensity', intensity.toFixed(3));
      card.style.setProperty('--glow-radius', `${SPOTLIGHT_R}px`);
    });

    const targetOpacity = minDist <= proximity ? 0.85
      : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.85
        : 0;
    gsap.to(spotlight, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(spotlight, { opacity: 0, duration: 0.4 });
    cards.forEach(c => c.style.setProperty('--glow-intensity', '0'));
  });

  /* --- Per-card effects --- */
  cards.forEach(card => {
    let particles = [];
    let particleTmr = null;
    let isHovered = false;

    /* Tilt + Magnetism */
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const cx = r.width / 2;
      const cy = r.height / 2;
      gsap.to(card, {
        rotateX: ((y - cy) / cy) * -8,
        rotateY: ((x - cx) / cx) * 8,
        x: (x - cx) * 0.04,
        y: (y - cy) * 0.04,
        duration: 0.1,
        transformPerspective: 900,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.5, ease: 'power2.out' });
    });

    /* Click ripple */
    card.addEventListener('click', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const maxD = Math.max(
        Math.hypot(x, y), Math.hypot(x - r.width, y),
        Math.hypot(x, y - r.height), Math.hypot(x - r.width, y - r.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none; z-index:1000;
        width:${maxD * 2}px; height:${maxD * 2}px;
        left:${x - maxD}px; top:${y - maxD}px;
        background:radial-gradient(circle, rgba(${GLOW_COLOR},0.35) 0%, rgba(${GLOW_COLOR},0.15) 40%, transparent 70%);
      `;
      card.appendChild(ripple);
      gsap.fromTo(ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => ripple.remove() }
      );
    });

    /* Floating particles on hover */
    card.addEventListener('mouseenter', () => {
      isHovered = true;
      particleTmr = setInterval(() => {
        if (!isHovered || particles.length >= PARTICLE_MAX) return;
        const r = card.getBoundingClientRect();
        const p = document.createElement('div');
        p.className = 'mb-particle';
        p.style.left = Math.random() * r.width + 'px';
        p.style.top = Math.random() * r.height + 'px';
        card.appendChild(p);
        particles.push(p);
        gsap.fromTo(p, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(p, {
          x: (Math.random() - 0.5) * 80, y: (Math.random() - 0.5) * 80,
          rotation: Math.random() * 360, duration: 2 + Math.random() * 2,
          ease: 'none', repeat: -1, yoyo: true
        });
        gsap.to(p, { opacity: 0.3, duration: 1.5, ease: 'power2.inOut', repeat: -1, yoyo: true });
      }, 150);
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      clearInterval(particleTmr);
      particles.forEach(p => {
        gsap.to(p, { scale: 0, opacity: 0, duration: 0.3, ease: 'back.in(1.7)', onComplete: () => p.remove() });
      });
      particles = [];
    });
  });
})();

/* ===== MENU SPOTLIGHT ===== */
(function initMenuSpotlight() {
  if (typeof gsap === 'undefined') return;

  const GLOW_COLOR = '255, 107, 61'; // Primary orange theme color
  const SPOTLIGHT_R = 400;
  const PARTICLE_MAX = 8;

  const menuSection = document.querySelector('.menu-section');
  const menuCards = document.querySelectorAll('.menu-grid .menu-card');
  if (!menuSection || !menuCards.length) return;

  /* --- Spotlight element --- */
  const spotlight = document.createElement('div');
  spotlight.className = 'mb-spotlight';
  spotlight.style.background = `radial-gradient(circle, rgba(${GLOW_COLOR}, 0.6) 0%, rgba(${GLOW_COLOR}, 0.3) 40%, rgba(255, 154, 68, 0.1) 100%)`;
  document.body.appendChild(spotlight);

  const proximity = SPOTLIGHT_R * 0.5;
  const fadeDistance = SPOTLIGHT_R * 0.75;

  document.addEventListener('mousemove', e => {
    const sRect = menuSection.getBoundingClientRect();
    const inside = e.clientX >= sRect.left && e.clientX <= sRect.right &&
      e.clientY >= sRect.top && e.clientY <= sRect.bottom;

    if (!inside) {
      gsap.to(spotlight, { opacity: 0, duration: 0.4, ease: 'power2.out' });
      menuCards.forEach(c => c.style.setProperty('--menu-glow-intensity', '0'));
      return;
    }

    gsap.to(spotlight, { left: e.clientX, top: e.clientY, duration: 0.12, ease: 'power2.out' });

    let minDist = Infinity;
    menuCards.forEach(card => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dist = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2);
      minDist = Math.min(minDist, dist);

      let intensity = 0;
      if (dist <= proximity) intensity = 1;
      else if (dist <= fadeDistance) intensity = (fadeDistance - dist) / (fadeDistance - proximity);

      const rx = ((e.clientX - r.left) / r.width) * 100;
      const ry = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--menu-glow-x', `${rx}%`);
      card.style.setProperty('--menu-glow-y', `${ry}%`);
      card.style.setProperty('--menu-glow-intensity', intensity.toFixed(3));
      card.style.setProperty('--menu-glow-radius', `${SPOTLIGHT_R}px`);
    });

    const targetOpacity = minDist <= proximity ? 0.85
      : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.85
        : 0;
    gsap.to(spotlight, { opacity: targetOpacity, duration: targetOpacity > 0 ? 0.2 : 0.5, ease: 'power2.out' });
  });

  document.addEventListener('mouseleave', () => {
    gsap.to(spotlight, { opacity: 0, duration: 0.4 });
    menuCards.forEach(c => c.style.setProperty('--menu-glow-intensity', '0'));
  });

  /* --- Per-card hover effects --- */
  menuCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.02, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });

    /* Card shadow glow on hover */
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const glow = `0 0 40px rgba(${GLOW_COLOR}, 0.7), inset 0 0 40px rgba(${GLOW_COLOR}, 0.2)`;
      card.style.boxShadow = glow;
    });

    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();

// ===== COLOR BENDS BACKGROUND - Vanilla Three.js Port =====
(function initCategoriesColorBends() {
  const container = document.getElementById("categoriesColorBends");
  if (!container || typeof THREE === "undefined") return;

  const MAX_COLORS = 8;
  const settings = {
    colors: ["#7a1f00", "#c43a08", "#ff5a1f", "#ff7a2f", "#ff9a44", "#ffb25a"],
    rotation: 79,
    autoRotate: 2,
    speed: 0.2,
    scale: 0.72,
    frequency: 1,
    warpStrength: 1,
    mouseInfluence: 0.9,
    parallax: 0.5,
    noise: 0.08,
    iterations: 2,
    intensity: 1.18,
    bandWidth: 6,
    transparent: true
  };

  const frag = `
    #define MAX_COLORS ${MAX_COLORS}
    uniform vec2 uCanvas;
    uniform float uTime;
    uniform float uSpeed;
    uniform vec2 uRot;
    uniform int uColorCount;
    uniform vec3 uColors[MAX_COLORS];
    uniform int uTransparent;
    uniform float uScale;
    uniform float uFrequency;
    uniform float uWarpStrength;
    uniform vec2 uPointer;
    uniform float uMouseInfluence;
    uniform float uParallax;
    uniform float uNoise;
    uniform int uIterations;
    uniform float uIntensity;
    uniform float uBandWidth;
    varying vec2 vUv;

    void main() {
      float t = uTime * uSpeed;
      vec2 p = vUv * 2.0 - 1.0;
      p += uPointer * uParallax * 0.1;
      vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
      vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
      q /= max(uScale, 0.0001);
      q /= 0.5 + 0.2 * dot(q, q);
      q += 0.2 * cos(t) - 7.56;
      vec2 toward = (uPointer - rp);
      q += toward * uMouseInfluence * 0.2;

      for (int j = 0; j < 5; j++) {
        if (j >= uIterations - 1) break;
        vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
        q += (rr - q) * 0.15;
      }

      vec3 col = vec3(0.0);
      float a = 1.0;

      if (uColorCount > 0) {
        vec2 s = q;
        vec3 sumCol = vec3(0.0);
        float cover = 0.0;
        for (int i = 0; i < MAX_COLORS; ++i) {
          if (i >= uColorCount) break;
          s -= 0.01;
          vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
          float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float kBelow = clamp(uWarpStrength, 0.0, 1.0);
          float kMix = pow(kBelow, 0.3);
          float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
          vec2 disp = (r - s) * kBelow;
          vec2 warped = s + disp * gain;
          float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
          float m = mix(m0, m1, kMix);
          float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
          sumCol += uColors[i] * w;
          cover = max(cover, w);
        }
        col = clamp(sumCol, 0.0, 1.0);
        a = uTransparent > 0 ? cover : 1.0;
      }

      col *= uIntensity;

      if (uNoise > 0.0001) {
        float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
        col += (n - 0.5) * uNoise;
        col = clamp(col, 0.0, 1.0);
      }

      vec3 rgb = (uTransparent > 0) ? col * a : col;
      gl_FragColor = vec4(rgb, a);
    }
  `;

  const vert = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  const toVec3 = hex => {
    const h = hex.replace("#", "").trim();
    const v = h.length === 3
      ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
  };

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const colorUniforms = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
  const palette = settings.colors.filter(Boolean).slice(0, MAX_COLORS).map(toVec3);

  palette.forEach((color, index) => colorUniforms[index].copy(color));

  const material = new THREE.ShaderMaterial({
    vertexShader: vert,
    fragmentShader: frag,
    uniforms: {
      uCanvas: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uSpeed: { value: settings.speed },
      uRot: { value: new THREE.Vector2(1, 0) },
      uColorCount: { value: palette.length },
      uColors: { value: colorUniforms },
      uTransparent: { value: settings.transparent ? 1 : 0 },
      uScale: { value: settings.scale },
      uFrequency: { value: settings.frequency },
      uWarpStrength: { value: settings.warpStrength },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: settings.mouseInfluence },
      uParallax: { value: settings.parallax },
      uNoise: { value: settings.noise },
      uIterations: { value: settings.iterations },
      uIntensity: { value: settings.intensity },
      uBandWidth: { value: settings.bandWidth }
    },
    premultipliedAlpha: true,
    transparent: true
  });

  scene.add(new THREE.Mesh(geometry, material));

  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance",
    alpha: true
  });
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, settings.transparent ? 0 : 1);
  container.appendChild(renderer.domElement);

  const pointerTarget = new THREE.Vector2(0, 0);
  const pointerCurrent = new THREE.Vector2(0, 0);
  const clock = new THREE.Clock();
  let rafId = null;

  function handleResize() {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height, false);
    material.uniforms.uCanvas.value.set(width, height);
  }

  function handlePointerMove(e) {
    const rect = container.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
    const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
    pointerTarget.set(x, y);
  }

  function loop() {
    const dt = clock.getDelta();
    const elapsed = clock.elapsedTime;
    const deg = (settings.rotation % 360) + settings.autoRotate * elapsed;
    const rad = (deg * Math.PI) / 180;

    pointerCurrent.lerp(pointerTarget, Math.min(1, dt * 8));
    material.uniforms.uTime.value = elapsed;
    material.uniforms.uRot.value.set(Math.cos(rad), Math.sin(rad));
    material.uniforms.uPointer.value.copy(pointerCurrent);
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(loop);
  }

  handleResize();
  window.addEventListener("resize", handleResize);
  document.getElementById("categories")?.addEventListener("pointermove", handlePointerMove);
  rafId = requestAnimationFrame(loop);

  window.addEventListener("beforeunload", () => {
    if (rafId !== null) cancelAnimationFrame(rafId);
    window.removeEventListener("resize", handleResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  }, { once: true });
})();

// ===== INIT =====
initScrollReveal();
renderMenu('all');

// ===== TEXT REVEAL ANIMATION =====
function initTextReveal() {
  document.querySelectorAll('.text-reveal-container').forEach(container => {
    const text = container.textContent.trim();
    container.innerHTML = "";
    const words = text.split(/\s+/);

    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.textContent = word + " ";
      span.className = "text-reveal-word";
      span.style.transitionDelay = `${index * 0.08}s`;
      container.appendChild(span);
    });

    setTimeout(() => {
      container.querySelectorAll(".text-reveal-word").forEach(span => {
        span.classList.add("revealed");
      });
    }, 100);
  });
}

// ===== PARALLAX HERO =====
function initParallaxHero() {
  const layerBg = document.querySelector(".layer-bg");
  const layerMid = document.querySelector(".layer-mid");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;

    if (layerBg) layerBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    if (layerMid) layerMid.style.transform = `translateY(${scrollY * 0.6}px)`;
  });
}

// ===== MENU CARDS SCROLL ANIMATION =====
function initMenuScrollAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach((card, index) => {
    if (card.dataset.scrollInit) return;
    card.dataset.scrollInit = "true";

    gsap.set(card, { x: 28, opacity: 0 });

    gsap.to(card, {
      x: 0,
      opacity: 1,
      duration: 0.45,
      ease: "power2.out",
      delay: (index % 3) * 0.05,
      scrollTrigger: {
        trigger: card,
        start: "top 90%",
        end: "bottom 10%",
        toggleActions: "play reverse play reverse",
      }
    }
    );
  });
}

// ===== SILK BACKGROUND FOR MENU SECTION =====
function initSilkMenuBackground() {
  const container = document.getElementById('menu');
  if (!container || typeof THREE === 'undefined') return;

  // Guard: only init once
  if (container.dataset.silkInit) return;
  container.dataset.silkInit = 'true';

  // Wrapper div — fills the section, sits below content
  const canvasWrap = document.createElement('div');
  canvasWrap.id = 'silk-canvas-wrap';
  canvasWrap.style.cssText = `
    position:absolute; inset:0; z-index:0;
    overflow:hidden; pointer-events:none;
  `;

  container.style.position = 'relative';
  container.insertBefore(canvasWrap, container.firstChild);

  // Bump all sibling children above the canvas
  Array.from(container.children).forEach(child => {
    if (child !== canvasWrap) {
      child.style.position = 'relative';
      child.style.zIndex = '1';
    }
  });

  // ── Three.js setup ───────────────────────────────────────────
  const scene = new THREE.Scene();
  // Ortho camera that maps -1→1 in both axes to fill NDC
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Make the canvas fill the wrapper via CSS
  const cvs = renderer.domElement;
  cvs.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  canvasWrap.appendChild(cvs);

  // ── Shaders (exact port of React Bits Silk) ──────────────────
  const vertexShader = /* glsl */`
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;

  const fragmentShader = /* glsl */`
    varying vec2 vUv;
    varying vec3 vPosition;

    uniform float uTime;
    uniform vec3  uColor;
    uniform float uSpeed;
    uniform float uScale;
    uniform float uRotation;
    uniform float uNoiseIntensity;

    const float e = 2.71828182845904523536;

    float noise(vec2 texCoord){
      float G = e;
      vec2 r = (G * sin(G * texCoord));
      return fract(r.x * r.y * (1.0 + texCoord.x));
    }

    vec2 rotateUvs(vec2 uv, float angle){
      float c = cos(angle);
      float s = sin(angle);
      mat2 rot = mat2(c,-s,s,c);
      return rot * uv;
    }

    void main(){
      float rnd     = noise(gl_FragCoord.xy);
      vec2  uv      = rotateUvs(vUv * uScale, uRotation);
      vec2  tex     = uv * uScale;
      float tOffset = uSpeed * uTime;

      tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

      float pattern = 0.6 +
        0.4 * sin(5.0 * (tex.x + tex.y +
                  cos(3.0 * tex.x + 5.0 * tex.y) +
                  0.02 * tOffset) +
                  sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

      vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
      col.a = 0.55; // semi-transparent so dark bg shows through subtly
      gl_FragColor = col;
    }
  `;

  // ── Uniforms (props: color #ff6b3d orange accent, speed 5, scale 1) ──
  const hexToRGB = hex => {
    hex = hex.replace('#', '');
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255
    ];
  };

  const uniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(...hexToRGB('#b85c00')) }, // deep ember amber — glows warm under obsidian cards
    uSpeed: { value: 4.0 },
    uScale: { value: 1.2 },
    uRotation: { value: 0.3 },
    uNoiseIntensity: { value: 1.2 }
  };

  // The plane is 2×2 in world units; with the ortho cam it fills the entire clip space
  const geometry = new THREE.PlaneGeometry(2, 2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthWrite: false
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ── Resize: only the renderer pixel buffer needs to track container size ──
  const resize = () => {
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 600;
    renderer.setSize(w, h, false); // false = don't set canvas style (we handle via CSS)
  };

  resize();
  window.addEventListener('resize', resize);

  // ── Animation loop ────────────────────────────────────────────
  const clock = new THREE.Clock();
  let rafId;
  (function loop() {
    rafId = requestAnimationFrame(loop);
    uniforms.uTime.value += 0.1 * clock.getDelta();
    renderer.render(scene, camera);
  })();

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  }, { once: true });
}

// ===== SAFE INIT =====
setTimeout(() => {
  initTextReveal();
  initParallaxHero();
  initSilkMenuBackground();
}, 200);

// ===== LOGIN / SIGNUP MODAL =====
const loginModal = document.getElementById('loginModal');
const loginOverlay = document.getElementById('loginOverlay');
const loginToggleBtn = document.getElementById('loginToggleBtn');
const loginCloseBtn = document.getElementById('loginCloseBtn');

const sendOtpBtn = document.getElementById('sendOtpBtn');
const otpGroup = document.getElementById('otpGroup');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const otpStatus = document.getElementById('otpStatus');
const loginPhone = document.getElementById('loginPhone');
const loginOtp = document.getElementById('loginOtp');

const addressGroup = document.getElementById('addressGroup');
const loginAddress = document.getElementById('loginAddress');
const liveLocationBtn = document.getElementById('liveLocationBtn');
const loginSubmitBtn = document.getElementById('loginSubmitBtn');
const loginName = document.getElementById('loginName');

let generatedOTP = null;

if (loginToggleBtn) {
  loginToggleBtn.addEventListener('click', () => {
    loginModal.classList.add('active');
    loginOverlay.classList.add('active');
    document.body.style.overflow = "hidden";
  });
}

function closeLogin() {
  if (!localStorage.getItem('megha_user_name')) {
    // Do not allow closing if user is not logged in
    return;
  }
  loginModal.classList.remove('active');
  loginOverlay.classList.remove('active');
  document.body.style.overflow = "";
}

if (loginCloseBtn) loginCloseBtn.addEventListener('click', closeLogin);
if (loginOverlay) loginOverlay.addEventListener('click', closeLogin);

function sendOTP() {
  const phone = loginPhone.value;
  if (!phone || phone.length !== 10) {
    showToast('Please enter a valid 10-digit mobile number');
    return;
  }
  // Mock sending OTP
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  showToast(`OTP sent! (Mock: ${generatedOTP})`);

  otpGroup.classList.remove('hidden');
  sendOtpBtn.textContent = 'Resend OTP';
}

function verifyOTP() {
  const enteredOtp = loginOtp.value;
  if (enteredOtp === generatedOTP) {
    otpStatus.textContent = 'Verified ✓';
    otpStatus.className = 'otp-status success';
    loginPhone.disabled = true;
    loginOtp.disabled = true;
    sendOtpBtn.disabled = true;
    verifyOtpBtn.disabled = true;

    // Enable address & location
    addressGroup.classList.remove('disabled-until-verify');
    loginAddress.disabled = false;
    liveLocationBtn.disabled = false;
    loginSubmitBtn.disabled = false;
  } else {
    otpStatus.textContent = 'Invalid OTP';
    otpStatus.className = 'otp-status error';
  }
}

function getLiveLocation() {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser');
    return;
  }

  liveLocationBtn.textContent = 'Fetching...';
  liveLocationBtn.disabled = true;

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      loginAddress.value = `[Live Location: ${lat.toFixed(5)}, ${lon.toFixed(5)}]\n` + loginAddress.value;

      liveLocationBtn.textContent = '📍 Location Added';
      showToast('Live location fetched successfully');
    },
    (error) => {
      console.error(error);
      liveLocationBtn.textContent = '📍 Get Live Location';
      liveLocationBtn.disabled = false;
      showToast('Failed to get location. Please allow access.');
    }
  );
}

function handleLoginSubmit(e) {
  e.preventDefault();

  const name = loginName.value;
  const phone = loginPhone.value;
  const address = loginAddress.value;

  localStorage.setItem('megha_user_name', name);
  localStorage.setItem('megha_user_phone', phone);
  localStorage.setItem('megha_user_address', address);

  if (loginToggleBtn) {
    loginToggleBtn.textContent = name.split(' ')[0];
  }

  showToast(`Welcome, ${name}! Your details are saved.`);

  // Show the close button since they are logged in now
  if (loginCloseBtn) loginCloseBtn.style.display = "block";
  closeLogin();
}

window.addEventListener('DOMContentLoaded', () => {
  const savedName = localStorage.getItem('megha_user_name');
  if (savedName) {
    if (loginToggleBtn) loginToggleBtn.textContent = savedName.split(' ')[0];
    if (loginCloseBtn) loginCloseBtn.style.display = "block";
  } else {
    // Force login immediately
    setTimeout(() => {
      if (loginModal && loginOverlay) {
        loginModal.classList.add('active');
        loginOverlay.classList.add('active');
        document.body.style.overflow = "hidden";
        if (loginCloseBtn) loginCloseBtn.style.display = "none";
      }
    }, 500); // slight delay to allow preloader
  }
});

// ===== PREMIUM DASHBOARD LOGIC =====
const dashboardOverlay = document.getElementById('dashboardOverlay');
const dashboardDrawer = document.getElementById('dashboardDrawer');

function openDashboard() {
  const userName = localStorage.getItem('megha_user_name');
  if (!userName) {
    showToast("Please login first!");
    return;
  }

  // Fill user data
  const userAddress = localStorage.getItem('megha_user_address') || "";
  document.getElementById('dashName').value = userName || "";
  document.getElementById('dashPhone').value = localStorage.getItem('megha_user_phone') || "";
  document.getElementById('dashAddress').value = userAddress;
  document.getElementById('dashEmail').value = localStorage.getItem('megha_user_email') || "";

  const pref = localStorage.getItem('megha_user_pref');
  if (pref) document.getElementById('dashDiningPref').value = pref;

  // Update Avatar and Display Name
  document.getElementById('displayDashName').textContent = userName;
  document.getElementById('dashAvatar').textContent = userName.charAt(0).toUpperCase();

  // Update Track Order Address Display
  const trackAddressDisplay = document.getElementById('trackAddressDisplay');
  if (trackAddressDisplay) {
    trackAddressDisplay.textContent = userAddress || "No address provided.";
  }

  dashboardOverlay.classList.add('active');
  dashboardDrawer.classList.add('active');
  document.body.style.overflow = "hidden";
}

function cancelActiveOrder() {
  if (!confirm("Are you sure you want to cancel this active order?")) return;
  
  // Update Track Order UI
  const statusBadge = document.getElementById('trackOrderStatus');
  if (statusBadge) {
    statusBadge.textContent = "Cancelled";
    statusBadge.className = "order-status-badge status-cancelled";
  }
  
  const estDelivery = document.getElementById('trackEstDelivery');
  if (estDelivery) {
    estDelivery.innerHTML = `<span>Status</span><strong style="color:#f44336;">Cancelled at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</strong>`;
  }
  
  const progressList = document.getElementById('trackProgressList');
  if (progressList) {
    progressList.innerHTML = `
      <li class="step completed">
        <div class="step-icon" style="background: rgba(244, 67, 54, 0.2); border-color: #f44336; color: #fff;">❌</div>
        <div class="step-text" style="color: #fff;">Order Cancelled<br><small>Refund Initiated</small></div>
      </li>
    `;
    // Hide the connecting line
    progressList.style.setProperty('--line-display', 'none'); 
  }
  
  const paymentStatus = document.getElementById('trackPaymentStatus');
  if (paymentStatus) {
    paymentStatus.innerHTML = `Payment: <strong style="color:#f44336;">Refund Pending</strong>`;
  }
  
  const dpBlock = document.getElementById('trackDeliveryPartner');
  if (dpBlock) dpBlock.style.display = 'none';
  
  const actionBtns = document.getElementById('trackActionButtons');
  if (actionBtns) actionBtns.style.display = 'none';
  
  // Prepend to Past Orders
  const pastOrdersList = document.getElementById('pastOrdersList');
  if (pastOrdersList) {
    const cancelledHtml = `
      <li>
        <div class="item-info">
          <strong>Order #MK-84920 <span class="order-status-badge status-cancelled" style="margin-left: 8px;">Cancelled</span></strong>
          <span>Refund Pending • ₹340 • Cancelled at ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          <span style="display:block; font-size:12px; color:var(--text-muted); margin-top:4px;">Reason: User requested cancellation</span>
        </div>
        <button class="btn-secondary btn-small" disabled style="opacity:0.5;cursor:not-allowed;">Reorder</button>
      </li>
    `;
    pastOrdersList.insertAdjacentHTML('afterbegin', cancelledHtml);
  }
  
  showToast("Your order has been cancelled successfully. Refund initiated.");
}

function closeDashboard() {
  dashboardOverlay.classList.remove('active');
  dashboardDrawer.classList.remove('active');
  document.body.style.overflow = "";
}

document.getElementById('dashboardCloseBtn')?.addEventListener('click', closeDashboard);
dashboardOverlay?.addEventListener('click', closeDashboard);

function switchDashTab(tabId) {
  // Update nav buttons
  const navBtn = event.currentTarget;
  document.querySelectorAll('.dash-nav-btn').forEach(btn => btn.classList.remove('active'));
  if (navBtn) navBtn.classList.add('active');

  // Update content sections
  document.querySelectorAll('.dash-section').forEach(content => content.classList.remove('active'));

  const targetSection = document.getElementById('dash-' + tabId);
  if (targetSection) targetSection.classList.add('active');
}

function handleEditProfile(e) {
  e.preventDefault();
  const name = document.getElementById('dashName').value;
  const phone = document.getElementById('dashPhone').value;
  const address = document.getElementById('dashAddress').value;
  const email = document.getElementById('dashEmail').value;
  const pref = document.getElementById('dashDiningPref').value;

  localStorage.setItem('megha_user_name', name);
  localStorage.setItem('megha_user_phone', phone);
  localStorage.setItem('megha_user_address', address);
  localStorage.setItem('megha_user_email', email);
  localStorage.setItem('megha_user_pref', pref);

  // Update display
  document.getElementById('displayDashName').textContent = name;
  document.getElementById('dashAvatar').textContent = name.charAt(0).toUpperCase();

  const loginToggleBtn = document.getElementById('loginToggleBtn');
  if (loginToggleBtn) {
    loginToggleBtn.textContent = name.split(' ')[0];
  }

  showToast('Profile details updated securely!');
}

function logoutUser() {
  localStorage.removeItem('megha_user_name');
  localStorage.removeItem('megha_user_phone');
  localStorage.removeItem('megha_user_address');
  localStorage.removeItem('megha_user_email');
  localStorage.removeItem('megha_user_pref');

  const loginToggleBtn = document.getElementById('loginToggleBtn');
  if (loginToggleBtn) {
    loginToggleBtn.textContent = "Login / Sign Up";
  }

  closeDashboard();
  showToast("Logged out securely.");

  // Force login modal to appear again
  setTimeout(() => {
    const loginModal = document.getElementById('loginModal');
    const loginOverlay = document.getElementById('loginOverlay');
    const loginCloseBtn = document.getElementById('loginCloseBtn');

    if (loginModal && loginOverlay) {
      loginModal.classList.add('active');
      loginOverlay.classList.add('active');
      document.body.style.overflow = "hidden";
      if (loginCloseBtn) loginCloseBtn.style.display = "none";
    }
  }, 400);
}

// ===== CHECKOUT FLOW LOGIC =====
const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const checkoutCloseBtn = document.getElementById('checkoutCloseBtn');
let currentDiscount = 0;
let currentCheckoutTotal = 0;

function openCheckout() {
  if (cart.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  if (!localStorage.getItem('megha_user_name')) {
    showToast("Please login before checking out!");
    return;
  }

  closeCart();

  // Calculate Base Totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  document.getElementById('checkoutSubtotal').textContent = `₹${subtotal}`;

  // Reset fields
  currentDiscount = 0;
  document.getElementById('discountLine').style.display = "none";
  document.getElementById('couponCodeInput').value = "";
  document.querySelector('input[name="tip"][value="0"]').checked = true;

  updateCheckoutTotal();

  // Show Step 1
  document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
  document.getElementById('checkoutStep1').classList.add('active');

  checkoutModal.classList.add('active');
  checkoutOverlay.classList.add('active');
  document.body.style.overflow = "hidden";
}

function updateCheckoutTotal() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = 40;

  // Get tip
  const tipRadio = document.querySelector('input[name="tip"]:checked');
  const tipAmount = tipRadio ? parseInt(tipRadio.value) : 0;

  if (tipAmount > 0) {
    document.getElementById('tipLine').style.display = "flex";
    document.getElementById('checkoutTip').textContent = `₹${tipAmount}`;
  } else {
    document.getElementById('tipLine').style.display = "none";
  }

  currentCheckoutTotal = subtotal + deliveryFee + tipAmount - currentDiscount;
  document.getElementById('checkoutFinalTotal').textContent = `₹${currentCheckoutTotal}`;
}

function applyCoupon() {
  const code = document.getElementById('couponCodeInput').value.trim().toUpperCase();
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  if (code === "WELCOME20") {
    if (subtotal >= 300) {
      currentDiscount = Math.min(Math.floor(subtotal * 0.20), 100); // max 100 Rs off
      document.getElementById('discountLine').style.display = "flex";
      document.getElementById('checkoutDiscount').textContent = `-₹${currentDiscount}`;
      showToast("Coupon Applied: 20% OFF!");
    } else {
      showToast("Order value must be ₹300 or above to use this coupon.");
      currentDiscount = 0;
      document.getElementById('discountLine').style.display = "none";
    }
  } else if (code) {
    showToast("Invalid Coupon Code");
    currentDiscount = 0;
    document.getElementById('discountLine').style.display = "none";
  }

  updateCheckoutTotal();
}

function processPayment() {
  // Move to Step 2 (Processing)
  document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
  document.getElementById('checkoutStep2').classList.add('active');
  checkoutCloseBtn.style.display = "none"; // Hide close button during processing

  // Simulate network request
  setTimeout(() => {
    // Generate mock transaction ID
    const txnId = "TXN-" + Math.floor(Math.random() * 90000000 + 10000000);
    const methodEl = document.querySelector('input[name="payment_method"]:checked');
    const method = methodEl ? methodEl.value.toUpperCase() : "ONLINE";

    // Populate Receipt
    document.getElementById('receiptTxnId').textContent = txnId;
    document.getElementById('receiptAmount').textContent = `₹${currentCheckoutTotal}`;
    document.getElementById('receiptMethod').textContent = method;
    document.getElementById('receiptDate').textContent = new Date().toLocaleString();

    // Clear cart after successful payment
    cart = [];
    updateCart();

    // Move to Step 3 (Success)
    document.querySelectorAll('.checkout-step').forEach(step => step.classList.remove('active'));
    document.getElementById('checkoutStep3').classList.add('active');
    checkoutCloseBtn.style.display = "block";
  }, 2500);
}

function closeCheckout() {
  checkoutModal.classList.remove('active');
  checkoutOverlay.classList.remove('active');
  document.body.style.overflow = "";
}

function closeCheckoutAndTrack() {
  closeCheckout();
  // Open Dashboard to Track Tab
  openDashboard();
  switchDashTab('track');
}

if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);
