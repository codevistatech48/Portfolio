Redesign and refactor the ENTIRE CodeVisions website using the attached screenshot as the primary visual reference.

The screenshot represents the new official CodeVisions design language. Do NOT limit the redesign to the homepage hero. Apply this same visual system consistently across the entire website, including every page, section, component, modal, form, dashboard, footer, authentication page, loading state, and responsive layout.

IMPORTANT:
Do not create a completely different design. Preserve the existing CodeVisions functionality, routes, content structure, APIs, authentication logic, forms, and working features wherever possible. Focus on improving the visual design, consistency, responsiveness, UX, and component styling.

==================================================

1. BRAND IDENTITY
   ==================================================

Brand:
CodeVisions

Position CodeVisions as a:

* Premium software development company
* AI and technology company
* Modern digital product engineering company
* Reliable business technology partner

The visual impression should be:
Premium
Technical
Modern
Trustworthy
AI-driven
Enterprise-ready
Minimal
Sophisticated

Avoid:

* Generic IT company templates
* Excessive gradients
* Cheap-looking glassmorphism
* Overly colorful UI
* Excessive animations
* Stock-photo-heavy layouts
* Cluttered dashboards
* Generic Bootstrap-style components

==================================================
2. MASTER VISUAL THEME
======================

Use the attached screenshot as the visual source of truth.

Overall aesthetic:
Dark futuristic SaaS + premium software engineering.

Primary dark background:
#050914
#070B18
#080C18

Secondary surfaces:
#0D1425
#111A2D
#141D31

Primary text:
#F8FAFF

Secondary text:
#9AA8C0

Borders:
rgba(255,255,255,0.08)

Primary accent:
Electric blue

Secondary accent:
Blue-violet / purple

Use blue and violet primarily for:

* CTA buttons
* Active navigation
* Focus states
* Glows
* Important icons
* Data visualization
* Interactive elements

Do not make every element glow.

==================================================
3. BACKGROUND SYSTEM
====================

Create a reusable CodeVisions background system.

The background should include:

* Very subtle technical grid
* Deep navy/black base
* Extremely subtle blue atmospheric glow
* Occasional tiny particles/dots
* Very subtle radial gradients
* Soft blue light around major interactive areas

The grid must remain subtle and should never interfere with readability.

Use the same background language throughout:

* Homepage
* Services
* Projects
* About
* Support
* Authentication
* Contact
* Dashboard
* Footer

Different pages may vary slightly, but they must clearly belong to the same visual system.

==================================================
4. NAVBAR
=========

Recreate the navbar style shown in the screenshot.

Use:

* Large rounded container
* Dark glass surface
* Thin subtle border
* Slight backdrop blur
* Premium spacing
* CodeVisions logo on the left
* Center navigation
* Actions on the right

Navigation:
Home
Projects
About
Support

Actions:
Theme Toggle
Let's Talk
Sign In

The navbar should remain visually consistent across all pages.

On scroll:

* Slightly reduce height
* Increase backdrop blur
* Add subtle border/shadow
* Keep it sticky

On mobile:

* Replace desktop navigation with a premium mobile menu
* Keep theme toggle accessible
* Keep CTA easily accessible

==================================================
5. CODEVISIONS LOGO
===================

Keep the existing CodeVisions branding/logo if already implemented.

Improve its presentation:

* Small rounded logo container
* Subtle blue glow
* Clean white/purple/blue brand treatment
* Proper alignment with brand name

Do not distort the existing logo.

==================================================
6. THEME TOGGLE
===============

Implement a complete Light/Dark mode system.

Dark mode is the DEFAULT.

Theme toggle should appear in the navbar.

Use:
Moon icon for dark mode
Sun icon for light mode

Make it a compact rounded pill.

Animation:

* Smooth sliding indicator
* Sun ↔ Moon transition
* 300–400ms transition
* Subtle glow

Persist the selected theme using localStorage.

IMPORTANT:
Every component must respond to the theme.

Do not create a dark-mode-only website where the toggle changes only the background.

LIGHT MODE:

Background:
#F5F8FF
#EEF3FA

Surface:
#FFFFFF

Text:
#07101F

Secondary text:
#526176

Borders:
#DCE5F2

Accent:
Electric blue

Light mode should feel like a premium enterprise SaaS website, NOT a simple inverted dark theme.

==================================================
7. HOMEPAGE HERO
================

Use the current screenshot as the direct visual reference.

Hero badge:

"Intelligent product engineering"

Headline:

"Software that moves
your business forward."

Supporting text:

"CodeVisions designs and builds secure, scalable digital products that turn ambitious ideas into high-performing experiences."

CTA:

"Start a project →"

Secondary CTA can be:

"Explore our work"

Keep the typography large, bold, clean and highly readable.

The hero should occupy a large visual area without feeling empty.

==================================================
8. HERO VISUALIZATION
=====================

Keep the futuristic dashboard visualization shown in the screenshot.

Use floating glass dashboard cards around the lower hero:

Left:
"Your momentum, visualized."
with a rising bar chart.

Right:
"Delivery velocity"
with a line chart and:
"Live"
"+42.8% this quarter"

Add a large glowing digital blue sphere/horizon in the center.

The visualization should communicate:

* Technology
* Growth
* Analytics
* Product engineering
* Business performance

Do NOT use cryptocurrency references.

Do NOT use finance/stock-market terminology.

Keep the visual abstract and technology/business oriented.

==================================================
9. DESIGN SYSTEM FOR ALL SECTIONS
=================================

Create reusable components:

* GlassCard
* SectionHeading
* Badge
* PrimaryButton
* SecondaryButton
* FeatureCard
* ProjectCard
* ServiceCard
* StatCard
* TestimonialCard
* CTASection
* Navbar
* Footer
* ThemeToggle
* DashboardCard

All components must use the same design tokens.

Do not manually create unrelated styles for every page.

==================================================
10. SERVICES PAGE
=================

Create a premium services layout.

Services:

AI & Automation
Web Application Development
SaaS Development
Mobile Development
Backend & API Engineering
Cloud & DevOps
UI/UX Engineering
Custom Software Development

Each service should have:

* Minimal icon
* Short description
* Technical capabilities
* Hover animation
* Subtle blue glow
* "Learn more →"

Use large cards with generous spacing.

==================================================
11. PROJECTS PAGE
=================

Projects should look like premium technology case studies.

Each project card should contain:

* Project image/visual
* Project name
* Short description
* Technology stack
* Category
* Results/outcome
* View project →

Use asymmetric layouts rather than a basic 3-column Bootstrap grid.

Example categories:
AI
SaaS
Web
Mobile
Automation
Enterprise

Add subtle hover effects:

* Image scale
* Border glow
* Arrow movement
* Background illumination

==================================================
12. ABOUT PAGE
==============

Design the About page around:

"Technology built around your vision."

Include:

* CodeVisions story
* Mission
* Engineering philosophy
* Core values
* Technology expertise
* Team section
* Statistics
* CTA

Use the same dark futuristic design.

==================================================
13. SUPPORT PAGE
================

Create a professional support experience.

Include:

* Search/help area
* FAQ cards
* Contact support
* Documentation links
* Support categories
* Email/contact form

Do not make it look like a generic FAQ template.

==================================================
14. CONTACT / LET'S TALK
========================

Create a premium contact section.

Headline:

"Have an idea worth building?"

Supporting text:

"Tell us what you're building. We'll help turn the idea into a scalable digital product."

Form:
Name
Email
Company
Project type
Budget
Message

Primary CTA:
"Start the conversation →"

Use a large two-column layout:
Left = messaging/value proposition
Right = glass contact form

==================================================
15. AUTHENTICATION PAGES
========================

Apply the same CodeVisions theme to:

* Sign In
* Sign Up
* Forgot Password
* Reset Password
* Email Verification

Do NOT use generic white authentication pages.

Use:
Dark futuristic background
Centered glass card
Subtle blue glow
CodeVisions logo
Clean form fields
Premium buttons
Theme toggle

Keep authentication functionality unchanged.

==================================================
16. DASHBOARD / LOGGED-IN EXPERIENCE
====================================

If the website contains a user dashboard, redesign it using the same system.

Dashboard:

* Dark sidebar
* Glass navigation
* Blue active state
* Clean cards
* Data visualization
* Consistent typography
* Subtle borders
* Responsive layout

Avoid excessive glassmorphism.

==================================================
17. BUTTON SYSTEM
=================

Primary button:

Electric blue → subtle blue-violet gradient

Features:

* Rounded corners
* Soft glow
* Slight hover elevation
* Arrow animation

Secondary button:

* Transparent/glass
* Thin border
* White text in dark mode
* Dark text in light mode

All buttons should have consistent:

* Height
* Radius
* Typography
* Padding
* Hover behavior

==================================================
18. TYPOGRAPHY
==============

Use a modern font such as:
Inter
Geist
Satoshi
SF Pro-style system font

Typography hierarchy:

Hero:
Very large / bold

Section headings:
Large / bold

Body:
Readable / medium contrast

Labels:
Small / uppercase or compact

Use generous line height and spacing.

==================================================
19. ANIMATION
=============

Use subtle premium animations.

Allowed:

* Fade-in
* Slide-up
* Parallax
* Hover elevation
* Border glow
* Chart animation
* Button micro-interactions
* Floating dashboard cards
* Smooth theme transition

Animation should be:
Fast
Smooth
Professional

Avoid:

* Excessive bouncing
* Large spinning animations
* Constant movement
* Distracting particles
* Long loading animations

Use animations to improve UX, not to show off.

==================================================
20. RESPONSIVE DESIGN
=====================

The website must be fully responsive.

Desktop:
Match the provided screenshot's premium composition.

Tablet:
Reorganize floating visual elements and cards.

Mobile:

* Stack content
* Reduce hero typography
* Hide unnecessary decorative dashboard panels
* Maintain the glowing visual identity
* Mobile-friendly navbar
* Proper touch targets
* No horizontal scrolling

The design must look intentionally designed for mobile, not merely shrunk.

==================================================
21. FOOTER
==========

Create a premium dark footer.

Include:

CodeVisions
"Building software that moves businesses forward."

Links:
Services
Projects
About
Support
Contact

Social links:
GitHub
LinkedIn
Instagram

Include:
© CodeVisions
Privacy Policy
Terms

Use subtle borders and blue ambient lighting.

==================================================
22. CONSISTENCY RULE
====================

THIS IS VERY IMPORTANT:

Every page must look like it belongs to the SAME WEBSITE.

Do not create:

* A dark homepage + generic white services page
* A futuristic homepage + basic authentication page
* Different button styles on different pages
* Different border radii
* Different typography systems
* Random colors
* Random card designs

Create one unified CodeVisions Design System and use it everywhere.

==================================================
23. TECHNICAL IMPLEMENTATION
============================

If the existing project uses React/Next.js/Vite:

* Reuse existing components where practical
* Create shared design tokens
* Create reusable UI components
* Avoid duplicated CSS
* Use CSS variables for theme colors
* Implement dark/light mode globally
* Ensure theme persists after refresh
* Keep existing routes and functionality intact
* Do not break API calls
* Do not remove existing features
* Do not replace working business logic just for visual changes

Create a centralized theme system such as:

--background
--surface
--surface-secondary
--foreground
--muted
--border
--primary
--primary-glow
--accent
--card

Use these variables throughout the application.

==================================================
24. FINAL QUALITY TARGET
========================

The final website should feel like a real premium technology company website in 2026.

The user should immediately perceive:

"CodeVisions builds serious software."

The visual quality should be comparable to:

* Premium SaaS startups
* AI companies
* Modern product engineering firms
* Enterprise technology companies

The attached screenshot is the PRIMARY VISUAL REFERENCE.

Preserve its:

* Layout philosophy
* Dark navy aesthetic
* Electric blue glow
* Rounded containers
* Floating dashboard visuals
* Premium typography
* Minimal navigation
* Technical atmosphere

But extend this visual language consistently across the ENTIRE CodeVisions website.

Do not merely copy the hero.

Build a complete, coherent CodeVisions visual identity from it.
