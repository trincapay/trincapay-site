# Cloudflare — DNS e Pages

Última atualização: 01/08/2026.

## Conta

- **Conta Cloudflare:** Trincapayadm@gmail.com's Account
- **Account ID:** `66b19f7207bf910c15502c5df184a04b`
- **Zone (domínio):** trincapay.com.br
- **Zone ID:** `c32326a56010e409d5701b63bad9c256`
- **Plano:** Free
- **DNS Setup:** Full

## Cloudflare Pages

- **Nome do projeto:** `trincapay-site-git`
- **Repositório conectado:** github.com/trincapay/trincapay-site
- **Branch de produção:** `main`
- **Deploy:** automático a cada push
- **Custom Domain configurado:** trincapay.com.br (via feature "Custom Domains" do Pages — o próprio Cloudflare gera/atualiza os DNS records automaticamente, pois o domínio já está na mesma conta)

## DNS — estado atual (pós-cutover)

O domínio já estava com a zona gerenciada no Cloudflare. O cutover para produção substituiu o registro raiz (A) e o CNAME `www` por CNAMEs apontando para o projeto Cloudflare Pages.

**Importante:** os **MX records não foram tocados** — o e-mail de negócio (via Umbler) continua funcionando normalmente. Isso foi verificado explicitamente antes e depois do cutover.

## Cutover para produção — o que foi feito

1. Inspeção do estado de DNS existente antes de qualquer alteração.
2. Preview das mudanças que o Cloudflare Pages faria ao ativar o Custom Domain (tela de confirmação mostrando "Existing record" vs "New record").
3. Confirmação explícita do usuário antes de clicar em "Activate domain" (ação que tira o site antigo do ar instantaneamente).
4. Ativação do domínio — site novo foi ao ar em `trincapay.com.br`.
5. Verificação pós-cutover via `fetch()` direto e screenshot ao vivo confirmando o site novo servindo corretamente, com MX/e-mail intactos.

## Cache e headers (`_headers`)

```
/assets/css/*
  Cache-Control: public, max-age=31536000, immutable

/assets/images/*
  Cache-Control: public, max-age=31536000, immutable

/assets/js/*
  Cache-Control: public, max-age=3600

/favicon.webp
  Cache-Control: public, max-age=31536000, immutable

/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

Nota: `/assets/js/*` usa cache curto (1h, não immutable) de propósito, porque o script de rastreamento de eventos (`analytics-events.js`) pode precisar de atualizações frequentes.

## Formulário de contato

- Implementado como Cloudflare Pages Function em `functions/api/contact.js`.
- Envio de e-mail via **Resend** (API key própria, não Cloudflare Email Routing).
- Motivo: preservar os MX records existentes (e-mail de negócio via Umbler).
