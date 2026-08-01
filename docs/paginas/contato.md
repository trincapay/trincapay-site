# Página: Contato (/contato)

- **URL:** https://trincapay.com.br/contato
- **Arquivo:** `contato/index.html`
- **Título (tag):** Fale com a Trinca Pay | Atendimento e Contato
- **Meta description:** Entre em contato com a Trinca Pay e converse sobre soluções de pagamento com clareza, suporte humano e orientação para o seu negócio.
- **H1:** Fale com a Trinca Pay.

## Propósito

Página de contato direto — formulário para envio de mensagem + CTA para WhatsApp como alternativa mais rápida.

## Seções (H2, em ordem)

1. Quer entender qual solução faz sentido para sua empresa? *(subtítulo do hero)*
2. Links *(rodapé)*
3. Contatos *(rodapé)*

## Formulário de contato

- Envio via função serverless `functions/api/contact.js`, usando **Resend**.
- Ao lado/abaixo do formulário: frase "Prefere falar direto no WhatsApp?" com botão de atalho.

## Eventos de rastreamento (GA4)

- **`form_submit_success`** — dispara **apenas quando o envio é bem-sucedido** (`res.ok`), não a cada clique no botão de enviar. É a única página que dispara este evento.
- `whatsapp_click` — botão de atalho do formulário (`cta_location: form_contato`)
- `phone_click`, `email_click` — rodapé
- `area_cliente_click` — se presente no rodapé

## Botão flutuante de WhatsApp

Presente também nesta página (canto inferior direito, todas as páginas). Mensagem pré-preenchida específica desta página: "Olá, vim pelo site da TrincaPay (página de Contato) e quero falar com vocês." — evento GA4: `whatsapp_float_click`.
