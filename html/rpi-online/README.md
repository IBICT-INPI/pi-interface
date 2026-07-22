# RPI Online — Revista da Propriedade Industrial

Protótipo de reformulação da experiência de consulta à Revista da Propriedade Industrial do INPI. Permite pesquisar registros publicados, navegar pelas edições e seções da RPI, e acessar individualmente cada publicação em HTML.

## Objetivo

Transformar a experiência atual de download da RPI (disponível em https://revistas.inpi.gov.br/rpi/) em uma interface de consulta moderna, mantendo o PDF oficial como documento de referência e adicionando:

- Pesquisa por número de pedido, partes e data de publicação
- Navegação por edições da RPI e seções por tipo de ativo
- Individualização de publicações em páginas HTML próprias

## Páginas disponíveis

| Página | Arquivo | Descrição |
|--------|---------|-----------|
| Página inicial | `index.html` | Pesquisa nas revistas e navegação por edições/seções |
| Resultados | `resultados.html` | Lista de publicações encontradas com filtros |
| Detalhe | `detalhe.html` | Publicação individual com metadados completos |

## Estrutura de arquivos

```
rpi-online/
├── index.html                          ← Página inicial
├── resultados.html                     ← Resultados da pesquisa
├── detalhe.html                        ← Publicação individual
├── README.md                           ← Este arquivo
│
└── assets/
    ├── css/
    │   ├── app.css                     ← Cópia do CSS principal do ServiçosPI
    │   └── rpi-online.css              ← Estilos exclusivos (escopados em .rpi-online)
    ├── js/
    │   ├── rpi-data.js                 ← Base de dados demonstrativa (6 registros)
    │   └── rpi-online.js               ← Lógica: pesquisa, tabs, accordions, navegação
    ├── img/
    │   └── logo-inpi.jpg               ← Logo INPI (cópia local)
    └── docs/                           ← Reservado para PDFs oficiais
        └── Desenhos_Industriais2897.pdf  ← (inserir manualmente)
```

## Origem visual

O shell institucional (cabeçalho, menu lateral, rodapé, skiplinks, breadcrumb) foi extraído do **Portal de Estatísticas do INPI** (`portal-estatisticas/html/mobile-v2/index.html`), produto mais recente do projeto ServiçosPI.

Nenhum estilo específico da experiência mobile de consulta do Portal de Estatísticas foi reutilizado no miolo da RPI.

## Instruções para abrir

1. Abra o arquivo `index.html` diretamente no navegador:
   ```
   D:\dev\servicos-pi\rpi-online\index.html
   ```
2. Não é necessário servidor, build ou framework.
3. A conexão com a internet é necessária para carregar fontes, ícones e o JavaScript de inicialização do DS Gov.br via CDN.

## Inserção do PDF oficial

Para que os botões "Baixar PDF oficial" funcionem:

1. Copie o PDF da RPI 2897 (seção de Desenhos Industriais) para:
   ```
   D:\dev\servicos-pi\rpi-online\assets\docs\Desenhos_Industriais2897.pdf
   ```
2. O nome do arquivo esperado é exatamente `Desenhos_Industriais2897.pdf`.
3. Os botões de download já apontam para esse caminho e funcionarão automaticamente.

Enquanto o arquivo não estiver presente, o clique no botão resultará em erro 404 do navegador — comportamento esperado para protótipo.

## Funcionalidades implementadas

- [x] Pesquisa por número do pedido (com ou sem pontuação)
- [x] Pesquisa por partes (titular, procurador)
- [x] Filtro por data de publicação (data inicial/final)
- [x] Filtro por tipo de ativo (somente Desenho Industrial funcional)
- [x] Comparação sem acentos e case-insensitive
- [x] Validação de formulário com mensagem acessível
- [x] Navegação por edições da RPI via tabs acessíveis (setas, Home, End)
- [x] Navegação por seções/ativos via tabs acessíveis
- [x] Accordions com 13 grupos e subcategorias reais
- [x] Contagens calculadas dos dados reais para categorias funcionais
- [x] Chips de filtros ativos com remoção individual
- [x] Ordenação de resultados (4 critérios)
- [x] Highlight de termos pesquisados com `<mark>`
- [x] Estado vazio para pesquisas sem resultado
- [x] Página individual com metadados completos em `<dl>`
- [x] Cópia de link via Clipboard API com feedback acessível
- [x] Impressão via `window.print()`
- [x] Navegação anterior/próxima entre publicações
- [x] JSON-LD com schema.org/Article
- [x] Title dinâmico por JavaScript
- [x] Breadcrumb completo e dinâmico
- [x] Botão "Voltar aos resultados" com preservação de filtros

## Limitações do protótipo

- **Somente Desenho Industrial** está funcional — os demais ativos (Marcas, Patentes, Programas de Computador, Contratos de Tecnologia, Indicações Geográficas, Topografias) são representações visuais marcadas como "em breve".
- **Somente a RPI 2897** contém dados — as edições 2896, 2895 e 2894 aparecem como tabs desabilitadas.
- **6 registros demonstrativos** — dados reais da RPI 2897, utilizados para prototipação.
- **3 categorias funcionais**: Exigência de pagamento (1 registro), Notificação de depósito (4 registros), Notificação de depósito — pedido em sigilo (1 registro).
- **Paginação visual** — estrutura estática sem funcionalidade real.
- **PDF não incluído** — deve ser inserido manualmente em `assets/docs/`.

## Arquivos copiados de outros produtos

| Arquivo | Origem |
|---------|--------|
| `assets/css/app.css` | `portal-estatisticas/html/app.css` |
| `assets/img/logo-inpi.jpg` | `pi-interface/html/assets/logo-inpi.jpg` |

## Arquivos novos (exclusivos da RPI Online)

- `index.html`
- `resultados.html`
- `detalhe.html`
- `README.md`
- `assets/css/rpi-online.css`
- `assets/js/rpi-data.js`
- `assets/js/rpi-online.js`

## Dependências externas (CDN)

| Recurso | URL |
|---------|-----|
| Rawline (fonte DS Gov.br) | `cdngovbr-ds.estaleiro.serpro.gov.br` |
| Raleway (fonte Google) | `fonts.googleapis.com` |
| Font Awesome 5.15.4 | `cdnjs.cloudflare.com` |
| JS de inicialização DS Gov.br | `pi-homol.ibict.br/assets/index-D0OAx6S8.js` |
| Favicon | `pi-homol.ibict.br/favicon.png` |
| Logo GOV.BR (footer) | `pi-homol.ibict.br/gov-br-white.png` |
| Logo INPI (footer) | `pi-homol.ibict.br/inpi-white.png` |

## Confirmação de isolamento

Nenhum arquivo fora da pasta `D:\dev\servicos-pi\rpi-online\` foi criado, editado, movido ou renomeado durante o desenvolvimento deste protótipo.
