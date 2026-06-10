/* ============================================================
   ELEVEN — Centro de Entrenamiento
   ⚙️ CONFIGURACIÓN — editá SOLO esta sección
   ============================================================ */

const CONFIG = {
  // 📱 Número de WhatsApp del gym (formato internacional, sin "+" ni espacios)
  // Ejemplo Argentina: "5493444123456"  ← ⚠️ PLACEHOLDER, cambiar por el real
  whatsapp: "5493444000000",

  // 💰 Precios. Poné el número sin puntos (ej: 25000) o null para mostrar "Consultar"
  precios: {
    cuota: null,      // cuota mensual del gym
    campera: null,    // Campera Rompeviento
    musculosa: null,  // Musculosa Deportiva
    remera: null,     // Remera de Entrenamiento
  },
};

/* ============================================================
   A partir de acá no hace falta tocar nada 👇
   ============================================================ */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const formatPrice = (value) =>
  value == null ? "Consultar" : "$ " + value.toLocaleString("es-AR");

const waLink = (message) =>
  `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;

/* ---------- Preloader con contador ---------- */
const preloader = document.getElementById("preloader");
const preloaderCount = document.getElementById("preloaderCount");
let loaded = false;

(() => {
  const start = performance.now();
  const duration = 1100;
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    preloaderCount.textContent = Math.round(progress * 100) + "%";
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else if (loaded || document.readyState === "complete") {
      preloader.classList.add("is-done");
    } else {
      window.addEventListener("load", () => preloader.classList.add("is-done"), { once: true });
    }
  };
  requestAnimationFrame(tick);
})();

window.addEventListener("load", () => (loaded = true));
// Failsafe: nunca dejar el preloader más de 4s
setTimeout(() => preloader.classList.add("is-done"), 4000);

/* ---------- Año del footer ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Precios desde CONFIG ---------- */
document.querySelectorAll("[data-price]").forEach((el) => {
  el.textContent = formatPrice(CONFIG.precios[el.dataset.price]);
});
document.getElementById("cuotaPrecio").textContent = formatPrice(CONFIG.precios.cuota);

/* ---------- Links de WhatsApp genéricos ---------- */
document.querySelectorAll("[data-wa]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    window.open(waLink(el.dataset.wa), "_blank", "noopener");
  });
});

/* ---------- Barra de progreso de scroll ---------- */
const progressBar = document.getElementById("progress");

/* ---------- Nav: fondo al scrollear + menú mobile ---------- */
const nav = document.getElementById("nav");
const navLinks = document.getElementById("navLinks");
const burger = document.getElementById("navBurger");

burger.addEventListener("click", () => {
  const open = navLinks.classList.toggle("is-open");
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  })
);

/* ---------- Link activo según sección visible ---------- */
const sections = [...document.querySelectorAll("section[id]")];
const navAnchors = [...document.querySelectorAll("[data-nav]")];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) =>
          a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ---------- Parallax sutil (scroll-driven, rAF) ---------- */
const parallaxItems = [...document.querySelectorAll("[data-parallax]")].map((el) => ({
  el,
  speed: parseFloat(el.dataset.parallax),
}));

let scrollTicking = false;

const onScroll = () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    const y = window.scrollY;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;

    nav.classList.toggle("is-scrolled", y > 40);
    progressBar.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;

    if (!prefersReducedMotion) {
      parallaxItems.forEach(({ el, speed }) => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + rect.height / 2 - vh / 2) * speed;
        el.style.transform = `translateY(${offset.toFixed(1)}px)`;
      });
    }
    scrollTicking = false;
  });
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll, { passive: true });

/* ---------- Botones magnéticos ---------- */
if (isFinePointer && !prefersReducedMotion) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => (el.style.transition = ""), 500);
    });
  });
}

/* ---------- Tilt 3D en tarjetas ---------- */
if (isFinePointer && !prefersReducedMotion) {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${px * 6}deg) rotateX(${py * -6}deg)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
      el.style.transition = "transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)";
      setTimeout(() => (el.style.transition = ""), 600);
    });
  });
}

/* ---------- Marquees: rellenar el ancho de pantalla sin huecos ---------- */
const fillMarquees = () => {
  document.querySelectorAll(".marquee__track").forEach((track) => {
    track.querySelectorAll(".marquee__group:not(:first-child)").forEach((g) => g.remove());
    const group = track.querySelector(".marquee__group");
    const groupWidth = group.getBoundingClientRect().width;
    if (!groupWidth) return;

    // El loop usa translateX(-50%): hacen falta 2 mitades idénticas que
    // cubran como mínimo 2 anchos de pantalla → cantidad par de copias.
    let copies = Math.max(2, Math.ceil((window.innerWidth * 2) / groupWidth));
    if (copies % 2) copies++;
    for (let i = 1; i < copies; i++) track.appendChild(group.cloneNode(true));

    // Velocidad constante (px/s) sin importar el ancho total
    const totalWidth = groupWidth * copies;
    track.style.animationDuration = (totalWidth / 2 / 70).toFixed(1) + "s";
  });
};

fillMarquees();
// Recalcular cuando la página y las fuentes terminan de cargar:
// el ancho del texto cambia con la tipografía definitiva.
window.addEventListener("load", fillMarquees);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(fillMarquees);

let marqueeResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(marqueeResizeTimer);
  marqueeResizeTimer = setTimeout(fillMarquees, 200);
});

/* ---------- Reveal on scroll + stagger ---------- */
document.querySelectorAll("[data-stagger]").forEach((parent) => {
  [...parent.querySelectorAll(".reveal")].forEach((child, i) => {
    child.style.setProperty("--d", `${Math.min(i * 0.09, 0.55)}s`);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -36px 0px" }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

/* ---------- Contadores de stats ---------- */
const animateCount = (el) => {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1700;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString("es-AR");
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".stat__num").forEach((el) => statsObserver.observe(el));

/* ---------- Productos: thumbs + talles + consulta ---------- */
document.querySelectorAll(".product").forEach((card) => {
  const mainImg = card.querySelector(".product__img:not(.product__img--hover)");
  const hoverImg = card.querySelector(".product__img--hover");
  const thumbs = card.querySelectorAll(".product__thumbs button");
  const sizes = card.querySelectorAll(".product__sizes button");
  const cta = card.querySelector(".product__cta");
  const name = card.dataset.product;
  let selectedSize = null;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      thumbs.forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
      mainImg.classList.add("is-fading");
      // Al elegir miniatura, desactivamos el swap de hover para no pisar la elección
      if (hoverImg) hoverImg.style.display = "none";
      setTimeout(() => {
        mainImg.src = thumb.dataset.img;
        mainImg.classList.remove("is-fading");
      }, 220);
    });
  });

  sizes.forEach((btn) => {
    btn.addEventListener("click", () => {
      const wasActive = btn.classList.contains("is-active");
      sizes.forEach((b) => b.classList.remove("is-active"));
      if (!wasActive) {
        btn.classList.add("is-active");
        selectedSize = btn.textContent;
      } else {
        selectedSize = null;
      }
    });
  });

  cta.addEventListener("click", (e) => {
    e.preventDefault();
    const sizePart = selectedSize ? ` en talle ${selectedSize}` : "";
    window.open(
      waLink(`Hola! Quiero consultar por la ${name}${sizePart} 🛒 ¿Tienen stock?`),
      "_blank",
      "noopener"
    );
  });
});

/* ---------- Modal guía de talles ---------- */
const sizesModal = document.getElementById("sizesModal");
const sizesImg = document.getElementById("sizesImg");

document.getElementById("openSizes").addEventListener("click", () => {
  sizesModal.hidden = false;
  document.body.style.overflow = "hidden";
});

sizesModal.querySelectorAll("[data-close]").forEach((el) =>
  el.addEventListener("click", () => {
    sizesModal.hidden = true;
    document.body.style.overflow = "";
  })
);

sizesModal.querySelectorAll(".modal__tabs button").forEach((tab) => {
  tab.addEventListener("click", () => {
    sizesModal.querySelectorAll(".modal__tabs button").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    sizesImg.src = tab.dataset.guide;
  });
});

/* ---------- Lightbox de galería ---------- */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const galleryItems = [...document.querySelectorAll(".gallery__item")];
let currentIndex = 0;

const showImage = (index) => {
  currentIndex = (index + galleryItems.length) % galleryItems.length;
  const img = galleryItems[currentIndex].querySelector("img");
  const caption = galleryItems[currentIndex].querySelector("figcaption");
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCaption.textContent = caption ? caption.textContent : "";
};

galleryItems.forEach((item, i) => {
  item.addEventListener("click", () => {
    showImage(i);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
  });
});

const closeLightbox = () => {
  lightbox.hidden = true;
  document.body.style.overflow = "";
};

lightbox.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeLightbox));
document.getElementById("lbPrev").addEventListener("click", () => showImage(currentIndex - 1));
document.getElementById("lbNext").addEventListener("click", () => showImage(currentIndex + 1));

document.addEventListener("keydown", (e) => {
  if (!lightbox.hidden) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showImage(currentIndex - 1);
    if (e.key === "ArrowRight") showImage(currentIndex + 1);
  }
  if (!sizesModal.hidden && e.key === "Escape") {
    sizesModal.hidden = true;
    document.body.style.overflow = "";
  }
});
