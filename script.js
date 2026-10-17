
(() => {
  const currentFile = (
    window.location.pathname.split("/").pop() || "index.html"
  ).toLowerCase();

  document.querySelectorAll(".nav-links a[href]").forEach(link => {
    if (link.getAttribute("href").toLowerCase() === currentFile) {
      link.setAttribute("aria-current", "page");
    }
  });

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

    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const languageToggle = document.getElementById("language-toggle");
  let currentLanguage = "en";
  const originalTitle = document.title;

  function translatePage(language) {
    currentLanguage = language;
    document.documentElement.lang = language;

    document.querySelectorAll("[data-en][data-fr]").forEach(element => {
      const value = element.getAttribute(`data-${language}`);

      if (value !== null) {
        element.innerHTML = value;
      }
    });

    document
      .querySelectorAll("[data-en-placeholder][data-fr-placeholder]")
      .forEach(element => {
        element.placeholder = element.getAttribute(
          `data-${language}-placeholder`
        );
      });

    if (languageToggle) {
      languageToggle.textContent = language === "en" ? "FR" : "EN";

      languageToggle.setAttribute(
        "aria-label",
        language === "en"
          ? "Switch language to French"
          : "Passer en anglais"
      );

      languageToggle.setAttribute(
        "aria-pressed",
        String(language === "fr")
      );

      languageToggle.title = language === "en"
        ? "Switch language to French"
        : "Passer en anglais";
    }

    document.title = language === "en"
      ? originalTitle
      : "Ghostwall Security | Cybersécurité et solutions numériques au Cameroun";
  }

  languageToggle?.addEventListener("click", () => {
    translatePage(currentLanguage === "en" ? "fr" : "en");
  });

  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  const submitButton = form?.querySelector('button[type="submit"]');

  const companyEmail = "ghostwallsecurity@gmail.com";
  const whatsappNumber = "237680830228";
  const formspreeEndpoint = "https://formspree.io/f/xnpjgezp";

  function setNote(message, type = "") {
    if (!note) return;

    note.textContent = message;
    note.classList.remove("is-success", "is-error");

    if (type) {
      note.classList.add(type);
    }
  }

  function getEnquiry() {
    if (!form || !form.reportValidity()) {
      return null;
    }

    const data = new FormData(form);
    const isFrench = currentLanguage === "fr";

    const business = data.get("business") ||
      (isFrench ? "Non précisée" : "Not provided");

    const phone = data.get("phone") ||
      (isFrench ? "Non précisé" : "Not provided");

    const message = [
      "GHOSTWALL SECURITY — " +
        (isFrench ? "Nouvelle demande de service" : "New service enquiry"),
      "",
      `${isFrench ? "Nom" : "Name"}: ${data.get("name")}`,
      `${isFrench ? "Entreprise / organisation" : "Business / organisation"}: ${business}`,
      `${isFrench ? "Téléphone" : "Phone"}: ${phone}`,
      `Email: ${data.get("email")}`,
      `${isFrench ? "Service demandé" : "Service requested"}: ${data.get("service")}`,
      "",
      `${isFrench ? "Message" : "Message"}:`,
      data.get("message")
    ].join("\n");

    return { message, isFrench };
  }

  document.getElementById("send-whatsapp")?.addEventListener("click", () => {
    const enquiry = getEnquiry();

    if (!enquiry) return;

    setNote(
      enquiry.isFrench
        ? "WhatsApp va s'ouvrir. Vérifiez votre demande puis appuyez sur Envoyer. Le formulaire ne sera pas transmis à Formspree par cette action."
        : "WhatsApp will open. Review your enquiry and press Send. This action does not submit the form to Formspree."
    );

    const url =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiry.message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });

  document.getElementById("send-email")?.addEventListener("click", () => {
    const enquiry = getEnquiry();

    if (!enquiry) return;

    const subject = enquiry.isFrench
      ? "Demande de service — Ghostwall Security"
      : "Service enquiry — Ghostwall Security";

    setNote(
      enquiry.isFrench
        ? "Votre application e-mail va s'ouvrir. Vérifiez les détails puis appuyez sur Envoyer."
        : "Your email app will open. Review the details and press Send."
    );

    window.location.href =
      `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiry.message)}`;
  });

  if (form) {
    form.addEventListener("submit", async event => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = currentLanguage === "fr"
          ? "Envoi en cours..."
          : "Sending...";
      }

      setNote(
        currentLanguage === "fr"
          ? "Envoi de votre demande en cours..."
          : "Sending your enquiry..."
      );

      try {
        const response = await fetch(formspreeEndpoint, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json"
          }
        });

        if (!response.ok) {
          let errorMessage = "";

          try {
            const result = await response.json();

            errorMessage = result.errors
              ?.map(error => error.message)
              .join(" ");
          } catch (_) {
            // Use the general error message below.
          }

          throw new Error(errorMessage || "Submission failed.");
        }

        setNote(
          currentLanguage === "fr"
            ? "Votre demande a été envoyée avec succès. Merci d'avoir contacté Ghostwall Security."
            : "Your enquiry was sent successfully. Thank you for contacting Ghostwall Security.",
          "is-success"
        );

        form.reset();
      } catch (error) {
        console.error("Enquiry submission failed:", error);

        setNote(
          currentLanguage === "fr"
            ? "L'envoi a échoué. Vérifiez votre connexion ou réessayez par WhatsApp ou e-mail."
            : "Submission failed. Check your connection or try again using WhatsApp or email.",
          "is-error"
        );
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = currentLanguage === "fr"
            ? "Envoyer la demande"
            : "Send enquiry";
        }
      }
    });
  }
})();
