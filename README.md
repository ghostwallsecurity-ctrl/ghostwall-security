# Ghostwall Security Website

Static multi-page company website for Ghostwall Security, designed with a business-first navy, white and electric-blue visual identity.

## Pages
- `index.html` — Home
- `services.html` — Services
- `approach.html` — Our approach
- `packages.html` — Packages
- `about.html` — About
- `contact.html` — Contact and enquiry form
- `privacy.html` — Starter privacy notice

## Official logo
`assets/ghostwall-logo.png` is copied byte-for-byte from the official horizontal logo image supplied by the company. It is displayed proportionally without cropping or filters. `assets/ghostwall-shield-artwork.jpg` is a clean crop containing only the shield artwork from the additional graphic you supplied (the wordmark beneath it is excluded); it is used as a secondary visual on Home and About, while the official horizontal logo remains in the header and footer.

## Contact details
- Phone / WhatsApp: +237 680 830 228
- Email: ghostwallsecurity@gmail.com
- WhatsApp enquiry link: `https://wa.me/237680830228`

## Test locally
Open this folder in VS Code, then right-click `index.html` and choose **Open with Live Server**. Use the navigation to check each separate page.

## Enquiry handling — important limitation
The contact form prepares a WhatsApp message or email draft. The visitor must press Send in WhatsApp or their email app. This static site does not automatically store submissions or send backend notifications. If automatic form delivery is required, configure a form service or server endpoint and test it before launch.

## Deploy
This is a static site and can be deployed using GitHub Pages or Cloudflare Pages. For Cloudflare Pages, use the GitHub repository, production branch `main`, and leave the build command blank. The root directory should be the repository root. After the preview deployment is verified, connect `ghostwallsecurity.com` through Cloudflare Pages' custom domain workflow.

## Pre-launch verification checklist
- [ ] Check all six main pages in desktop and mobile viewports.
- [ ] Check logo is not cropped or stretched on header, home visual, About and footer.
- [ ] Check every nav item opens its own HTML page.
- [ ] Check mobile navigation.
- [ ] Check WhatsApp and email form actions.
- [ ] Review privacy notice against actual data handling.
- [ ] Deploy to Cloudflare Pages and verify HTTPS/domain.


## Logo and shield layout fix
The horizontal logo and shield artwork are separate assets. CSS uses proportional `contain` sizing and overrides the previous fixed square image dimensions so the shield is not clipped or stretched. The shield artwork crop excludes the wordmark below the shield.
