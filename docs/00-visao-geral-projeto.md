# Trinca Pay — Site institucional (trincapay.com.br)

Documento de referência geral do projeto. Última atualização: 01/08/2026.

## O que é

Site institucional estático da Trinca Pay, reconstruído do zero e colocado em produção no domínio `trincapay.com.br`. Substitui o site anterior (hospedado em outro provedor).

## Stack técnica

- **Tipo:** site estático (HTML + CSS + JS puro, sem framework/build step)
- **Hospedagem:** Cloudflare Pages
- **Deploy:** automático a cada push na branch `main`
- **Repositório:** [github.com/trincapay/trincapay-site](https://github.com/trincapay/trincapay-site) (privado)
- **Projeto Cloudflare Pages:** `trincapay-site-git`
- **Formulário de contato:** função serverless em `functions/api/contact.js`, envio de e-mail via **Resend** (API key), *não* via Cloudflare Email Routing (ver nota abaixo sobre MX records)
- **Compatibility date (wrangler.toml):** 2026-07-31

## Estrutura de pastas do repositório

```
/
├── index.html                      → Home
├── contato/index.html              → Fale com a Trinca Pay
├── sobre-nos/index.html            → Sobre a Trinca Pay
├── repasse-automatico/index.html   → Repasse Automático
├── pagamentos-no-cartao/index.html → Pagamentos no Cartão
├── maquininha-trinca-pay/index.html→ Maquininha Trinca Pay
├── influencer-modelo/index.html    → Landing page exclusiva p/ parceiros/influencers
├── 404.html                        → Página de erro customizada
├── robots.txt
├── sitemap.xml
├── llms.txt                        → arquivo AEO/GEO (contexto p/ LLMs/IA)
├── favicon.webp
├── og-share-image.jpg
├── _headers                        → regras de cache/segurança (Cloudflare Pages)
├── wrangler.toml                   → config do projeto Cloudflare
├── assets/
│   ├── css/                        → design system compartilhado (cache 1 ano, immutable)
│   ├── images/                     → imagens .webp (cache 1 ano, immutable)
│   └── js/
│       └── analytics-events.js     → rastreamento de eventos GA4 (cache 1h)
└── functions/
    └── api/contact.js              → endpoint do formulário de contato (Resend)
```

## Domínio e e-mail — nota importante

O domínio `trincapay.com.br` já tinha (e continua tendo) MX records ativos apontando para a **Umbler**, usados pelo e-mail de negócio (`falecom@`, `suporte@`, etc.). Por isso o projeto **não usa Cloudflare Email Routing** — isso exigiria trocar os MX records e quebraria o e-mail existente. O formulário de contato do site usa a Resend (serviço de e-mail transacional externo) exatamente para não mexer nos MX records.

## Documentos relacionados nesta pasta

- `01-cloudflare-dns-pages.md` — configuração de DNS, Cloudflare Pages, cache/headers, histórico do cutover para produção
- `02-gtm-ga4-eventos.md` — Google Tag Manager, GA4, eventos de conversão configurados
- `03-seo-aeo.md` — Search Console, sitemap, robots.txt, llms.txt, structured data (schema.org)
- `paginas/` — um `.md` por página do site, com propósito, seções e CTAs

## Histórico resumido do projeto

1. Reconstrução completa do site (design system, 8 páginas) comparando visualmente com o site de produção antigo.
2. Correção de bugs de deploy no Cloudflare Pages (upload incompleto de arquivos).
3. Auditoria mobile completa e correção de contraste de cores (acessibilidade AA).
4. SEO/AEO/GEO: robots.txt, sitemap.xml, llms.txt, structured data (schema.org), meta descriptions, alt/title em imagens e links, ordem de headings, lazy loading.
5. Página 404 customizada.
6. Auditoria final pré-produção.
7. Correção de um bug de imagem corrompida (ver commit `28c0669`).
8. **Cutover de DNS para produção** (site novo foi ao ar em `trincapay.com.br`).
9. Resubmissão de sitemap e verificação no Google Search Console.
10. Configuração de rastreamento de eventos de conversão no GTM/GA4 (WhatsApp, telefone, e-mail, área do cliente, formulário de contato).
