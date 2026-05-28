
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
});


const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


function animateCounter(el, target, suffix = '+') {
  let start = 0;
  const duration = 1600;
  const step = target / (duration / 16);

  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString() + suffix;
    if (start < target) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      document.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '+';
        animateCounter(el, target, suffix);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);


const tabPills = document.querySelectorAll('.tab-pill');
const tabPanels = document.querySelectorAll('.tab-panel');

tabPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const target = pill.dataset.tab;

    tabPills.forEach(p => p.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    pill.classList.add('active');
    document.getElementById('panel-' + target).classList.add('active');
  });
});

function scrollCarousel(id, direction) {
  const row = document.getElementById('carousel-' + id);
  if (row) {
    const cardWidth = row.querySelector('.video-card')?.offsetWidth + 14 || 400;
    row.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  }
}


const gradeSelect = document.getElementById('grade');
if (gradeSelect) {
  gradeSelect.addEventListener('change', () => {
    if (gradeSelect.value) gradeSelect.classList.add('selected');
    else gradeSelect.classList.remove('selected');
  });
}

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwM6Wq8brtgNiI2Fu6OjPjBwzIUm7ZCj1slw7Ug8J1d_2Z6aqqBv2vxhh6NtmnNbwxn/exec';

const form = document.getElementById('enquiryForm');
const successMsg = document.getElementById('successMsg');
const errorMsg = document.getElementById('errorMsg');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Hide old messages
    successMsg.className = 'form-msg';
    errorMsg.className = 'form-msg';

    const data = {
      fullName: document.getElementById('fullName').value.trim(),
      mobile:   document.getElementById('mobile').value.trim(),
      email:    document.getElementById('email').value.trim(),
      grade:    document.getElementById('grade').value,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    // Basic validation
    if (!data.fullName || !data.mobile || !data.email || !data.grade) {
      errorMsg.textContent = 'Please fill in all fields.';
      errorMsg.className = 'form-msg error';
      return;
    }

    if (!/^[0-9]{10}$/.test(data.mobile)) {
      errorMsg.textContent = 'Please enter a valid 10-digit mobile number.';
      errorMsg.className = 'form-msg error';
      return;
    }

    submitBtn.textContent = 'Submitting…';
    submitBtn.disabled = true;

    try {
      // Using no-cors because Google Apps Script returns opaque response
      await fetch(SHEET_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // no-cors = can't read response, assume success if no error thrown
      successMsg.textContent = '✅ Thank you! We\'ll get back to you soon.';
      successMsg.className = 'form-msg success';
      form.reset();
      gradeSelect.classList.remove('selected');

    } catch (err) {
      errorMsg.textContent = '❌ Something went wrong. Please try again.';
      errorMsg.className = 'form-msg error';
    } finally {
      submitBtn.textContent = 'Submit';
      submitBtn.disabled = false;
    }
  });
}
