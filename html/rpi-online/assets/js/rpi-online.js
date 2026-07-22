/**
 * RPI Online — Lógica principal
 * ===============================
 * Pesquisa simulada, tabs acessíveis, accordions, resultados dinâmicos,
 * página de detalhe e ações do usuário.
 *
 * Depende de: rpi-data.js (deve ser carregado antes)
 */

/* global window, document, RPI_REGISTROS, RPI_EDICOES, RPI_SECOES, RPI_CATEGORIAS_DI */

(function () {
  'use strict';

  // ─── Utilitários ───────────────────────────────────────────

  /**
   * Remove acentos de uma string para comparação normalizada.
   */
  function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  /**
   * Normaliza texto para comparação: minúsculo, sem acentos.
   */
  function normalizeText(str) {
    return removeAccents((str || '').toLowerCase().trim());
  }

  /**
   * Remove pontuação de um número de pedido para comparação flexível.
   */
  function normalizeNumber(str) {
    return (str || '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  /**
   * Converte data de DD/MM/AAAA para Date.
   */
  function parseDate(dateStr) {
    if (!dateStr) return null;
    var parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
  }

  /**
   * Converte AAAA-MM-DD (input[type=date]) para Date.
   */
  function parseInputDate(dateStr) {
    if (!dateStr) return null;
    var parts = dateStr.split('-');
    if (parts.length !== 3) return null;
    return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
  }

  /**
   * Formata data de DD/MM/AAAA para formato extenso.
   */
  function formatDateLong(dateStr) {
    var meses = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    var d = parseDate(dateStr);
    if (!d) return dateStr;
    return d.getDate() + ' de ' + meses[d.getMonth()] + ' de ' + d.getFullYear();
  }

  /**
   * Retorna os parâmetros da URL como objeto.
   */
  function getUrlParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (!search) return params;
    search.split('&').forEach(function (pair) {
      var parts = pair.split('=');
      params[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
    });
    return params;
  }

  /**
   * Destaca termos pesquisados em um texto usando <mark>.
   * O texto de entrada deve estar pré-escapado para HTML.
   */
  function highlightText(escapedText, term) {
    if (!term || !escapedText) return escapedText;
    var normalizedTerm = normalizeText(term);
    if (!normalizedTerm) return escapedText;
    var escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp('(' + escaped + ')', 'gi');
    return escapedText.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escapa HTML para prevenir XSS.
   */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Calcula a contagem de registros para uma dada categoria.
   */
  function countByCategory(categoryName) {
    return RPI_REGISTROS.filter(function (r) {
      return r.categoria === categoryName;
    }).length;
  }

  // ─── Pesquisa ──────────────────────────────────────────────

  /**
   * Filtra registros com base nos critérios fornecidos.
   * Os campos Data inicial e Data final filtram EXCLUSIVAMENTE a data de publicação.
   */
  function searchRegistros(params) {
    var results = RPI_REGISTROS.slice();

    if (params.ativo) {
      var normalizedAtivo = normalizeText(params.ativo);
      results = results.filter(function (r) {
        return normalizeText(r.ativo).indexOf(normalizedAtivo) > -1;
      });
    }

    if (params.numero) {
      var normalizedNumero = normalizeNumber(params.numero);
      results = results.filter(function (r) {
        return normalizeNumber(r.numero).indexOf(normalizedNumero) > -1 ||
          normalizeNumber(r.numeroSecundario).indexOf(normalizedNumero) > -1;
      });
    }

    if (params.partes) {
      var normalizedPartes = normalizeText(params.partes);
      results = results.filter(function (r) {
        return normalizeText(r.titular).indexOf(normalizedPartes) > -1 ||
          normalizeText(r.procurador).indexOf(normalizedPartes) > -1;
      });
    }

    // Filtro por data de publicação (NÃO inclui data de depósito)
    if (params.dataInicial) {
      var dataIni = parseInputDate(params.dataInicial);
      if (dataIni) {
        results = results.filter(function (r) {
          var d = parseDate(r.dataPublicacao);
          return d && d >= dataIni;
        });
      }
    }

    if (params.dataFinal) {
      var dataFim = parseInputDate(params.dataFinal);
      if (dataFim) {
        results = results.filter(function (r) {
          var d = parseDate(r.dataPublicacao);
          return d && d <= dataFim;
        });
      }
    }

    if (params.rpi) {
      results = results.filter(function (r) {
        return r.rpi === params.rpi;
      });
    }

    if (params.categoria) {
      var normalizedCategoria = normalizeText(params.categoria);
      results = results.filter(function (r) {
        return normalizeText(r.categoria).indexOf(normalizedCategoria) > -1;
      });
    }

    return results;
  }

  /**
   * Ordena resultados.
   */
  function sortResults(results, sortBy) {
    var sorted = results.slice();
    switch (sortBy) {
      case 'mais-recentes':
        sorted.sort(function (a, b) {
          var da = parseDate(a.dataPublicacao);
          var db = parseDate(b.dataPublicacao);
          return (db || 0) - (da || 0);
        });
        break;
      case 'mais-antigos':
        sorted.sort(function (a, b) {
          var da = parseDate(a.dataPublicacao);
          var db = parseDate(b.dataPublicacao);
          return (da || 0) - (db || 0);
        });
        break;
      case 'numero':
        sorted.sort(function (a, b) {
          return a.numero.localeCompare(b.numero);
        });
        break;
      case 'parte':
        sorted.sort(function (a, b) {
          return a.titular.localeCompare(b.titular);
        });
        break;
      default:
        break;
    }
    return sorted;
  }

  // ─── Tabs acessíveis ──────────────────────────────────────

  /**
   * Inicializa um componente de tabs acessível.
   */
  function initTabs(tablistSelector) {
    var tablist = document.querySelector(tablistSelector);
    if (!tablist) return;

    var tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

    function selectTab(tab) {
      tabs.forEach(function (t) {
        var isSelected = t === tab;
        t.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        t.setAttribute('tabindex', isSelected ? '0' : '-1');
        var panelId = t.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (panel) {
          panel.hidden = !isSelected;
        }
      });
      tab.focus();
    }

    tablist.addEventListener('keydown', function (e) {
      var enabledTabs = tabs.filter(function (t) { return !t.disabled; });
      var currentIndex = enabledTabs.indexOf(document.activeElement);
      if (currentIndex < 0) return;

      var newIndex;
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          newIndex = (currentIndex + 1) % enabledTabs.length;
          selectTab(enabledTabs[newIndex]);
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          newIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
          selectTab(enabledTabs[newIndex]);
          break;
        case 'Home':
          e.preventDefault();
          selectTab(enabledTabs[0]);
          break;
        case 'End':
          e.preventDefault();
          selectTab(enabledTabs[enabledTabs.length - 1]);
          break;
      }
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        if (!tab.disabled) {
          selectTab(tab);
        }
      });
    });
  }

  // ─── Accordions acessíveis ────────────────────────────────

  function initAccordions() {
    var triggers = document.querySelectorAll('.rpi-accordion-trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var panelId = trigger.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (!panel) return;

        trigger.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        panel.hidden = expanded;
      });
    });
  }

  // ─── Página Inicial ────────────────────────────────────────

  function initIndexPage() {
    var searchForm = document.getElementById('rpi-search-form');
    if (!searchForm) return;

    var errorMsg = document.getElementById('rpi-search-error');

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var ativo = document.getElementById('rpi-field-ativo').value;
      var numero = document.getElementById('rpi-field-numero').value.trim();
      var partes = document.getElementById('rpi-field-partes').value.trim();
      var dataInicial = document.getElementById('rpi-field-data-inicial').value;
      var dataFinal = document.getElementById('rpi-field-data-final').value;

      // Validar: pelo menos um critério
      if (!ativo && !numero && !partes && !dataInicial && !dataFinal) {
        errorMsg.setAttribute('aria-hidden', 'false');
        errorMsg.focus();
        return;
      }

      errorMsg.setAttribute('aria-hidden', 'true');

      var params = [];
      if (ativo) params.push('ativo=' + encodeURIComponent(ativo));
      if (numero) params.push('numero=' + encodeURIComponent(numero));
      if (partes) params.push('partes=' + encodeURIComponent(partes));
      if (dataInicial) params.push('dataInicial=' + encodeURIComponent(dataInicial));
      if (dataFinal) params.push('dataFinal=' + encodeURIComponent(dataFinal));

      window.location.href = 'resultados.html?' + params.join('&');
    });

    // Ocultar erro ao interagir com campos
    var fields = searchForm.querySelectorAll('input, select');
    fields.forEach(function (field) {
      field.addEventListener('input', function () {
        if (errorMsg.getAttribute('aria-hidden') === 'false') {
          errorMsg.setAttribute('aria-hidden', 'true');
        }
      });
    });

    // Limpar campos
    var clearBtn = document.getElementById('rpi-clear-fields');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        document.getElementById('rpi-field-ativo').value = '';
        document.getElementById('rpi-field-numero').value = '';
        document.getElementById('rpi-field-partes').value = '';
        document.getElementById('rpi-field-data-inicial').value = '';
        document.getElementById('rpi-field-data-final').value = '';
        errorMsg.setAttribute('aria-hidden', 'true');
        document.getElementById('rpi-field-ativo').focus();
      });
    }

    // Inicializar tabs e accordions
    initTabs('#rpi-edition-tablist');
    initTabs('#rpi-section-tablist');
    initAccordions();

    // Calcular e exibir contagens reais para categorias funcionais
    var countBadges = document.querySelectorAll('[data-rpi-count-category]');
    countBadges.forEach(function (badge) {
      var catName = badge.getAttribute('data-rpi-count-category');
      var count = countByCategory(catName);
      badge.textContent = count;
    });
  }

  // ─── Página de Resultados ─────────────────────────────────

  function initResultsPage() {
    var container = document.getElementById('rpi-results-container');
    if (!container) return;

    var params = getUrlParams();
    var currentSort = 'mais-recentes';

    var paramLabels = {
      ativo: 'Ativo',
      numero: 'Número',
      partes: 'Partes',
      dataInicial: 'Data inicial',
      dataFinal: 'Data final',
      rpi: 'Edição RPI',
      categoria: 'Categoria'
    };

    function renderChips() {
      var chipsContainer = document.getElementById('rpi-chips');
      if (!chipsContainer) return;
      chipsContainer.innerHTML = '';

      var hasFilters = false;
      Object.keys(params).forEach(function (key) {
        if (params[key] && paramLabels[key]) {
          hasFilters = true;
          var chipHtml = '<span class="rpi-chip">' +
            '<span>' + escapeHtml(paramLabels[key]) + ': ' + escapeHtml(params[key]) + '</span>' +
            '<button type="button" class="rpi-chip-remove" data-param="' + escapeHtml(key) + '" ' +
            'aria-label="Remover filtro ' + escapeHtml(paramLabels[key]) + '">' +
            '<i class="fas fa-times" aria-hidden="true"></i></button>' +
            '</span>';
          chipsContainer.insertAdjacentHTML('beforeend', chipHtml);
        }
      });

      if (hasFilters) {
        chipsContainer.insertAdjacentHTML('beforeend',
          '<button type="button" class="rpi-btn-text" id="rpi-clear-filters">' +
          '<i class="fas fa-times-circle" aria-hidden="true"></i> Limpar filtros</button>'
        );

        chipsContainer.querySelectorAll('.rpi-chip-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var paramKey = btn.getAttribute('data-param');
            delete params[paramKey];
            updateResults();
            updateUrl();
          });
        });

        var clearAll = document.getElementById('rpi-clear-filters');
        if (clearAll) {
          clearAll.addEventListener('click', function () {
            params = {};
            updateResults();
            updateUrl();
          });
        }
      }
    }

    function renderSummary(results) {
      var summary = document.getElementById('rpi-results-summary');
      if (!summary) return;

      var parts = [];
      if (params.numero) parts.push('"' + escapeHtml(params.numero) + '"');
      if (params.partes) parts.push('"' + escapeHtml(params.partes) + '"');
      if (params.categoria) parts.push('na categoria "' + escapeHtml(params.categoria) + '"');

      var ativoText = params.ativo ? ' em ' + escapeHtml(params.ativo) : '';
      var searchTerms = parts.length > 0 ? ' para ' + parts.join(', ') : '';

      summary.innerHTML = 'Resultados' + searchTerms + ativoText + '.';
    }

    function renderResults(results) {
      var listContainer = document.getElementById('rpi-results-list');
      var countContainer = document.getElementById('rpi-results-count');
      var liveRegion = document.getElementById('rpi-results-live');
      var emptyState = document.getElementById('rpi-empty-state');
      var toolbarEl = document.getElementById('rpi-results-toolbar');

      if (!listContainer) return;

      var highlightTerm = params.numero || params.partes || '';

      if (results.length === 0) {
        listContainer.innerHTML = '';
        if (countContainer) countContainer.textContent = '0 publicações encontradas';
        if (emptyState) emptyState.hidden = false;
        if (toolbarEl) toolbarEl.hidden = true;
        if (liveRegion) liveRegion.textContent = 'Nenhuma publicação foi encontrada.';
        return;
      }

      if (emptyState) emptyState.hidden = true;
      if (toolbarEl) toolbarEl.hidden = false;

      var countText = results.length + ' publicaç' + (results.length === 1 ? 'ão encontrada' : 'ões encontradas');
      if (countContainer) countContainer.textContent = countText;
      if (liveRegion) liveRegion.textContent = countText + '.';

      var html = '';
      results.forEach(function (r) {
        var excerpt = r.detalhes.length > 180 ? r.detalhes.substring(0, 180) + '…' : r.detalhes;
        html += '<li class="rpi-result-item">' +
          '<div class="rpi-result-header">' +
            '<span class="rpi-result-number">' + highlightText(escapeHtml(r.numero), highlightTerm) + '</span>' +
            '<span class="rpi-result-badge">' + escapeHtml(r.ativo) + '</span>' +
          '</div>' +
          '<div class="rpi-result-meta">' +
            '<span class="rpi-result-meta-item"><i class="fas fa-newspaper" aria-hidden="true"></i> RPI ' + escapeHtml(r.rpi) + '</span>' +
            '<span class="rpi-result-meta-item"><i class="fas fa-calendar-alt" aria-hidden="true"></i> ' + escapeHtml(r.dataPublicacao) + '</span>' +
            '<span class="rpi-result-meta-item"><i class="fas fa-layer-group" aria-hidden="true"></i> ' + escapeHtml(r.secao) + '</span>' +
            '<span class="rpi-result-meta-item"><i class="fas fa-tag" aria-hidden="true"></i> Despacho ' + escapeHtml(r.codigoDespacho) + '</span>' +
          '</div>' +
          '<div class="rpi-result-despacho">' + highlightText(escapeHtml(r.despacho), highlightTerm) + '</div>' +
          '<div class="rpi-result-parties">' +
            '<strong>Titular:</strong> ' + highlightText(escapeHtml(r.titular), highlightTerm) +
            (r.procurador && r.procurador !== 'Não informado' && r.procurador !== 'Cancelado'
              ? ' · <strong>Procurador:</strong> ' + highlightText(escapeHtml(r.procurador), highlightTerm)
              : '') +
          '</div>' +
          '<div class="rpi-result-excerpt">' + highlightText(escapeHtml(excerpt), highlightTerm) + '</div>' +
          '<div class="rpi-result-action">' +
            '<a href="detalhe.html?id=' + encodeURIComponent(r.id) + '" class="rpi-btn-secondary">' +
            '<i class="fas fa-file-alt" aria-hidden="true"></i> Ver publicação</a>' +
          '</div>' +
        '</li>';
      });

      listContainer.innerHTML = html;
    }

    function updateResults() {
      renderChips();
      var results = searchRegistros(params);
      results = sortResults(results, currentSort);
      renderSummary(results);
      renderResults(results);
    }

    function updateUrl() {
      var queryParts = [];
      Object.keys(params).forEach(function (key) {
        if (params[key]) {
          queryParts.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }
      });
      var newUrl = 'resultados.html' + (queryParts.length > 0 ? '?' + queryParts.join('&') : '');
      window.history.replaceState(null, '', newUrl);
    }

    // Ordenação
    var sortSelect = document.getElementById('rpi-sort');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        currentSort = sortSelect.value;
        updateResults();
      });
    }

    updateResults();
  }

  // ─── Página de Detalhe ────────────────────────────────────

  function initDetailPage() {
    var detailContainer = document.getElementById('rpi-detail-container');
    if (!detailContainer) return;

    var params = getUrlParams();
    var id = params.id;

    if (!id) {
      detailContainer.innerHTML = '<div class="rpi-empty-state">' +
        '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>' +
        '<h2>Publicação não encontrada</h2>' +
        '<p>Nenhum identificador foi informado na URL.</p>' +
        '<a href="index.html" class="rpi-btn-primary">Voltar ao início</a></div>';
      return;
    }

    // Localizar registro
    var registro = null;
    var registroIndex = -1;
    for (var i = 0; i < RPI_REGISTROS.length; i++) {
      if (RPI_REGISTROS[i].id === id) {
        registro = RPI_REGISTROS[i];
        registroIndex = i;
        break;
      }
    }

    if (!registro) {
      detailContainer.innerHTML = '<div class="rpi-empty-state">' +
        '<i class="fas fa-exclamation-circle" aria-hidden="true"></i>' +
        '<h2>Publicação não encontrada</h2>' +
        '<p>O registro "' + escapeHtml(id) + '" não foi localizado na base de dados do protótipo.</p>' +
        '<a href="index.html" class="rpi-btn-primary">Voltar ao início</a></div>';
      return;
    }

    // Atualizar <title>
    document.title = registro.numero + ' | Revista da Propriedade Industrial';

    // Atualizar meta description
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', registro.despacho + ' — ' + registro.numero + '. Publicado na RPI nº ' + registro.rpi + '.');
    }

    // Atualizar breadcrumb:
    // Início > Revista da Propriedade Industrial > RPI 2897 > Desenho Industrial > categoria > número
    var breadcrumbList = document.getElementById('rpi-breadcrumb-list');
    if (breadcrumbList) {
      breadcrumbList.innerHTML =
        '<li class="crumb home"><a class="br-button circle" href="https://www.gov.br/inpi"><span class="sr-only">Home</span><i class="fas fa-home"></i></a></li>' +
        '<li class="crumb"><i class="icon fas fa-chevron-right"></i><a href="index.html">Revista da Propriedade Industrial</a></li>' +
        '<li class="crumb"><i class="icon fas fa-chevron-right"></i><span>RPI ' + escapeHtml(registro.rpi) + '</span></li>' +
        '<li class="crumb"><i class="icon fas fa-chevron-right"></i><span>' + escapeHtml(registro.ativo) + '</span></li>' +
        '<li class="crumb"><i class="icon fas fa-chevron-right"></i><span>' + escapeHtml(registro.categoria) + '</span></li>' +
        '<li class="crumb" data-active="active"><i class="icon fas fa-chevron-right"></i><span>' + escapeHtml(registro.numero) + '</span></li>';
    }

    // Renderizar cabeçalho
    var headerEl = document.getElementById('rpi-detail-header');
    if (headerEl) {
      headerEl.innerHTML =
        '<h1>' + escapeHtml(registro.numero) + '</h1>' +
        '<p class="rpi-detail-despacho">' + escapeHtml(registro.despacho) + '</p>' +
        '<p class="rpi-detail-context">' +
          '<span>RPI nº ' + escapeHtml(registro.rpi) + ' — ' + formatDateLong(registro.dataPublicacao) + '</span><br>' +
          '<span>' + escapeHtml(registro.ativo) + ' — ' + escapeHtml(registro.secao) + '</span>' +
        '</p>';
    }

    // Renderizar metadados
    var metaPairs = [
      { label: 'Número do pedido', value: registro.numero },
      { label: 'Número secundário', value: registro.numeroSecundario },
      { label: 'RPI', value: 'nº ' + registro.rpi },
      { label: 'Data da publicação', value: registro.dataPublicacao },
      { label: 'Data de depósito', value: registro.dataDeposito || '—' },
      { label: 'Ativo', value: registro.ativo },
      { label: 'Seção', value: registro.secao },
      { label: 'Grupo', value: registro.grupo },
      { label: 'Categoria', value: registro.categoria },
      { label: 'Código de despacho', value: registro.codigoDespacho },
      { label: 'Titular', value: registro.titular },
      { label: 'Procurador', value: registro.procurador || '—' }
    ];

    if (registro.prazo) {
      metaPairs.push({ label: 'Prazo', value: registro.prazo });
    }
    if (registro.fundamentacao) {
      metaPairs.push({ label: 'Fundamentação', value: registro.fundamentacao });
    }

    var metaDl = document.getElementById('rpi-meta-dl');
    if (metaDl) {
      var dlHtml = '';
      metaPairs.forEach(function (pair) {
        dlHtml += '<div class="rpi-meta-pair"><dt>' + escapeHtml(pair.label) + '</dt><dd>' + escapeHtml(pair.value) + '</dd></div>';
      });
      metaDl.innerHTML = dlHtml;
    }

    // Conteúdo da publicação
    var pubText = document.getElementById('rpi-pub-text');
    if (pubText) {
      pubText.innerHTML = '<p>' + escapeHtml(registro.detalhes) + '</p>';
    }

    // Navegação anterior/próxima
    var prevLink = document.getElementById('rpi-nav-prev');
    var nextLink = document.getElementById('rpi-nav-next');

    if (prevLink) {
      if (registroIndex > 0) {
        var prev = RPI_REGISTROS[registroIndex - 1];
        prevLink.href = 'detalhe.html?id=' + encodeURIComponent(prev.id);
        prevLink.querySelector('.rpi-nav-number').textContent = prev.numero;
        prevLink.hidden = false;
      } else {
        prevLink.hidden = true;
      }
    }

    if (nextLink) {
      if (registroIndex < RPI_REGISTROS.length - 1) {
        var next = RPI_REGISTROS[registroIndex + 1];
        nextLink.href = 'detalhe.html?id=' + encodeURIComponent(next.id);
        nextLink.querySelector('.rpi-nav-number').textContent = next.numero;
        nextLink.hidden = false;
      } else {
        nextLink.hidden = true;
      }
    }

    // JSON-LD
    var jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': registro.despacho + ' — ' + registro.numero,
      'datePublished': registro.dataPublicacao.split('/').reverse().join('-'),
      'identifier': registro.numero,
      'publisher': {
        '@type': 'Organization',
        'name': 'Instituto Nacional da Propriedade Industrial'
      },
      'isPartOf': {
        '@type': 'PublicationIssue',
        'issueNumber': registro.rpi,
        'name': 'Revista da Propriedade Industrial nº ' + registro.rpi
      }
    };

    var scriptLd = document.createElement('script');
    scriptLd.type = 'application/ld+json';
    scriptLd.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(scriptLd);

    // Ações
    initDetailActions(registro);
  }

  /**
   * Inicializa ações da página de detalhe.
   */
  function initDetailActions(registro) {
    // Copiar link
    var copyBtn = document.getElementById('rpi-copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var url = window.location.href;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(function () {
            showFeedback('Link copiado para a área de transferência');
          }).catch(function () {
            showFeedback('Não foi possível copiar o link');
          });
        } else {
          var textarea = document.createElement('textarea');
          textarea.value = url;
          textarea.style.position = 'fixed';
          textarea.style.left = '-9999px';
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand('copy');
            showFeedback('Link copiado para a área de transferência');
          } catch (err) {
            showFeedback('Não foi possível copiar o link');
          }
          document.body.removeChild(textarea);
        }
      });
    }

    // Imprimir
    var printBtn = document.getElementById('rpi-print');
    if (printBtn) {
      printBtn.addEventListener('click', function () {
        window.print();
      });
    }

    // Voltar aos resultados — preserva filtros e ordenação
    var backBtn = document.getElementById('rpi-back-results');
    if (backBtn) {
      backBtn.addEventListener('click', function (e) {
        e.preventDefault();
        // Se veio da página de resultados, usa history.back() para preservar estado completo
        if (document.referrer && document.referrer.indexOf('resultados.html') > -1) {
          window.history.back();
        } else {
          // Acesso direto: monta URL com filtros baseados no registro
          window.location.href = 'resultados.html?ativo=' + encodeURIComponent(registro.ativo) +
            '&rpi=' + encodeURIComponent(registro.rpi) +
            '&categoria=' + encodeURIComponent(registro.categoria);
        }
      });
    }
  }

  /**
   * Mostra feedback visual + acessível.
   */
  function showFeedback(message) {
    var feedback = document.getElementById('rpi-action-feedback');
    var liveRegion = document.getElementById('rpi-action-live');

    if (feedback) {
      feedback.textContent = message;
      feedback.classList.add('rpi-visible');
      setTimeout(function () {
        feedback.classList.remove('rpi-visible');
      }, 3000);
    }

    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  // ─── Inicialização ────────────────────────────────────────

  document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('rpi-search-form')) {
      initIndexPage();
    }
    if (document.getElementById('rpi-results-container')) {
      initResultsPage();
    }
    if (document.getElementById('rpi-detail-container')) {
      initDetailPage();
    }
  });

})();
