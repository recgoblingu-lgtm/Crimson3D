const form = document.querySelector('#purchase-form');
const status = document.querySelector('#form-status');
const button = form.querySelector('button');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  status.className = 'form-status';
  status.textContent = 'Sending your request…';
  button.disabled = true;
  const payload = Object.fromEntries(new FormData(form).entries());
  payload.agree = Boolean(form.elements.agree.checked);
  try {
    const response = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Unable to send request.');
    status.className = 'form-status success';
    status.textContent = 'Request sent — we’ll be in touch soon.';
    form.reset();
  } catch (error) {
    status.className = 'form-status error';
    status.textContent = error.message || 'Something went wrong. Please try again.';
  } finally {
    button.disabled = false;
  }
});
