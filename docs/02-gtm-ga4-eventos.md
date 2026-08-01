# GTM + GA4 — Rastreamento de eventos e conversões

Última atualização: 01/08/2026.

## IDs de referência

| Item | Valor |
|---|---|
| Container GTM | `GTM | TRINCA PAY` |
| Conta GTM | TRINCA PAY |
| Container ID | `GTM-535Q238L` |
| Workspace | ID 6 |
| GA4 Measurement ID | `G-ZHJ673NPZX` |
| Variável permanente do Tag ID | `0 \| GA4 \| Tag ID (G-ZHJ673NPZX)` (pasta "GA4") |
| Propriedade GA4 | GA4 \| TRINCA PAY (`a380730884p520050090`) |
| Última versão publicada | v7 |

## Como o GTM é carregado no site

O snippet do GTM é carregado de forma **adiada** (deferred): só injeta `gtm.js` após interação do usuário ou timeout de 3.5s, para melhorar performance mobile. O array `window.dataLayer` existe desde o primeiro script da página, então qualquer `dataLayer.push()` feito antes do GTM carregar não se perde.

## Tags pré-existentes (herdadas do site antigo)

| Tag | Trigger | Status |
|---|---|---|
| `00 \| HTML Personalizado - Microsoft Clarity` | Initialization - All Pages | ativa |
| `00 \| GA4 - Tag do Google` | Initialization - All Pages | ativa (config base) |
| `01 \| GA4 - PageView` | All Pages | ativa |
| `01 \| Meta Ads - PageView` | All Pages | **pausada** |
| `02 \| HTML Personalizado - setCookies` | Click Text = "Enviar solicitação" | **trigger quebrado** — texto do botão mudou no site novo (ver nota abaixo) |
| `02 \| GA4 - generate_lead` | Click Text = "Enviar solicitação" | **trigger quebrado** (mesmo motivo) |
| `02 \| Meta Ads - Lead` | Click Text = "Enviar solicitação" | pausada + trigger quebrado |
| `03 \| GA4 - contact` | Click URL contém facebook.com / instagram.com / wa.me / whatsapp.com / youtube.com | ativa, mas genérica (não diferencia botão nem página) |
| `03 \| Meta Ads - Contact` | mesmo trigger acima | ativa |
| `Microsoft Clarity - Official` | All Pages | ativa |

**Nota sobre o trigger quebrado:** o gatilho antigo dispara quando o texto clicado é exatamente "Enviar solicitação". No site novo, o botão equivalente tem outro texto (ex.: "Enviar mensagem para a Trinca Pay"), então esse gatilho nunca mais dispara. **Ainda não foi corrigido** — decisão consciente de criar rastreamento novo e granular em paralelo, sem mexer no legado ainda. Se quiser reaproveitar o `generate_lead` antigo, é só atualizar o texto do trigger "Lead \| Click Text é igual a Enviar solicitação".

## Rastreamento novo (criado nesta reforma) — arquitetura

**Script cliente:** `/assets/js/analytics-events.js`, carregado com `defer` em todas as 8 páginas HTML (logo após o comentário `<!-- End Google Tag Manager -->`).

Usa **delegação de evento** — um único listener `click` no `document` (capture phase) que identifica o elemento clicado via `closest('a,button')` e decide o evento pelo `href` ou pela classe CSS. Isso evita precisar alterar HTML de cada botão individualmente.

### Eventos e parâmetros enviados ao dataLayer

| Evento | Disparado quando | Parâmetros |
|---|---|---|
| `whatsapp_click` | clique em link contendo `wa.me` | `cta_label`, `cta_location` (`hero` / `footer_social` / `footer_lista` / `form_contato` / `secao`) |
| `phone_click` | clique em link `tel:` | `cta_label` |
| `email_click` | clique em link `mailto:` | `cta_label` |
| `area_cliente_click` | clique em elemento com classe `.btn-area-cliente` | `cta_label` |
| `form_submit_success` | envio bem-sucedido do formulário de contato (`res.ok`, disparado manualmente no JS da página `/contato`, não por clique) | `cta_label` (fixo: "Formulário de contato") |
| `whatsapp_float_click` | clique no botão flutuante de WhatsApp (classe `.whatsapp-float`, presente em todas as páginas). Checado **antes** do `whatsapp_click` genérico para não conflitar. | `cta_label` |

Todo evento também carrega automaticamente `page_path` e `page_title`.

`cta_label` vem do atributo `title` do elemento clicado (ou texto do link como fallback).

### Variáveis GTM criadas

- `DLV - cta_label` — Variável de camada de dados, lê a chave `cta_label`
- `DLV - cta_location` — Variável de camada de dados, lê a chave `cta_location`

### Triggers (acionadores) criados

Todos do tipo "Evento personalizado", cada um filtrando pelo nome do evento correspondente:

- `CE - whatsapp_click`
- `CE - phone_click`
- `CE - email_click`
- `CE - area_cliente_click`
- `CE - form_submit_success`
- `CE - whatsapp_float_click`

### Tags GA4 criadas

Todas do tipo "Google Analytics: evento do GA4", usando `{{0 | GA4 | Tag ID (G-ZHJ673NPZX)}}` como ID da métrica:

| Tag | Nome do evento no GA4 | Parâmetros enviados | Trigger |
|---|---|---|---|
| `04 \| GA4 - whatsapp_click` | `whatsapp_click` | `cta_label` → `{{DLV - cta_label}}`, `cta_location` → `{{DLV - cta_location}}` | `CE - whatsapp_click` |
| `05 \| GA4 - phone_click` | `phone_click` | `cta_label` → `{{DLV - cta_label}}` | `CE - phone_click` |
| `06 \| GA4 - email_click` | `email_click` | `cta_label` → `{{DLV - cta_label}}` | `CE - email_click` |
| `07 \| GA4 - area_cliente_click` | `area_cliente_click` | `cta_label` → `{{DLV - cta_label}}` | `CE - area_cliente_click` |
| `08 \| GA4 - form_submit_success` | `form_submit_success` | `cta_label` → `{{DLV - cta_label}}` | `CE - form_submit_success` |
| `09 \| GA4 - whatsapp_float_click` | `whatsapp_float_click` | `cta_label` → `{{DLV - cta_label}}` | `CE - whatsapp_float_click` |

## Publicação

- **Versão 6** (01/08/2026): *"Adiciona rastreamento de cliques (WhatsApp, telefone, e-mail, área do cliente) e envio de formulário, via 5 tags GA4 baseadas em eventos personalizados no dataLayer."*
- **Versão 7** (01/08/2026): *"Adiciona trigger CE - whatsapp_float_click e tag 09 | GA4 - whatsapp_float_click, para rastrear cliques no novo botão flutuante de WhatsApp presente em todas as páginas."*

## Verificação feita

Todos os 5 eventos de clique (`whatsapp_click`, `phone_click`, `email_click`, `area_cliente_click`, `whatsapp_float_click`) foram testados ao vivo em `trincapay.com.br` via inspeção direta de `window.dataLayer`, confirmando nome do evento, `cta_label` e `cta_location` corretos. O GTM confirmou o match dos triggers (`gtm.click` / `gtm.linkClick` referenciando os IDs dos novos triggers no container).

`form_submit_success` não foi testado com envio real (para não gerar um lead falso no sistema da Trinca Pay) — a lógica foi validada por leitura de código, já que o `dataLayer.push` está no mesmo bloco que trata `res.ok` do fetch de envio do formulário, em `contato/index.html`.

## Botão flutuante de WhatsApp (adicionado em 01/08/2026)

Botão fixo no canto inferior direito (classe `.whatsapp-float`, CSS em `assets/css/style.css`), presente em todas as 8 páginas do site. Cada página usa uma **mensagem pré-preenchida diferente** no link `wa.me`, adequada ao contexto daquela página (ex.: home menciona "condição de pagamento no cartão", maquininha menciona "maquininha Trinca Pay" etc. — ver `docs/paginas/*.md` para o texto exato de cada uma).

Ícone: `assets/images/icon-whatsapp-white.svg` (versão branca do ícone do WhatsApp, para contraste sobre o fundo verde `#25D366`).

**Importante — bug de cache descoberto e corrigido durante a implementação:** o site usa cache-busting manual via query string (`?v=N`) no `<link>` do CSS e agora também no `<script>` do `analytics-events.js`. Ao editar `style.css` ou `analytics-events.js`, é **obrigatório** incrementar o `?v=N` correspondente em todas as 8 páginas HTML — caso contrário, navegadores que já carregaram o site antes ficam presos à versão antiga em cache (CSS: `immutable`, 1 ano; JS: 1 hora) e não veem as mudanças. Isso causou dois incidentes nesta sessão (botão não aparecia visualmente, depois evento disparava com o nome errado) até o versionamento ser corrigido — ambos resolvidos subindo `style.css?v=7` e `analytics-events.js?v=2`.

## Pendências

1. **Marcar eventos-chave (conversões) no GA4**, especificamente `whatsapp_click`, `whatsapp_float_click` e `form_submit_success`. Isso precisa ser feito em Administrador → Eventos → clicar na estrela ao lado do nome do evento — **mas só é possível depois que o evento aparecer na lista "Eventos recentes"**, o que pode levar algumas horas/dias após a primeira ocorrência real (não teste) do evento.
2. **Decidir o que fazer com o trigger antigo quebrado** (`Lead | Click Text é igual a Enviar solicitação`) — atualizar o texto para o botão atual, ou deixar como legado morto.
3. Considerar reativar/atualizar as tags do Meta Ads (`01 | Meta Ads - PageView` e `02 | Meta Ads - Lead`, ambas pausadas) se a Trinca Pay voltar a rodar tráfego pago no Meta.
4. **Lembrar sempre de incrementar `?v=N`** ao editar `style.css` ou `analytics-events.js` (ver seção acima) — não há automação para isso hoje, é manual em cada um dos 8 arquivos HTML.
