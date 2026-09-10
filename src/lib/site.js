// Single place for the product hosts so a hostname change is a one-line edit.
// APP_URL is the real app (login); DEMO_URL is the try-it-out demo the CTAs point to.
export const APP_URL = 'https://app.educacionabordo.com'
export const DEMO_URL = 'https://demo.educacionabordo.com'

// Navigation model shared by the header and the mobile sheet.
// An item is a link ({ label, href }) or a group ({ label, children: [links] }); groups render as expandable sections, so sub-pages are added here, never in the components.
export const NAV = [
  { label: 'Características', href: '#features' },
  { label: 'Opiniones', href: '#testimonials' },
  { label: 'Precio', href: '#pricing' },
  {
    label: 'Empezar',
    children: [
      { label: 'Prueba la demo', href: DEMO_URL },
      { label: 'Accede a la app', href: APP_URL },
    ],
  },
]
