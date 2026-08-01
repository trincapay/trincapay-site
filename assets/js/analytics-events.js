/* Trinca Pay - rastreamento de eventos de conversao para GA4 via GTM.
   Usa captura de clique por delegacao (sem precisar alterar cada botao)
   e empurra eventos para o dataLayer, que o GTM ja consome mesmo com
   carregamento adiado (o array dataLayer existe desde o primeiro script). */
(function () {
  function pushEvent(data) {
    window.dataLayer = window.dataLayer || [];
    data.page_path = location.pathname;
    data.page_title = document.title;
    window.dataLayer.push(data);
  }

  function ctaLocation(el) {
    if (el.closest('.site-footer')) {
      return el.closest('.social-icons') ? 'footer_social' : 'footer_lista';
    }
    if (el.closest('.hero')) return 'hero';
    if (el.closest('.contact-form')) return 'form_contato';
    return 'secao';
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a,button');
    if (!el) return;

    var href = el.getAttribute('href') || '';
    var label = el.getAttribute('title') || (el.textContent || '').trim().slice(0, 100);

    if (el.classList.contains('btn-area-cliente')) {
      pushEvent({ event: 'area_cliente_click', cta_label: label });
      return;
    }
    if (href.indexOf('wa.me') !== -1) {
      pushEvent({ event: 'whatsapp_click', cta_label: label, cta_location: ctaLocation(el) });
      return;
    }
    if (href.indexOf('tel:') === 0) {
      pushEvent({ event: 'phone_click', cta_label: label });
      return;
    }
    if (href.indexOf('mailto:') === 0) {
      pushEvent({ event: 'email_click', cta_label: label });
      return;
    }
  }, true);
})();
