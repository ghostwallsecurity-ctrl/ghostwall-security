
(() => {
  "use strict";

  // Navigation: mark the current page.
  const currentFile =
    (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

  document.querySelectorAll(".nav-links a[href]").forEach((link) => {
    if (link.getAttribute("href").toLowerCase() === currentFile) {
      link.setAttribute("aria-current", "page");
    }
  });

  // Mobile navigation.
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Current year in the footer.
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // English/French language toggle.
  const languageToggle = document.getElementById("language-toggle");
  let currentLanguage = "en";
  const originalTitle = document.title;

  const translatePage = (language) => {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-en][data-fr]").forEach((element) => {
      const value = element.getAttribute(`data-${language}`);
      if (value !== null) element.innerHTML = value;
    });

    if (languageToggle) {
      languageToggle.textContent = language === "en" ? "FR" : "EN";
    }

    document.title =
      language === "en"
        ? originalTitle
        : "Ghostwall Security | Cybersécurité et solutions numériques au Cameroun";
  };

  languageToggle?.addEventListener("click", () => {
    translatePage(currentLanguage === "en" ? "fr" : "en");
  });

  // Contact form configuration.
  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  const companyEmail = "ghostwallsecurity@gmail.com";
  const whatsappNumber = "237680830228";
  const formspreeEndpoint = "https://formspree.io/f/xnpjgezp";

  const setNote = (english, french) => {
    if (note) {
      note.textContent = currentLanguage === "fr" ? french : english;
    }
  };

  const getEnquiry = () => {
    if (!form || !form.reportValidity()) return null;

    const data = new FormData(form);
    const isFrench = currentLanguage === "fr";
    const business =
      data.get("business") || (isFrench ? "Non précisée" : "Not provided");

    const message = [
      "GHOSTWALL SECURITY — " +
        (isFrench ? "Nouvelle demande de service" : "New service enquiry"),
      "",
      `${isFrench ? "Nom" : "Name"}: ${data.get("name") || ""}`,
      `${isFrench ? "Entreprise / organisation" : "Business / organisation"}: ${business}`,
      `Email: ${data.get("email") || ""}`,
      `${isFrench ? "Service demandé" : "Service requested"}: ${data.get("service") || ""}`,
      "",
      `${isFrench ? "Message" : "Message"}:`,
      data.get("message") || ""
    ].join("\n");

    return { message, isFrench };
  };

  // Real form submission: save the enquiry through Formspree.
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const submitButton = form.querySelector(
        'button[type="submit"], input[type="submit"]'
      );

      if (submitButton) submitButton.disabled = true;

      setNote(
        "Sending your enquiry securely…",
        "Envoi de votre demande en cours…"
      );

      try {
        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        let result = {};
        try {
          result = await response.json();
        } catch {
          // Handle unexpected or non-JSON responses below.
        }

        if (!response.ok || result.errors) {
          throw new Error("Form submission failed");
        }

        form.reset();

        setNote(
          "Thank you! Your enquiry has been submitted. We will contact you soon.",
          "Merci ! Votre demande a bien été envoyée. Nous vous contacterons bientôt."
        );
      } catch (error) {
        console.error("Ghostwall enquiry submission failed:", error);

        setNote(
          "We couldn't submit your enquiry. Please try again or contact us on WhatsApp.",
          "Votre demande n'a pas pu être envoyée. Réessayez ou contactez-nous sur WhatsApp."
        );
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    });
  }

  // WhatsApp option: prepare the enquiry without submitting the web form.
  document.getElementById("send-whatsapp")?.addEventListener("click", (event) => {
    event.preventDefault();

    const enquiry = getEnquiry();
    if (!enquiry) return;

    setNote(
      "WhatsApp will open with your enquiry. Review the details and press Send. This option does not submit the website form.",
      "WhatsApp va s'ouvrir avec votre demande. Vérifiez les détails puis appuyez sur Envoyer. Cette option n'envoie pas le formulaire du site."
    );

    const url =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiry.message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });

  // Email-app option: prepare a draft in the visitor's email application.
  document.getElementById("send-email")?.addEventListener("click", (event) => {
    event.preventDefault();

    const enquiry = getEnquiry();
    if (!enquiry) return;

    const subject = enquiry.isFrench
      ? "Demande de service — Ghostwall Security"
      : "Service enquiry — Ghostwall Security";

    setNote(
      "Your email app will open with the recipient and message. Review it and press Send. This option does not submit the website form.",
      "Votre application e-mail va s'ouvrir avec le destinataire et le message. Vérifiez puis appuyez sur Envoyer. Cette option n'envoie pas le formulaire du site."
    );

    window.location.href =
      `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(enquiry.message)}`;
  });
})();
