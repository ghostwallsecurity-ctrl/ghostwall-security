(() => {
  const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a[href]").forEach(link => {
    if (link.getAttribute("href").toLowerCase() === currentFile) link.setAttribute("aria-current", "page");
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    });
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }));
  }

  const yearElement = document.getElementById("year");
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  const languageToggle = document.getElementById("language-toggle");
  let currentLanguage = "en";
  const originalTitle = document.title;
  const translatePage = (language) => {
    currentLanguage = language;
    document.documentElement.lang = language;
    document.querySelectorAll("[data-en][data-fr]").forEach(element => {
      const value = element.getAttribute(`data-${language}`);
      if (value !== null) element.innerHTML = value;
    });
    if (languageToggle) languageToggle.textContent = language === "en" ? "FR" : "EN";
    document.title = language === "en" ? originalTitle : "Ghostwall Security | Cybersécurité et solutions numériques au Cameroun";
  };
  languageToggle?.addEventListener("click", () => translatePage(currentLanguage === "en" ? "fr" : "en"));

  const form = document.getElementById("contact-form");
  const note = document.getElementById("form-note");
  const companyEmail = "ghostwallsecurity@gmail.com";
  const whatsappNumber = "237680830228";

  const getEnquiry = () => {
    if (!form || !form.reportValidity()) return null;
    const data = new FormData(form);
    const isFrench = currentLanguage === "fr";
    const business = data.get("business") || (isFrench ? "Non précisée" : "Not provided");
    const message = [
      "GHOSTWALL SECURITY — " + (isFrench ? "Nouvelle demande de service" : "New service enquiry"),
      "",
      `${isFrench ? "Nom" : "Name"}: ${data.get("name")}`,
      `${isFrench ? "Entreprise / organisation" : "Business / organisation"}: ${business}`,
      `Email: ${data.get("email")}`,
      `${isFrench ? "Service demandé" : "Service requested"}: ${data.get("service")}`,
      "",
      `${isFrench ? "Message" : "Message"}:`,
      data.get("message")
    ].join("\n");
    return { message, isFrench };
  };

  document.getElementById("send-whatsapp")?.addEventListener("click", () => {
    const enquiry = getEnquiry();
    if (!enquiry) return;
    if (note) note.textContent = enquiry.isFrench
      ? "WhatsApp va s’ouvrir avec votre demande. Vérifiez les détails puis appuyez sur Envoyer. Le site ne conserve pas la demande."
      : "WhatsApp will open with your enquiry. Review the details and press Send. The website does not store the request.";
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiry.message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });

  document.getElementById("send-email")?.addEventListener("click", () => {
    const enquiry = getEnquiry();
    if (!enquiry) return;
    const subject = enquiry.isFrench
      ? "Demande de service — Ghostwall Security"
      : "Service enquiry — Ghostwall Security";
    if (note) note.textContent = enquiry.isFrench
      ? "Votre application e-mail va s’ouvrir avec le destinataire et le message. Vérifiez puis appuyez sur Envoyer."
      : "Your email app will open with the recipient and message. Review it and press Send.";
    window.location.href = `mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(enquiry.message)}`;
  });

})();
