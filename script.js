// IBN HAJAR FOUNDATION-ZARIA — shared site behaviour
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('nav.primary');
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Admission form (admissions page)
  const admissionForm = document.getElementById('admission-form');
  if (admissionForm) {
    admissionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = document.getElementById('admission-status');
      const data = {
        studentName: document.getElementById('s-name').value.trim(),
        dob: document.getElementById('s-dob').value,
        gender: document.getElementById('s-gender').value,
        classApplyingFor: document.getElementById('s-class').value,
        previousSchool: document.getElementById('s-prev').value.trim(),
        guardianName: document.getElementById('p-name').value.trim(),
        guardianPhone: document.getElementById('p-phone').value.trim(),
        guardianEmail: document.getElementById('p-email').value.trim(),
        guardianRelation: document.getElementById('p-relation') ? document.getElementById('p-relation').value : '',
        guardianAddress: document.getElementById('p-address').value.trim()
      };
      addApplication(data);
      status.hidden = false;
      status.textContent = 'Thank you — your application has been received and sent to our admissions office. You will be contacted using the details provided.';
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
