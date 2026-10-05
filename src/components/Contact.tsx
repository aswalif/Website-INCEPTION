import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Aman dipanggil berulang (React StrictMode / HMR): GSAP mengabaikan registrasi ganda.
gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*  DATA — ganti nilai di sini                                                */
/* -------------------------------------------------------------------------- */

const MAPS_URL = "https://maps.google.com/?q=SMK+Telkom+Medan"; // TODO: ganti dengan link Google Maps sekolah

const CONTACTS = [
  { label: "Telephone", text: "(061) XXXXXXX", href: "tel:+6261XXXXXXX" },
  {
    label: "Email",
    text: "info@smktelkom-medan.sch.id",
    href: "mailto:info@smktelkom-medan.sch.id",
  },
  {
    label: "WhatsApp",
    text: "08XXXXXXXXXX",
    href: "https://wa.me/628XXXXXXXXXX", // TODO: ganti nomor (format 62...)
  },
] as const;

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/" }, // TODO
  { label: "YouTube", href: "https://youtube.com/" }, // TODO
  { label: "Facebook", href: "https://facebook.com/" }, // TODO
] as const;

const RED = "#E60012";
const DARK = "#111111";

/* -------------------------------------------------------------------------- */
/*  COMPONENT                                                                 */
/* -------------------------------------------------------------------------- */

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      /* ---------------------------- Reveal (1 timeline) ---------------------------- */
      if (!reduceMotion) {
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: "power3.out" },
        });

        tl.fromTo(
          "[data-label]",
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
        )
          .fromTo(
            "[data-heading-line]",
            { yPercent: 110 },
            { yPercent: 0, duration: 1, stagger: 0.12, ease: "power4.out" },
            "-=0.4",
          )
          .fromTo(
            "[data-desc]",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.8 },
            "-=0.5",
          )
          .fromTo(
            "[data-contact-item]",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.1 },
            "-=0.5",
          )
          .fromTo(
            "[data-hours]",
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.4",
          )
          .fromTo(
            "[data-social]",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1 },
            "-=0.4",
          )
          .fromTo(
            "[data-location]",
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.7 },
            "-=0.2",
          );

        // Putar sekali saja, dari trigger mana pun yang lebih dulu menyala.
        let played = false;
        const play = () => {
          if (played) return;
          played = true;
          tl.play();
        };

        ScrollTrigger.create({
          trigger: container,
          start: "top 80%",
          once: true,
          onEnter: play,
        });

        // Fallback: jika ScrollTrigger di-kill/salah posisi (mis. oleh kode lain),
        // konten tetap muncul saat section terlihat. Tidak akan stuck tersembunyi.
        const io = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              play();
              io.disconnect();
            }
          },
          { threshold: 0.1 },
        );
        io.observe(container);
        cleanups.push(() => io.disconnect());
      }

      /* ------------------------------ Social hover ------------------------------ */
      const hoverDuration = reduceMotion ? 0 : 0.35;

      gsap.set("[data-underline]", {
        scaleX: 0,
        transformOrigin: "left center",
      });

      container.querySelectorAll<HTMLElement>("[data-social]").forEach((el) => {
        const text = el.querySelector<HTMLElement>("[data-social-text]");
        const line = el.querySelector<HTMLElement>("[data-underline]");
        if (!text || !line) return;

        const enter = () => {
          gsap.to(text, {
            color: RED,
            duration: hoverDuration,
            overwrite: "auto",
          });
          gsap.to(line, {
            scaleX: 1,
            transformOrigin: "left center",
            duration: hoverDuration + 0.1,
            ease: "power3.out",
            overwrite: "auto",
          });
        };
        const leave = () => {
          gsap.to(text, {
            color: DARK,
            duration: hoverDuration,
            overwrite: "auto",
          });
          gsap.to(line, {
            scaleX: 0,
            transformOrigin: "right center",
            duration: hoverDuration + 0.1,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        el.addEventListener("focus", enter);
        el.addEventListener("blur", leave);
        cleanups.push(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
          el.removeEventListener("focus", enter);
          el.removeEventListener("blur", leave);
        });
      });

      /* ----------------------------- Location button ----------------------------- */
      const btn = container.querySelector<HTMLElement>("[data-cta]");
      if (btn) {
        const enter = () =>
          gsap.to(btn, {
            backgroundColor: DARK,
            duration: hoverDuration,
            overwrite: "auto",
          });
        const leave = () =>
          gsap.to(btn, {
            backgroundColor: RED,
            duration: hoverDuration,
            overwrite: "auto",
          });

        btn.addEventListener("mouseenter", enter);
        btn.addEventListener("mouseleave", leave);
        btn.addEventListener("focus", enter);
        btn.addEventListener("blur", leave);
        cleanups.push(() => {
          btn.removeEventListener("mouseenter", enter);
          btn.removeEventListener("mouseleave", leave);
          btn.removeEventListener("focus", enter);
          btn.removeEventListener("blur", leave);
        });
      }
    }, containerRef);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert(); // membersihkan tween, timeline, dan ScrollTrigger
    };
  }, []);

  const focusRing =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E60012]";

  return (
    <section
      id="contact"
      ref={containerRef}
      aria-labelledby="contact-heading"
      className="w-full bg-white text-[#111111]"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 py-24 sm:px-10 md:py-28 lg:grid-cols-12 lg:gap-12 lg:px-16 lg:py-36">
        {/* ------------------------------- LEFT ------------------------------- */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p
              data-label
              className="mb-8 flex items-center gap-3 text-xs font-medium tracking-[0.25em] text-[#E60012] sm:text-sm"
            >
              <span
                aria-hidden="true"
                className="block h-px w-8 bg-[#E60012]"
              />
              <span className="uppercase">Contact</span>
            </p>

            <h2
              id="contact-heading"
              className="text-5xl font-bold leading-[1.02] tracking-tight sm:text-7xl lg:text-[5.5rem] xl:text-8xl"
            >
              <span className="block overflow-hidden pb-[0.12em]">
                <span data-heading-line className="block will-change-transform">
                  Let&apos;s
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.12em]">
                <span data-heading-line className="block will-change-transform">
                  Connect
                </span>
              </span>
            </h2>

            <div data-desc className="mt-8 max-w-md">
              <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
                Hubungi SMK Telkom Medan untuk mendapatkan informasi mengenai
                sekolah, program pendidikan, dan berbagai kegiatan kami.
              </p>
              <address className="mt-8 border-l-2 border-[#E60012] pl-4 text-sm not-italic leading-relaxed text-neutral-600">
                <span className="block font-semibold text-[#111111]">
                  SMK Telkom Medan
                </span>
                Medan, Sumatera Utara
              </address>
            </div>
          </div>
        </div>

        {/* ------------------------------- RIGHT ------------------------------ */}
        <div className="lg:col-span-7">
          {/* Contact Information */}
          <div className="border-t border-[#E5E5E5] py-8 sm:py-10">
            <h3 className="mb-6 text-sm font-medium tracking-[0.15em] text-neutral-500">
              Contact Information
            </h3>
            <address className="not-italic">
              <ul className="divide-y divide-[#E5E5E5]">
                {CONTACTS.map((c) => (
                  <li
                    key={c.label}
                    data-contact-item
                    className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-8"
                  >
                    <span className="w-28 shrink-0 text-sm text-neutral-500">
                      {c.label}
                    </span>
                    <a
                      href={c.href}
                      className={`break-words text-xl font-medium transition-colors hover:text-[#E60012] sm:text-2xl ${focusRing}`}
                    >
                      {c.text}
                    </a>
                  </li>
                ))}
              </ul>
            </address>
          </div>

          {/* Opening Hours */}
          <div data-hours className="border-t border-[#E5E5E5] py-8 sm:py-10">
            <h3 className="mb-6 text-sm font-medium tracking-[0.15em] text-neutral-500">
              Opening Hours
            </h3>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-8">
              <span className="w-28 shrink-0 text-sm text-neutral-500">
                Senin – Jumat
              </span>
              <p className="text-xl font-medium sm:text-2xl">
                07.00 – 16.00 WIB
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="border-t border-[#E5E5E5] py-8 sm:py-10">
            <h3 className="mb-6 text-sm font-medium tracking-[0.15em] text-neutral-500">
              Social Media
            </h3>
            <nav aria-label="Media sosial SMK Telkom Medan">
              <ul className="flex flex-wrap gap-x-8 gap-y-2 sm:gap-x-10">
                {SOCIALS.map((s) => (
                  <li key={s.label} data-social>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.label} SMK Telkom Medan (membuka tab baru)`}
                      className={`relative inline-block py-2 text-xl font-medium sm:text-2xl ${focusRing}`}
                    >
                      <span data-social-text className="text-[#111111]">
                        {s.label}
                      </span>
                      <span
                        data-underline
                        aria-hidden="true"
                        className="absolute bottom-1 left-0 block h-[2px] w-full bg-[#E60012]"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Location */}
          <div className="border-t border-[#E5E5E5] pt-8 sm:pt-10">
            <h3 className="mb-6 text-sm font-medium tracking-[0.15em] text-neutral-500">
              Location
            </h3>
            <div data-location>
              <a
                data-cta
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lihat lokasi SMK Telkom Medan di Google Maps (membuka tab baru)"
                className={`inline-flex w-full items-center justify-center bg-[#E60012] px-8 py-4 text-base font-medium text-white sm:w-auto ${focusRing}`}
              >
                Lihat Lokasi
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
