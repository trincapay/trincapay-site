// Cloudflare Pages Function — POST /api/contact
//
// Isso É um Cloudflare Worker: no Cloudflare Pages, qualquer arquivo dentro de
// /functions vira automaticamente uma função serverless (Worker) hospedada
// junto com o site estático, sem precisar de um projeto Workers separado nem
// configurar rotas manualmente. Basta o deploy do Pages já publicar este
// endpoint em https://SEU-DOMINIO/api/contact.
//
// Configuração necessária no painel do Cloudflare Pages (Settings > Environment variables):
//   RESEND_API_KEY  -> chave de API da Resend (https://resend.com), usada para enviar o e-mail.
//   TO_EMAIL         (opcional) -> e-mail de destino. Padrão: falecom@trincapay.com.br
//   FROM_EMAIL       (opcional) -> remetente verificado na Resend. Padrão: contato@trincapay.com.br
//
// Sem a RESEND_API_KEY configurada, o endpoint responde 500 com uma mensagem
// clara — o formulário no site já trata esse erro e sugere o WhatsApp como alternativa.

export async function onRequestPost(context) {
  const { request, env } = context;

  let body;
  try {
    body = await request.json();
  } catch (err) {
    return json({ error: 'Corpo da requisição inválido.' }, 400);
  }

  const nome = (body.nome || '').toString().trim();
  const email = (body.email || '').toString().trim();
  const mensagem = (body.mensagem || '').toString().trim();
  const honeypot = (body.empresa_site || '').toString().trim();

  // Honeypot: se o campo invisível veio preenchido, é bot. Responde 200 "de mentira".
  if (honeypot) {
    return json({ ok: true });
  }

  if (!email || !isValidEmail(email)) {
    return json({ error: 'Informe um email válido.' }, 400);
  }

  if (!env.RESEND_API_KEY) {
    return json({ error: 'Envio de e-mail não configurado (RESEND_API_KEY ausente).' }, 500);
  }

  const toEmail = env.TO_EMAIL || 'falecom@trincapay.com.br';
  const fromEmail = env.FROM_EMAIL || 'Site Trinca Pay <contato@trincapay.com.br>';

  const emailHtml = `
    <h2>Novo contato pelo site da Trinca Pay</h2>
    <p><strong>Nome:</strong> ${escapeHtml(nome) || '(não informado)'}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Mensagem:</strong></p>
    <p>${escapeHtml(mensagem).replace(/\n/g, '<br>') || '(sem mensagem)'}</p>
  `;

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `Novo contato pelo site — ${nome || email}`,
        html: emailHtml
      })
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      return json({ error: 'Falha ao enviar e-mail.', details: errText }, 502);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ error: 'Erro inesperado ao enviar e-mail.' }, 500);
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
