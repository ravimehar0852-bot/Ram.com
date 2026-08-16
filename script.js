/* =====================================================
   RAM REALTY — Site scripts
   ===================================================== */
(function () {
  "use strict";

  const WHATSAPP_NUMBER = "917989657658"; // +91 79896 57658, no symbols

  /* ---------- sticky header ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile nav ---------- */
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      const open = hamburger.classList.toggle("is-open");
      mobileNav.classList.toggle("is-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        hamburger.classList.remove("is-open");
        mobileNav.classList.remove("is-open");
        document.body.style.overflow = "";
      })
    );
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- animated stat counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && counters.length) {
    const countIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || "";
          const duration = 1400;
          const start = performance.now();
          const step = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = target < 10 ? (target * eased).toFixed(1) : Math.floor(target * eased);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countIO.unobserve(el);
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countIO.observe(el));
  }

  /* ---------- gallery filter ---------- */
  const filterBtns = document.querySelectorAll(".gfilter");
  const galleryItems = document.querySelectorAll(".gitem");
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const filter = btn.dataset.filter;
      galleryItems.forEach((item) => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("hidden", !match);
      });
    });
  });

  /* ---------- lightbox ---------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lightboxImg = lightbox.querySelector("img");
    const closeBtn = lightbox.querySelector(".lightbox-close");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    let visibleFigures = [];
    let currentIndex = 0;

    const refreshVisible = () =>
      (visibleFigures = Array.from(document.querySelectorAll(".masonry figure:not(.hidden)")));

    const openLightbox = (figure) => {
      refreshVisible();
      currentIndex = visibleFigures.indexOf(figure);
      showCurrent();
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    const showCurrent = () => {
      const fig = visibleFigures[currentIndex];
      if (!fig) return;
      const img = fig.querySelector("img");
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || "";
    };
    const closeLightbox = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".masonry figure").forEach((fig) => {
      fig.addEventListener("click", () => openLightbox(fig));
    });
    closeBtn && closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    prevBtn &&
      prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + visibleFigures.length) % visibleFigures.length;
        showCurrent();
      });
    nextBtn &&
      nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % visibleFigures.length;
        showCurrent();
      });
    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextBtn && nextBtn.click();
      if (e.key === "ArrowLeft") prevBtn && prevBtn.click();
    });
  }

  /* ---------- enquiry form -> WhatsApp handoff ---------- */
  const enquiryForm = document.querySelector("#enquiry-form");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(enquiryForm);
      const name = (data.get("name") || "").toString().trim();
      const phone = (data.get("phone") || "").toString().trim();
      const email = (data.get("email") || "").toString().trim();
      const plot = (data.get("plot") || "").toString().trim();
      const message = (data.get("message") || "").toString().trim();

      const lines = [
        "New enquiry — RAM REALTY website",
        `Name: ${name}`,
        `Phone: ${phone}`,
        email ? `Email: ${email}` : null,
        plot ? `Interested in: ${plot}` : null,
        message ? `Message: ${message}` : null,
      ].filter(Boolean);

      const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;

      const successEl = document.querySelector("#form-success");
      enquiryForm.classList.add("is-hidden");
      enquiryForm.style.display = "none";
      if (successEl) {
        successEl.classList.add("is-visible");
        const waBtn = successEl.querySelector("[data-wa-continue]");
        if (waBtn) waBtn.href = waLink;
        successEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      enquiryForm.reset();
    });
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
