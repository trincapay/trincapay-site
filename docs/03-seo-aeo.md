# SEO / AEO / GEO

Última atualização: 01/08/2026.

## Google Search Console

- **Tipo de propriedade:** Domain property — `sc-domain:trincapay.com.br` (cobre automaticamente todos os subdomínios e protocolos, http/https/www)
- **Sitemap enviado:** `https://trincapay.com.br/sitemap.xml` (URL completa — sitemaps relativos como `sitemap.xml` são rejeitados pelo Search Console: "Endereço do sitemap inválido")
- **Status do sitemap:** Processado, 6 páginas encontradas
- Reindexação da home solicitada manualmente após o cutover de produção

## `robots.txt`

```
User-agent: *
Disallow:

Sitemap: https://trincapay.com.br/sitemap.xml
```

Libera todo o crawling, sem exceções.

## `sitemap.xml`

Contém as 6 páginas principais (não inclui `/influencer-modelo`, que é uma landing exclusiva para parceiros, nem `/404`):

- `https://trincapay.com.br/`
- `https://trincapay.com.br/pagamentos-no-cartao`
- `https://trincapay.com.br/maquininha-trinca-pay`
- `https://trincapay.com.br/repasse-automatico`
- `https://trincapay.com.br/sobre-nos`
- `https://trincapay.com.br/contato`

## `llms.txt` (AEO/GEO)

Arquivo dedicado a dar contexto estruturado para LLMs/motores de busca por IA (AI Engine Optimization / Generative Engine Optimization). Contém: resumo do que é a Trinca Pay, para quem serve, lista de páginas com descrição de uma linha cada, e informações de contato (WhatsApp, telefone, e-mail).

## Structured Data (schema.org)

Implementado via JSON-LD/microdata nas páginas. Tipos usados:

- `Organization` — em todas as páginas (rodapé)
- `ContactPoint` — em todas as páginas (dados de contato)
- `WebSite` — na home
- `FAQPage` + `Question` + `Answer` — na home, na seção "Perguntas comuns sobre a Trinca Pay"

## Outras otimizações aplicadas

- Meta descriptions reescritas para caber no limite recomendado (~140-160 caracteres) em todas as páginas
- `title` e `alt` em todas as imagens e links
- Ordem sequencial correta de headings (h1 → h2 → h3, sem pular níveis)
- `width`/`height` explícitos + `loading="lazy"` nas imagens (evita layout shift)
- Contraste de cores corrigido para atingir AA (WCAG) em todos os textos
- `<link rel="canonical">` em todas as páginas
- Imagens em `.webp`, com variantes `-mobile.webp` otimizadas para telas pequenas
- Cache agressivo (`immutable`, 1 ano) para CSS e imagens; cache curto (1h) para o JS de analytics

## Página 404 customizada

`404.html` — título "Página não encontrada", com CTA de volta para a home e para o WhatsApp.
