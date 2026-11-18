/* Certification cards render from #certifications-data. Everything else works without JavaScript. */
const ISSUED_MONTHS = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };

function loadCertifications() {
  const data = document.getElementById('certifications-data');
  if (!data) return [];
  try {
    const parsed = JSON.parse(data.textContent);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function issuedTime(issued) {
  const time = document.createElement('time');
  time.textContent = issued;
  const match = /^([A-Z][a-z]{2}) (\d{4})$/.exec(issued);
  if (match && ISSUED_MONTHS[match[1]]) time.dateTime = `${match[2]}-${ISSUED_MONTHS[match[1]]}`;
  return time;
}

function certificationRow(label, value) {
  const row = document.createElement('div');
  const term = document.createElement('dt');
  term.textContent = label;
  const detail = document.createElement('dd');
  if (value instanceof Node) detail.append(value);
  else detail.textContent = value;
  row.append(term, detail);
  return row;
}

function renderCertifications() {
  const grid = document.getElementById('certifications-grid');
  if (!grid) return;
  const fragment = document.createDocumentFragment();

  loadCertifications().forEach((cert, index) => {
    if (!cert || !cert.name) return;
    const article = document.createElement('article');
    article.className = 'certification';

    const top = document.createElement('div');
    top.className = 'certification-top';
    const kicker = document.createElement('p');
    kicker.className = 'certification-kicker';
    kicker.textContent = 'CERTIFICATION';
    const number = document.createElement('span');
    number.className = 'certification-number';
    number.textContent = String(index + 1).padStart(2, '0');
    top.append(kicker, number);

    const title = document.createElement('h3');
    title.textContent = cert.name;

    const meta = document.createElement('dl');
    meta.className = 'certification-meta';
    if (cert.issuer) meta.append(certificationRow('Issuer', cert.issuer));
    if (cert.issued) meta.append(certificationRow('Issued', issuedTime(cert.issued)));
    if (cert.credentialId) {
      const idRow = certificationRow('Credential ID', cert.credentialId);
      idRow.querySelector('dd').className = 'credential-id';
      meta.append(idRow);
    }

    const body = document.createElement('div');
    body.className = 'certification-body';
    body.append(top, title, meta);

    if (cert.thumb && cert.image) {
      const shot = document.createElement('a');
      shot.className = 'cert-shot';
      shot.href = cert.fallback || cert.image;
      shot.target = '_blank';
      shot.rel = 'noopener noreferrer';
      const picture = document.createElement('picture');
      const source = document.createElement('source');
      source.type = 'image/webp';
      source.srcset = cert.thumb;
      const img = document.createElement('img');
      img.src = cert.fallback || cert.thumb;
      img.alt = `${cert.name} certificate`;
      img.width = cert.thumbWidth || 800;
      img.height = cert.thumbHeight || 566;
      img.loading = 'lazy';
      img.decoding = 'async';
      picture.append(source, img);
      shot.append(picture);
      shot.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        if (!openCertLightbox(cert, shot)) return;
        event.preventDefault();
      });
      article.append(shot);
    }

    article.append(body);
    if (cert.verifyUrl) {
      const verify = document.createElement('a');
      verify.className = 'button secondary certification-verify';
      verify.href = cert.verifyUrl;
      verify.target = '_blank';
      verify.rel = 'noopener noreferrer';
      verify.setAttribute('aria-label', `Verify ${cert.name}`);
      verify.append(document.createTextNode('Verify'));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      verify.append(arrow);
      body.append(verify);
    }

    fragment.append(article);
  });

  grid.replaceChildren(fragment);
}

function openCertLightbox(cert, trigger) {
  const dialog = document.getElementById('cert-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return false;
  const title = document.getElementById('cert-lightbox-title');
  const source = document.getElementById('cert-lightbox-source');
  const image = document.getElementById('cert-lightbox-image');
  if (title) title.textContent = cert.name;
  if (source) source.srcset = cert.image;
  if (image) {
    image.src = cert.fallback || cert.image;
    image.alt = `${cert.name} certificate`;
    image.width = cert.imageWidth || 1200;
    image.height = cert.imageHeight || 848;
  }
  if (!openCertLightbox.triggers) openCertLightbox.triggers = new WeakMap();
  openCertLightbox.triggers.set(dialog, trigger);
  if (!dialog.open) dialog.showModal();
  const close = dialog.querySelector('.cert-lightbox-close');
  if (close) close.focus();
  return true;
}

function setupCertLightbox() {
  const dialog = document.getElementById('cert-lightbox');
  if (!dialog) return;
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  const close = dialog.querySelector('.cert-lightbox-close');
  if (close) close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    const trigger = openCertLightbox.triggers && openCertLightbox.triggers.get(dialog);
    if (trigger) trigger.focus();
  });
}

renderCertifications();
setupCertLightbox();

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.service, .project, .stack-section, .certification, .contact').forEach(el => observer.observe(el));
}
