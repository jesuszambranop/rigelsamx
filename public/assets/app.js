(() => {
  'use strict';
  const en = document.documentElement.lang === 'en';
  const t = (es, english) => en ? english : es;
  const config = window.RIGEL_CONFIG;
  const menus = [...document.querySelectorAll('.header details')];
  menus.forEach(menu => menu.addEventListener('toggle', () => {
    if (menu.open) menus.forEach(other => {if (other !== menu) other.open = false;});
  }));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    menus.forEach(menu => {if (menu.open) {menu.open = false;menu.querySelector('summary').focus();}});
  });
  document.addEventListener('click', event => {
    menus.forEach(menu => {if (menu.open && !menu.contains(event.target)) menu.open = false;});
  });
  document.querySelectorAll('[data-region]').forEach(a => a.addEventListener('click', () => {
    document.cookie = `rigel_country=${encodeURIComponent(a.dataset.region)}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  }));
  document.querySelectorAll('[data-language]').forEach(a => {
    const target = new URL(a.href);
    target.search = location.search;
    target.hash = location.hash;
    a.href = target.href;
  });
  document.querySelector('[data-print]')?.addEventListener('click', () => window.print());
  const form = document.querySelector('[data-form]');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const label = button.innerHTML;
  const params = new URLSearchParams(location.search);
  const product = form.elements.namedItem('product');
  if (product && ['m1','s70','aplicacion','soporte'].includes(params.get('producto'))) product.value = params.get('producto');
  const material = form.elements.namedItem('material');
  if (material && params.has('material')) material.value = params.get('material').slice(0,120);
  const message = form.elements.namedItem('message');
  if (material?.value) message.value = t(`Quisiera consultar una aplicación sobre ${material.value}. `,`I would like to ask about an application on ${material.value}. `);
  const isStatic = location.hostname.endsWith('.github.io') || location.protocol === 'file:';
  function showMessage(text, error = false) {
    status.textContent = text;
    status.className = `form-status ${error ? 'error' : 'success'}`;
  }
  function directEmail() {
    const email = form.dataset.form === 'careers' ? config.careersEmail : config.email;
    const a = document.createElement('a'); a.href = `mailto:${email}`; a.textContent = email;
    status.append(' ',a);
  }
  let token = '';
  async function getToken() {
    const url = new URL(form.action); url.searchParams.set('action','token');
    const response = await fetch(url,{credentials:'same-origin',cache:'no-store',headers:{Accept:'application/json'}});
    const result = await response.json();
    if (!response.ok || !result.token) throw new Error('token');
    token = result.token;
    form.elements.namedItem('csrf').value = token;
  }
  if (!isStatic) getToken().catch(() => { /* Se reintenta al enviar, sin descartar datos. */ });
  const area = form.elements.namedItem('area');
  const portfolio = form.elements.namedItem('portfolio');
  function syncPortfolio() {
    if (!portfolio) return;
    const marketing = area.value === 'marketing';
    portfolio.closest('label').hidden = !marketing;
    portfolio.disabled = !marketing;
    portfolio.required = marketing;
    if (!marketing) {portfolio.value = '';portfolio.setCustomValidity('');}
  }
  area?.addEventListener('change', syncPortfolio);
  syncPortfolio();
  form.querySelectorAll('input[type=file]').forEach(input => input.addEventListener('change', () => {
    const file = input.files[0];
    const extension = file?.name.match(/\.[^.]+$/)?.[0].toLowerCase();
    const valid = !file || (file.size > 0 && file.size <= 5*1024*1024 && input.accept.split(',').includes(extension));
    input.setCustomValidity(valid ? '' : t('Selecciona un archivo del formato indicado de hasta 5 MB.','Select a file in the specified format up to 5 MB.'));
    if (!valid) input.reportValidity();
  }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity() || button.disabled) return;
    if (isStatic) {
      showMessage(t('No se pudo enviar la solicitud. Escríbenos a','Your inquiry could not be sent. Email us at'),true); directEmail();
      return;
    }
    button.disabled = true;
    button.textContent = t('Enviando…','Sending…');
    showMessage(t('Estamos procesando tu solicitud.','We are processing your inquiry.'));
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(),30000);
    try {
      if (!token) await getToken();
      const response = await fetch(form.action,{method:'POST',body:new FormData(form),credentials:'same-origin',headers:{Accept:'application/json'},signal:controller.signal});
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        if (response.status === 403) {token = '';getToken().catch(()=>{});}
        throw new Error(result.message || t('No fue posible enviar. Intenta otra vez.','Unable to send. Please try again.'));
      }
      showMessage(result.message);
      form.reset();
      syncPortfolio();
      token = ''; getToken().catch(()=>{});
    } catch (error) {
      const text = error.name === 'AbortError' ? t('El servidor tardó en responder. No podemos confirmar el envío. Antes de reintentarlo, puedes consultarnos por correo:','The server took too long to respond. We cannot confirm delivery. Before retrying, you can email us:') : error.message === 'token' || error instanceof SyntaxError || error instanceof TypeError ? t('No se pudo conectar con el formulario. Tus datos siguen aquí. Puedes escribirnos a','Could not connect to the form. Your entries are still here. You can email us at') : error.message;
      showMessage(text,true);directEmail();
    } finally {
      clearTimeout(timeout);button.disabled = false;button.innerHTML = label;
    }
  });
})();
