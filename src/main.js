import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const app = document.querySelector("#app");
const cursor = document.querySelector("#cursor");

gsap.set(cursor, { xPercent: -50, yPercent: -50 });

window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX,
    y: e.clientY,
    duration: 0.4,
    opacity: 0.4,
    delay: 0.1,
    ease: "circ.out",
  });
});

const obj = {
  value: 0,
};

const counter = document.querySelector(".loader-count h2");

/* Horizontal work-section scroll (pinned full-screen) */
const workSection = document.querySelector(".work-section");
const workTrack = document.querySelector(".work-track-horizontal");
const navEl = document.querySelector(".navbar");
const navHeight = navEl ? navEl.offsetHeight : 72;
document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
let workTween;
if (workSection && workTrack) {
  const updateAnimation = () => {
    const totalWidth = workTrack.scrollWidth;
    const viewportW = window.innerWidth;
    const scrollDistance = Math.max(0, totalWidth - viewportW);

    if (workTween) {
      workTween.scrollTrigger?.kill();
      workTween.kill();
    }

    gsap.set(".work-panel a", {
      scale: 0.86,
      rotateZ: -2,
      yPercent: 5,
      opacity: 0.72,
    });

    workTween = gsap.to(workTrack, {
      x: () => -scrollDistance,
      ease: "none",
      scrollTrigger: {
        id: "work-horizontal",
        trigger: workSection,
        start: `top top+=${navHeight}px`,
        end: () => `+=${scrollDistance || viewportW}`,
        scrub: 0.75,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const panels = gsap.utils.toArray(".work-panel");
          panels.forEach((panel) => {
            const card = panel.querySelector("a");
            if (!card) return;
            const bounds = panel.getBoundingClientRect();
            const centerDelta =
              Math.abs(bounds.left + bounds.width / 2 - window.innerWidth / 2) /
              window.innerWidth;
            const focus = gsap.utils.clamp(0, 1, 1 - centerDelta * 1.35);
            gsap.to(card, {
              scale: 0.86 + focus * 0.14,
              rotateZ: -2 + focus * 2,
              yPercent: 5 - focus * 5,
              opacity: 0.72 + focus * 0.28,
              duration: 0.28,
              overwrite: true,
              ease: "power2.out",
            });
          });
          gsap.to(".work-title h1", {
            x: self.progress * 42,
            opacity: 0.92 - self.progress * 0.34,
            duration: 0.2,
            overwrite: true,
          });
        },
      },
    });
  };

  // init and refresh on resize
  updateAnimation();
  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });
}

gsap.to(obj, {
  value: 100,
  duration: 1.7,
  ease: "none",
  onUpdate: () => {
    counter.textContent = `${Math.round(obj.value)}%`;
  },
  onComplete: () => {
    gsap.to(counter, {
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      onComplete: () => {
        tl.play();
      },
    });
  },
});

const tl = gsap.timeline({ paused: true });

gsap.set([".heading h1", ".sub-heading p"], {
  yPercent: 110,
});

gsap.set(".navbar", {
  y: -100,
  opacity: 0,
});

gsap.set(
  [".hero-cta", ".hero-tags", ".hero-bio", ".hero-social", ".scroll-down"],
  {
    y: 30,
    opacity: 0,
  },
);

gsap.set(".mobile-menu", {
  height: 0,
});

gsap.set(".mobile-nav-links", {
  opacity: 0,
});

const navToggle = document.querySelector(".nav-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileLinks = document.querySelectorAll(".mobile-nav-links li");
const menuTimeline = gsap
  .timeline({ paused: true, reversed: true })
  .to(mobileMenu, {
    height: "100vh",
    duration: 0.4,
    ease: "power3.out",
  })
  .to(
    ".mobile-nav-links",
    {
      opacity: 1,
      duration: 0.3,
      ease: "power3.out",
    },
    "-=0.2",
  )
  .from(
    mobileLinks,
    {
      y: -20,
      opacity: 0,
      stagger: 0.08,
      duration: 0.35,
      ease: "power3.out",
    },
    "-=0.2",
  );

if (navToggle) {
  navToggle.addEventListener("click", () => {
    const shouldOpen = menuTimeline.reversed();
    document.body.classList.toggle("mobile-menu-open", shouldOpen);
    if (shouldOpen) {
      menuTimeline.play();
    } else {
      menuTimeline.reverse();
    }
  });
}

tl.to(".loader", {
  y: "100%",
  duration: 0.85,
  ease: "expo.out",
})
  .from(
    ".hero-bg img",
    {
      scale: 1.5,
      duration: 1.23,
      ease: "expo.out",
    },
    "-=1.1",
  )
  .to(
    ".navbar",
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=1",
  )
  .to(
    ".heading h1",
    {
      yPercent: 0,
      duration: 1.1,
      ease: "power3.out",
    },
    "-=0.8",
  )
  .to(
    ".hero-content > *:not(.heading)",
    {
      y: 0,
      opacity: 1,
      stagger: 0.14,
      duration: 0.85,
      ease: "power3.out",
    },
    "-=0.6",
  )
  .from(
    ".nav-links li",
    {
      y: -20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=0.8",
  );

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: 0.8,
    },
  })
  .to(".hero-bg img", { yPercent: 18, scale: 1.08, ease: "none" }, 0)
  .to(".heading h1", { yPercent: -34, opacity: 0.15, ease: "none" }, 0)
  .to(
    ".hero-content > *:not(.heading)",
    { y: -80, opacity: 0, ease: "none" },
    0,
  )
  .to(".hero-section", { "--hero-line-scale": 0, ease: "none" }, 0);

const marqueeTrack = document.querySelector(".marquee-track");
marqueeTrack.innerHTML += marqueeTrack.innerHTML;

const marqueeAnim = gsap.to(marqueeTrack, {
  xPercent: -50,
  duration: 80,
  ease: "none",
  repeat: -1,
  paused: true,
  modifiers: {
    xPercent: gsap.utils.wrap(-50, 0),
  },
});

gsap.from(".marquee-title", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".marquee-section",
    start: "top 80%",
    toggleActions: "play none none none",
  },
});

gsap.from(".marquee-track .skill-card", {
  y: 40,
  opacity: 0,
  stagger: 0.12,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: {
    trigger: ".marquee-section",
    start: "top 75%",
    onEnter: () => marqueeAnim.play(),
  },
});

gsap.utils.toArray(".skill-card").forEach((card, index) => {
  gsap.to(card, {
    y: index % 2 === 0 ? -34 : 34,
    rotateZ: index % 2 === 0 ? -2.5 : 2.5,
    ease: "none",
    scrollTrigger: {
      trigger: ".marquee-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
});

/* Role cycling animation */
const roles = ["Programmer", "Aspiring Data Engineer", "AI Enthusiast"];
let roleIndex = 0;
const roleEl = document.querySelector(".role-dynamic");
const roleEl2 = document.querySelector(".role-static");
if (roleEl) {
  roleEl.textContent = roles[0];
  gsap.set([roleEl, roleEl2], { opacity: 0 });
  gsap.to([roleEl, roleEl2], {
    opacity: 1,
    duration: 0.9,
    ease: "power3.out",
    delay: 0.4,
  });
  setInterval(() => {
    gsap.to(roleEl, {
      opacity: 0,
      duration: 0.45,
      ease: "power1.in",
      onComplete: () => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleEl.textContent = roles[roleIndex];
        gsap.to(roleEl, { opacity: 1, duration: 0.6, ease: "power1.out" });
      },
    });
  }, 3000);
}

// About section reveal
const aboutIntro = document.querySelector(".about-intro");
if (aboutIntro) {
  gsap.from(aboutIntro.children, {
    y: 42,
    opacity: 0,
    stagger: 0.1,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".about-section",
      start: `top 80%`,
      toggleActions: "play none none none",
    },
  });
}

// Hero image rectangular reveal then hide while scrolling the visual section
const visualMask = document.querySelector(".visual-mask");
const visualSection = document.querySelector(".visual-section");
if (visualMask && visualSection) {
  gsap.set(visualMask, { xPercent: 0 });
  gsap.set(".visual-inner img", { scale: 1.18 });
  const tlVisual = gsap.timeline({
    scrollTrigger: {
      trigger: ".visual-section",
      start: "top 76%",
      end: "bottom 24%",
      scrub: 0.8,
      invalidateOnRefresh: true,
    },
  });

  tlVisual
    .to(visualMask, { xPercent: 100, ease: "power2.out", duration: 1 }, 0)
    .to(
      ".visual-inner img",
      { scale: 1, yPercent: -7, ease: "none", duration: 2 },
      0,
    )
    .to(
      ".hero-visual",
      { rotateZ: -1.5, yPercent: -10, ease: "none", duration: 2 },
      0,
    )
    .to(visualMask, { xPercent: 0, ease: "power2.in", duration: 1 }, 1.15);
}

// Contact section reveal animation
const contactSection = document.querySelector(".contact-section");
if (contactSection) {
  gsap.set(".contact-container", { transformPerspective: 900 });
  gsap.from(".contact-container", {
    y: 80,
    rotateX: 8,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 78%",
      toggleActions: "play none none none",
    },
  });

  gsap.from(".contact-info li, .contact-actions a, .contact-form > *", {
    y: 26,
    opacity: 0,
    stagger: 0.055,
    duration: 0.75,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 68%",
      toggleActions: "play none none none",
    },
  });

  gsap.to(".contact-section", {
    backgroundPosition: "0px -120px, -120px 0px, 0 0",
    ease: "none",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
    },
  });
}

// Footer reveal animation
const footerSection = document.querySelector(".footer-section");
if (footerSection) {
  const footerTrack = document.querySelector(".footer-marquee-track");
  if (footerTrack) {
    footerTrack.innerHTML += footerTrack.innerHTML;
    gsap.to(footerTrack, {
      xPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.9,
      },
    });
  }

  gsap.to(".footer-inner", {
    y: 0,
    opacity: 1,
    duration: 1.1,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".footer-section",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
}

// Helper: split text into word spans for nicer stagger reveal
function splitWords(selector) {
  const elems = document.querySelectorAll(selector);
  elems.forEach((el) => {
    const text = el.textContent.trim();
    if (!text) return;
    const words = text.split(/\s+/).map((w) => w + " ");
    const frag = document.createDocumentFragment();
    words.forEach((w) => {
      const wrap = document.createElement("span");
      wrap.className = "word";
      const inner = document.createElement("span");
      inner.textContent = w;
      wrap.appendChild(inner);
      frag.appendChild(wrap);
    });
    el.innerHTML = "";
    el.appendChild(frag);
  });
}

// Apply word-splitting to contact heading and paragraph
splitWords(".contact-left h2");
splitWords(".contact-left p");

// Animate words on scroll with a tight stagger
if (document.querySelector(".contact-left")) {
  gsap.from(".contact-left .word > span", {
    yPercent: 120,
    opacity: 0,
    stagger: 0.03,
    duration: 0.7,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
}

// Contact form submission via Formsubmit AJAX
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const feedback = contactForm.querySelector(".contact-feedback");
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    // simple validation
    if (!name || !email || !message) {
      feedback.textContent = "Please fill out all fields.";
      gsap.fromTo(
        feedback,
        { x: -6 },
        { x: 6, duration: 0.12, yoyo: true, repeat: 3, ease: "power1.inOut" },
      );
      return;
    }

    submitBtn.disabled = true;
    feedback.textContent = "Sending...";

    const formData = new FormData(contactForm);

    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/makwanavinit54@gmail.com",
        {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" },
        },
      );
      const json = await res.json();
      if (json.success || res.ok) {
        feedback.textContent = "Message sent — thank you!";
        gsap.fromTo(
          feedback,
          { opacity: 0 },
          { opacity: 1, duration: 0.6, ease: "power3.out" },
        );
        contactForm.reset();
      } else {
        throw new Error(json.message || "Submission failed");
      }
    } catch (err) {
      console.error("Form submit error", err);
      if (contactForm.action) {
        feedback.textContent = "AJAX failed; submitting directly now...";
        contactForm.submit();
        return;
      }
      feedback.textContent = "Sorry — something went wrong. Try again later.";
      gsap.fromTo(
        feedback,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power3.out" },
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
}
