// IBN HAJAR FOUNDATION-ZARIA — shared site behaviour
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.primary');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Admission form (index/admissions page)
  const admissionForm = document.getElementById('admission-form');
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // NOTE: This is a front-end placeholder. Once the Supabase backend is
      // connected, this will insert the application into the `admissions`
      // table and notify the admin dashboard / school email automatically.
      const status = document.getElementById('admission-status');
      status.hidden = false;
      status.textContent = 'Thank you — your application has been received. Our admissions office will contact you shortly. (Demo mode: connect the database to make this live.)';
      admissionForm.reset();
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('contact-status');
      status.hidden = false;
      status.textContent = 'Thank you for reaching out — we will respond as soon as possible.';
      contactForm.reset();
    });
  }
});
