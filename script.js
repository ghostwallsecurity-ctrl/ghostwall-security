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


  // Scroll reveal: respects reduced-motion preference and gracefully degrades.
  const revealNodes = document.querySelectorAll(".section-heading, .shortcut-card, .readiness-panel, .readiness-intro, .trust-inner > div");
  revealNodes.forEach(node => node.setAttribute("data-reveal", ""));
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealNodes.forEach(node => revealObserver.observe(node));
  } else {
    revealNodes.forEach(node => node.classList.add("is-revealed"));
  }

  // Interactive, informational security-priority tabs. No user data is collected.
  const readinessData = {
    accounts: { kicker:"IDENTITY SECURITY", title:"Are important accounts protected?", description:"Prioritise multi-factor authentication, unique passwords and secure account recovery for email, banking and business tools." },
    data: { kicker:"BACKUP & RECOVERY", title:"Could your team recover essential files?", description:"Identify critical data, keep protected backups and periodically test restoration. A backup is only useful when recovery works." },
    website: { kicker:"WEBSITE & APPLICATION SECURITY", title:"Is your website maintained and reviewed?", description:"Keep software updated, use HTTPS, review access privileges and arrange a scoped website security assessment." },
    people: { kicker:"SECURITY AWARENESS", title:"Would staff recognise a suspicious request?", description:"Build habits around phishing, Mobile Money fraud, verification of payment instructions and safe handling of business information." }
  };
  document.querySelectorAll(".readiness-tab").forEach(tab => tab.addEventListener("click", () => {
    document.querySelectorAll(".readiness-tab").forEach(other => {
      const active = other === tab;
      other.classList.toggle("is-active", active);
      other.setAttribute("aria-selected", String(active));
    });
    const topic = readinessData[tab.dataset.topic];
    if (!topic) return;
    const kicker = document.getElementById("readiness-kicker");
    const title = document.getElementById("readiness-title");
    const description = document.getElementById("readiness-description");
    [kicker,title,description].forEach(el => { if (el) el.style.opacity = "0"; });
    window.setTimeout(() => {
      if (kicker) kicker.textContent = topic.kicker;
      if (title) title.textContent = topic.title;
      if (description) description.textContent = topic.description;
      [kicker,title,description].forEach(el => { if (el) el.style.opacity = "1"; });
    }, 140);
  }));

})();

// Cinematic network visualizer: intentionally simulated, not connected to any network.
(() => {
  const canvas = document.getElementById('cyber-canvas');
  const scene = document.querySelector('.cyber-scene');
  if (!canvas || !scene) return;
  const ctx = canvas.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, frame = 0, mode = 'monitor';
  const nodes = Array.from({length: 34}, (_, i) => ({
    x: Math.random(), y: Math.random(), r: 1.2 + Math.random() * 2.4,
    phase: Math.random() * Math.PI * 2, speed: .002 + Math.random() * .005,
    edge: i % 6 === 0
  }));
  const packets = Array.from({length: 13}, (_, i) => ({
    from: i, to: (i * 7 + 9) % nodes.length, t: Math.random(), speed: .0018 + Math.random() * .003,
    threat: i % 4 === 0
  }));
  const resize = () => {
    const rect = scene.getBoundingClientRect();
    width = rect.width; height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); window.addEventListener('resize', resize);
  function draw() {
    ctx.clearRect(0, 0, width, height);
    const positions = nodes.map((n, i) => ({
      x: n.x * width + Math.sin(frame * n.speed + n.phase) * 8,
      y: n.y * height + Math.cos(frame * n.speed + n.phase) * 8
    }));
    // Network connections
    positions.forEach((a, i) => positions.forEach((b, j) => {
      if (j <= i) return;
      const dx = a.x - b.x, dy = a.y - b.y, distance = Math.hypot(dx, dy);
      if (distance < Math.min(width, height) * .19) {
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(49,148,255,${.15 * (1 - distance / (Math.min(width,height)*.19))})`;
        ctx.lineWidth = .7; ctx.stroke();
      }
    }));
    // Core and shield rings
    const cx = width * .52, cy = height * .51;
    [64, 91, 121].forEach((radius, idx) => {
      ctx.beginPath(); ctx.arc(cx, cy, radius, frame * (idx % 2 ? -.003 : .002), Math.PI * 2 + frame * .002);
      ctx.strokeStyle = mode === 'defend' ? `rgba(57,238,166,${.24 - idx*.04})` : `rgba(66,167,255,${.23 - idx*.04})`;
      ctx.setLineDash(idx === 1 ? [4, 8] : []); ctx.lineWidth = 1; ctx.stroke(); ctx.setLineDash([]);
    });
    // Central server stack
    ctx.fillStyle = 'rgba(7,28,51,.94)'; ctx.strokeStyle = mode === 'defend' ? '#45e9a7' : '#4ab4ff'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.roundRect(cx - 34, cy - 44, 68, 88, 8); ctx.fill(); ctx.stroke();
    for (let k = 0; k < 3; k++) {
      ctx.fillStyle = mode === 'defend' ? '#4ce8a4' : '#62bcff';
      ctx.fillRect(cx - 20, cy - 27 + k * 23, 40, 3);
      ctx.beginPath(); ctx.arc(cx + 22, cy - 25 + k * 23, 2.3, 0, Math.PI * 2); ctx.fill();
    }
    // Signal packets with simulated threat pulses
    packets.forEach(packet => {
      const a = positions[packet.from], b = positions[packet.to];
      packet.t += reducedMotion ? 0 : packet.speed * (mode === 'detect' ? 1.8 : 1);
      if (packet.t >= 1) packet.t = 0;
      const x = a.x + (b.x - a.x) * packet.t, y = a.y + (b.y - a.y) * packet.t;
      const color = packet.threat && mode !== 'monitor' ? '#ff5478' : (mode === 'defend' ? '#43f0a8' : '#55baff');
      ctx.beginPath(); ctx.arc(x, y, packet.threat ? 3.2 : 2, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.fill(); ctx.shadowBlur = 0;
      if (packet.threat && mode === 'defend' && packet.t > .72) {
        ctx.beginPath(); ctx.arc(x, y, 9 + Math.sin(frame * .08) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(67,240,168,.45)'; ctx.stroke();
      }
    });
    // Nodes
    positions.forEach((pos, i) => {
      const n = nodes[i], color = n.edge && mode !== 'monitor' ? '#ff5878' : '#63bfff';
      ctx.beginPath(); ctx.arc(pos.x, pos.y, n.r, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    });
    frame += reducedMotion ? 0 : 1;
    if (!reducedMotion) requestAnimationFrame(draw);
  }
  draw();
  const scenes = {
    monitor: ['Monitoring network activity', 'Network signals move through a protected environment. The scene is animated for demonstration.', 'NORMAL', 'ACTIVE'],
    detect: ['Suspicious signals identified', 'Highlighted traffic represents a simulated detection event—not a real alert or scan.', 'ANALYSIS', 'INSPECTING'],
    defend: ['Defence layers responding', 'The visual illustrates access control, monitoring and response concepts. No system is being tested.', 'FILTERED', 'PROTECTED']
  };
  document.querySelectorAll('.scene-control').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.scene || 'monitor'; scene.dataset.sceneState = mode;
    document.querySelectorAll('.scene-control').forEach(b => b.classList.toggle('is-active', b === button));
    const data = scenes[mode];
    const title = document.getElementById('scene-title'), desc = document.getElementById('scene-description');
    if (title) title.textContent = data[0]; if (desc) desc.textContent = data[1];
    const traffic = document.getElementById('traffic-value'), defense = document.getElementById('defense-value');
    if (traffic) traffic.textContent = data[2]; if (defense) defense.textContent = data[3];
  }));
}
  
);

(() => {
  const field = document.querySelector("#cursor-domain-field");
  const layer = field && field.querySelector(".domain-field-grid");
  const hero = document.querySelector("#home");
  if (!field || !layer || !hero) return;
  const labels = [
    ".com",".cm",".net",".org",".security",".cloud",".dev",".app",".tech",".io",
    "192.168.1.1","10.0.0.24","172.16.0.8","203.0.113.42","198.51.100.17",
    "TLS 1.3","DNSSEC","HTTPS","SSH","TCP/IP","UDP","FIREWALL","ZERO TRUST",
    "SOC","SIEM","EDR","MFA","IAM","CVE-2026","ENCRYPTED","AUTHENTICATE",
    "ACCESS CONTROL","THREAT INTEL","PACKET FLOW","SECURE GATEWAY","API DEFENCE",
    "ENDPOINT","NETWORK","CLOUD SECURITY","DATA PRIVACY","INCIDENT RESPONSE",
    "PATCH MANAGEMENT","BACKUP","RECOVERY","GHOSTWALL","DEFEND","DETECT","PROTECT",
    "RESILIENCE","CAMEROON","YAOUNDÉ","01001010","10110100","11001001",
    "{auth:true}","[secured]","GET /secure","POST /auth","KEY EXCHANGE",
    "HASH: 8F2A","ROUTE: SAFE","PORT 443","PORT 22","PORT 53","AES-256",
    "SHA-256","X.509","WAF","MALWARE ANALYSIS","RISK ASSESSMENT","SECURITY AUDIT",
    "IDENTITY","MONITORING","ENCRYPTION","VULNERABILITY","PROTECTED ASSET"
  ];
  let seed = 9237;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cols = window.innerWidth < 700 ? 6 : 13;
  const rows = window.innerWidth < 700 ? 12 : 10;
  const count = cols * rows;
  const items = [];
  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "cyber-term";
    el.textContent = labels[(i * 7 + Math.floor(i / cols) * 3) % labels.length];
    const row = Math.floor(i / cols), col = i % cols;
    // Structured horizontal rhythm with alternating row offsets and intentional breathing space.
    const x = 2.5 + col * (95 / cols) + (row % 2 ? 2.2 : 0) + (col % 4 === 0 ? .8 : 0);
    const y = 4 + row * (91 / rows) + (col % 3 === 0 ? .45 : 0);
    el.style.left = `${Math.min(x, 98)}%`;
    el.style.top = `${Math.min(y, 98)}%`;
    el.style.fontSize = `${8.5 + (col % 3) * .55}px`;
    el.classList.add(i % 9 === 2 || i % 11 === 6 ? "cyber-term-accent" : (i % 7 === 4 ? "cyber-term-light" : "cyber-term-muted"));
    layer.appendChild(el);
    items.push(el);
  }
  if (reduced) return;
  let pending = false, mx = -999, my = -999;
  hero.addEventListener("pointermove", ev => {
    const rect = field.getBoundingClientRect();
    mx = ev.clientX - rect.left; my = ev.clientY - rect.top;
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      items.forEach(el => {
        const rectField = field.getBoundingClientRect();
        const x = parseFloat(el.style.left) / 100 * rectField.width;
        const y = parseFloat(el.style.top) / 100 * rectField.height;
        const d = Math.hypot(mx - x, my - y);
        el.classList.toggle("is-near", d < 185);
        el.classList.toggle("is-hot", d < 75);
        el.style.translate = d < 185 ? `${(x-mx)/Math.max(d,1)*8}px ${(y-my)/Math.max(d,1)*8}px` : "0 0";
      });
      pending = false;
    });
  }, {passive:true});
  hero.addEventListener("pointerleave", () => items.forEach(el => {
    el.classList.remove("is-near","is-hot"); el.style.translate = "0 0";
  }), {passive:true});
})();

// Ghostwall interactive tools — client-side educational demo, no answer transmission.
(() => {
  const riskForm = document.getElementById("gw-risk-form");
  const riskResult = document.getElementById("gw-risk-result");
  if (riskForm && riskResult) {
    riskForm.addEventListener("submit", event => {
      event.preventDefault();
      const values = [...riskForm.querySelectorAll("select")].map(select => Number(select.value));
      if (values.length !== 5 || values.some(value => !Number.isFinite(value))) return;
      const score = values.reduce((sum, value) => sum + value, 0);
      const percent = Math.round(score / 10 * 100);
      let heading, copy;
      if (score >= 8) {
        heading = "Baseline looks more established";
        copy = "Your answers indicate several baseline practices are in place. Validate them periodically, test recovery, and review gaps with a qualified professional.";
      } else if (score >= 5) {
        heading = "Some important gaps may remain";
        copy = "Your answers suggest mixed readiness. Prioritize MFA, tested backups, timely patching, staff awareness, and a written incident process.";
      } else {
        heading = "Start with foundational controls";
        copy = "Your answers suggest foundational safeguards may be missing or uncertain. Begin with account protection, backups, updates, and an incident contact plan.";
      }
      riskResult.hidden = false;
      riskResult.innerHTML = `<strong>${heading} · ${percent}% self-reported</strong><p>${copy}</p><p>Indicative questionnaire score only—not a verified security rating or audit result.</p><a href="contact.html">Discuss a baseline review ↗</a>`;
    });
  }
  const org = document.getElementById("gw-org");
  const concern = document.getElementById("gw-concern");
  const match = document.getElementById("gw-service-match");
  const serviceMap = {
    accounts:["Identity security","Review account access, MFA, and identity protection basics."],
    website:["Website audits & application security","Discuss an authorized website review, secure configuration, and remediation priorities."],
    backup:["Backup and recovery","Review backup coverage, recovery objectives, and restoration testing."],
    network:["Network security & computer security","Assess devices, network configuration, access controls, and practical hardening."],
    fraud:["Payment fraud prevention","Strengthen verification habits and safeguards around Mobile Money and payment workflows."],
    staff:["Awareness training","Build staff habits for recognizing phishing, scams, and unsafe requests."],
    incident:["Incident response","If an incident may be active, isolate affected devices where safe, preserve evidence, and contact your provider or relevant authorities; Ghostwall can discuss authorized response support."]
  };
  function updateMatch() {
    if (!concern || !match) return;
    const [title, desc] = serviceMap[concern.value] || serviceMap.accounts;
    const orgType = org ? org.value : "organization";
    match.innerHTML = `<strong>${title}</strong><p>${desc}</p><small style="display:block;color:#8faac7;margin-bottom:10px">Suggested starting point for: ${orgType}</small><a href="contact.html">Discuss this service ↗</a>`;
  }
  org?.addEventListener("change", updateMatch);
  concern?.addEventListener("change", updateMatch);
  updateMatch();
  const replay = document.getElementById("gw-replay-demo");
  const log = document.getElementById("gw-soc-log");
  const count = document.getElementById("gw-event-count");
  if (replay && log && count) {
    const demoEvents = [
      ["09:42:03","Synthetic signal received: unusual access pattern","DEMO","warn"],
      ["09:42:07","Analyst validates event context and scope","INFO","neutral"],
      ["09:42:12","Containment option reviewed in playbook example","DEMO","safe"],
      ["09:42:18","Recovery readiness and documentation checkpoint","INFO","neutral"]
    ];
    replay.addEventListener("click", () => {
      log.innerHTML = "";
      demoEvents.forEach((event, i) => {
        const row = document.createElement("div");
        const time = document.createElement("time"); time.textContent = event[0];
        const message = document.createElement("span"); message.className = `gw-log-${event[3]}`; message.textContent = event[1];
        const badge = document.createElement("b"); badge.textContent = event[2];
        row.append(time,message,badge); log.appendChild(row);
      });
      count.textContent = String(24 + demoEvents.length).padStart(3,"0");
    });
  }
})();
