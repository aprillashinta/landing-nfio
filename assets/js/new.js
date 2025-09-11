(() => {
  const $ = (s) => document.querySelector(s);
  const modal = $("#voucherModal");
  const btn = $("#floating-btn");
  try {
    if (window.jQuery) {
      $("#floating-btn").off("click");
      $("#btn-claim-voucher").off("click");
    }
  } catch {}
  localStorage.is_claim ??= "false";
  const COPY = {
    successTitle: "Yeay, Berhasil Klaim Voucher!!",
    successHtml:
      "Selamat, Anda telah berhasil klaim voucher. Silahkan mengikuti langkah selanjutnya yaitu membuat akun fingerspot.io untuk nikmati poin voucher senilai Rp 225.000.",
    successCta: "Ok, Lanjut",
    alreadyTitle: "Sudah Klaim Voucher!",
    alreadyHtml:
      "Hai! Voucher ini sudah menjadi milikmu! Karena kamu sudah mengklaim voucher, ayo lanjutkan dengan membuat akun untuk menikmati poin voucher ini dan mulai jelajahi fitur–fitur sesuai kebutuhanmu.",
    alreadyCta: "Kembali",
  };
  const vmTitle = document.getElementById("vm-title");
  const vmText =
    document.getElementById("vm-desc") || document.querySelector(".vm-text");
  const vmBtn =
    document.getElementById("vm-btn") || document.querySelector(".vm-btn");
  if (vmTitle) vmTitle.textContent = COPY.alreadyTitle;
  if (vmText) vmText.innerHTML = COPY.alreadyHtml;
  if (vmBtn) vmBtn.textContent = COPY.alreadyCta;
  const open = () => {
    if (!modal) return;
    modal.classList.add("is-open");
    modal.ariaHidden = "false";
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.ariaHidden = "true";
    document.body.style.overflow = "";
  };
  const confettiBurst = () => {
    if (!window.confetti) return;
    const end = Date.now() + 1000,
      colors = ["#3F87B9", "#39B5E0", "#A31ACB"];
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: {
          x: 0,
          y: 0.95,
        },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: {
          x: 1,
          y: 0.95,
        },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    setTimeout(() => {
      const c = document.querySelector("canvas");
      if (c) c.style.zIndex = "10000";
    }, 80);
  };
  const showClaimSuccess = () => {
    if (!window.Swal) {
      alert("Berhasil klaim voucher!");
      location.href = "https://fingerspot.io/price";
      return;
    }
    Swal.fire({
      title: "Yeay, Berhasil Klaim Voucher !!",
      html: "Selamat, Anda telah berhasil klaim voucher. Silahkan mengikuti langkah selanjutnya yaitu membuat akun fingerspot.io untuk nikmati poin voucher senilai Rp 225.000.",
      confirmButtonText: "Ok, Lanjut",
      confirmButtonColor: "#4A90E2",
      width: "min(560px, 85vw)",
      padding: "1.25rem",
      buttonsStyling: false,
      backdrop: true,
      customClass: {
        popup: "sw-claim",
        title: "sw-claim-title",
        htmlContainer: "sw-claim-text",
        actions: "sw-claim-actions",
        confirmButton: "sw-claim-btn",
      },
    }).then(() => (location.href = "https://fingerspot.io/price"));
  };
  let locked = false;
  btn?.addEventListener("click", () => {
    if (locked) return;
    locked = true;
    setTimeout(() => (locked = false), 500);
    if (localStorage.is_claim === "false") {
      localStorage.is_claim = "true";
      confettiBurst();
      showClaimSuccess();
      return;
    }
    open();
  });
  document
    .getElementById("btn-claim-voucher")
    ?.addEventListener("click", () => btn?.click());
  modal?.addEventListener(
    "click",
    (e) => e.target.hasAttribute("data-close") && close()
  );
  window.addEventListener(
    "keydown",
    (e) => e.key === "Escape" && modal?.classList.contains("is-open") && close()
  );
})();

if (window.Swiper)
  try {
    document.querySelectorAll(".swiper-container").forEach((el) => {
      if (!el._inited) {
        const slider = el.closest(".testimonials-slider") || el.parentElement;
        new Swiper(el, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          pagination: {
            el: el.querySelector(".swiper-pagination"),
            clickable: true,
          },
          navigation: {
            nextEl: slider.querySelector(".swiper-button-next"),
            prevEl: slider.querySelector(".swiper-button-prev"),
          },
          breakpoints: {
            768: { slidesPerView: 2, spaceBetween: 20 },
            1200: { slidesPerView: 3, spaceBetween: 24 },
          },
        });
        el._inited = true;
      }
    });
  } catch {}

(function () {
  const headerEl = document.querySelector("#route-header");
  const mainEl = document.querySelector("main");
  const homeHeaderHTML = headerEl ? headerEl.innerHTML : "";
  const homeHTML = mainEl.innerHTML;

  const routes = {
    "/": { file: null, title: "Beranda", header: null },
    "/features": { file: "features.html", title: "Fitur", header: "" },
    "/faq": { file: "faq.html", title: "FAQ", header: "" },
    "/price": { file: "price.html", title: "Harga", header: "" },
    "/device": { file: "device.html", title: "Mesin Absensi", header: "" },
    "/check-device": {
      file: "check-device.html",
      title: "Cek Mesin Absensi",
      header: "",
    },
    "/contact": { file: "contact.html", title: "Kontak Kami", header: "" },
  };

  function isSameOrigin(href) {
    try {
      return new URL(href, location.origin).origin === location.origin;
    } catch {
      return false;
    }
  }

  function setActive(path) {
    document
      .querySelectorAll(".navbar .nav-link")
      .forEach((a) => a.classList.remove("active"));
    const target = document.querySelector(
      '.navbar .nav-link[data-route="' + path + '"]'
    );
    if (target) target.classList.add("active");
  }

  function scrollTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function setHeader(route, isHome) {
    if (!headerEl) return;

    if (isHome && route.header === null) {
      headerEl.innerHTML = homeHeaderHTML;
      headerEl.classList.remove("compact");
      return;
    }

    if (route.header === "") {
      headerEl.innerHTML = "";
      headerEl.classList.add("compact");
      return;
    }

    if (route.header) {
      try {
        const res = await fetch(route.header, { credentials: "same-origin" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        headerEl.innerHTML = await res.text();
      } catch {
        headerEl.innerHTML = "";
      }
      headerEl.classList.remove("compact");
      return;
    }

    headerEl.innerHTML = "";
    headerEl.classList.add("compact");
  }

  async function render(path, replaceState = false) {
    const route = routes[path] || routes["/"];
    setActive(path);

    if (!route.file) {
      await setHeader(route, true);
      mainEl.innerHTML = homeHTML;
      document.title = "ABSENSI NFIO";
      if (!replaceState) history.pushState({ path }, "", "/");
      scrollTop();
      reinitPageScripts();
      return;
    }

    try {
      const res = await fetch(route.file, { credentials: "same-origin" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const html = await res.text();
      await setHeader(route, false);
      mainEl.innerHTML = html;
      document.title =
        (route.title ? route.title + " — " : "") + "ABSENSI NFIO";
      if (!replaceState) history.pushState({ path }, "", path);
      scrollTop();
      reinitPageScripts();
    } catch {
      await setHeader({ header: "" }, false);
      mainEl.innerHTML =
        '<div class="container py-5"><h3 class="mb-3">Halaman tidak bisa dimuat</h3><p class="text-muted">Coba lagi nanti atau hubungi admin.</p></div>';
      document.title = "ABSENSI NFIO";
      if (!replaceState) history.pushState({ path }, "", path);
      scrollTop();
    }
  }

  function reinitPageScripts() {
    if (window.WOW)
      try {
        new WOW().init();
      } catch {}
    if (window.jQuery && window.jQuery.fn && window.jQuery.fn.fancybox)
      try {
        jQuery(".fancy").fancybox();
      } catch {}
    if (window.Swiper)
      try {
        document.querySelectorAll(".swiper-container").forEach((el) => {
          if (!el._inited) {
            new Swiper(el, {
              slidesPerView: 1,
              spaceBetween: 20,
              loop: true,
              pagination: {
                el: el.querySelector(".swiper-pagination"),
                clickable: true,
              },
              navigation: {
                nextEl: el.querySelector(".swiper-button-next"),
                prevEl: el.querySelector(".swiper-button-prev"),
              },
            });
            el._inited = true;
          }
        });
      } catch {}
  }

  document.addEventListener("click", function (e) {
    const a = e.target.closest("a.nav-link[data-route]");
    if (!a) return;
    if (!isSameOrigin(a.href)) return;
    const path = a.getAttribute("data-route") || "/";
    e.preventDefault();
    render(path);
  });

  window.addEventListener("popstate", function (e) {
    const path = (e.state && e.state.path) || window.location.pathname;
    if (routes[path]) render(path, true);
    else render("/", true);
  });

  (function initialLoad() {
    const path = routes[window.location.pathname]
      ? window.location.pathname
      : "/";
    if (path === "/") {
      setActive("/");
      document.title = "ABSENSI NFIO";
      setHeader(routes["/"], true);
    } else {
      render(path, true);
    }
  })();
})();
dropdownLangBtn