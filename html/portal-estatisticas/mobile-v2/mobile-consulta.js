/* ============================================================
   UX Mobile Prototype — Nova UX Semântica
   Ativa apenas para body.mobile-consulta-prototype no mobile.
============================================================ */

const FIELD_LABELS = {
  'ano': 'Ano',
  'periodo': 'Mês',
  'tipoAtivo': 'Tipo de ativo',
  'origem': 'Origem do depositante',
  'pais': 'País',
  'uf': 'UF',
  'regiao': 'Região',
  'natureza': 'Natureza jurídica',
  'naturezaDetalhada': 'Natureza jurídica detalhada',
  'depositos': 'Número de Depósitos',
  'concessoes': 'Número de Concessões/Decisões'
};

const mobileConsultaState = {
  indicador: 'depositos',
  periodoInicial: 'Jan/20',
  periodoFinal: 'Dez/24',
  agrupamento: 'tipoAtivo',
  comparacao: '', // Vazio = não comparar
  ativos: [] // Vazio = todos
};

let mobileInitialized = false;

function initMobileUX() {
  // Apenas roda se for mobile e se a classe existir
  if (!document.body.classList.contains('mobile-consulta-prototype')) return;
  if (window.innerWidth > 768) return; // Desktop permanece INTACTO e INALTERADO
  if (mobileInitialized) return;
  
  mobileInitialized = true;

  // 1. Salvar os dados brutos para podermos filtrar manualmente
  if (!window.rawPivotData && window.pivotData) {
    window.rawPivotData = [...window.pivotData];
  }

  // 2. Injetar a estrutura HTML Semântica Mobile
  injetarInterfaceMobile();

  // 3. Renderizar os Chips de Ativos
  renderAssetChips();

  // 4. Preencher os selects de período
  popularSelectsPeriodo();

  // 5. Adicionar Listeners aos controles
  document.getElementById('selectIndicador').addEventListener('change', (e) => {
    mobileConsultaState.indicador = e.target.value;
    updateMobileConsulta();
  });

  document.getElementById('selectAgrupamento').addEventListener('change', (e) => {
    mobileConsultaState.agrupamento = e.target.value;
    sincronizarOpcoesSelects();
    updateMobileConsulta();
  });

  const selectComparacao = document.getElementById('selectComparacao');
  if (selectComparacao) {
    selectComparacao.addEventListener('change', (e) => {
      mobileConsultaState.comparacao = e.target.value;
      sincronizarOpcoesSelects();
      updateMobileConsulta();
    });
  }

  const periodStart = document.getElementById('mobilePeriodStart');
  const periodEnd = document.getElementById('mobilePeriodEnd');
  
  const handlePeriodChange = () => {
    mobileConsultaState.periodoInicial = periodStart.value;
    mobileConsultaState.periodoFinal = periodEnd.value;
    updateMobileConsulta();
  };
  
  if (periodStart) periodStart.addEventListener('change', handlePeriodChange);
  if (periodEnd) periodEnd.addEventListener('change', handlePeriodChange);

  // Inicializar o Chart.js
  initChart();
  sincronizarOpcoesSelects();

  // Primeira renderização mais robusta
  waitForPivotReady().then(() => {
    if (periodStart && periodStart.value) mobileConsultaState.periodoInicial = periodStart.value;
    if (periodEnd && periodEnd.value) mobileConsultaState.periodoFinal = periodEnd.value;
    updateMobileConsulta();
  });
}

document.addEventListener('DOMContentLoaded', initMobileUX);
window.addEventListener('resize', initMobileUX);

window.limparConsultaMobile = function() {
  mobileConsultaState.indicador = 'depositos';
  mobileConsultaState.agrupamento = 'tipoAtivo';
  mobileConsultaState.comparacao = '';
  mobileConsultaState.ativos = [];
  
  // Reset selects visually
  const selInd = document.getElementById('selectIndicador');
  const selAgrp = document.getElementById('selectAgrupamento');
  const selComp = document.getElementById('selectComparacao');
  
  if (selInd) selInd.value = 'depositos';
  if (selAgrp) selAgrp.value = 'tipoAtivo';
  if (selComp) selComp.value = '';
  
  sincronizarOpcoesSelects();
  
  if (window.pivotEngine && window.rawPivotData) {
    const periodos = window.pivotEngine.uniqueValues('periodo', window.rawPivotData);
    if (periodos.length > 0) {
      mobileConsultaState.periodoInicial = periodos[0];
      mobileConsultaState.periodoFinal = periodos[periodos.length - 1];
      
      const ps = document.getElementById('mobilePeriodStart');
      const pe = document.getElementById('mobilePeriodEnd');
      if (ps) ps.value = mobileConsultaState.periodoInicial;
      if (pe) pe.value = mobileConsultaState.periodoFinal;
    }
  }

  updateMobileConsulta();
};

function waitForPivotReady() {
  return new Promise(resolve => {
    const check = () => {
      if (window.pivotData && window.pivotEngine && window.appPivotState && window.appRenderAll) {
        if (!window.rawPivotData) {
          window.rawPivotData = [...window.pivotData];
        }
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

function sincronizarOpcoesSelects() {
  const agrp = document.getElementById('selectAgrupamento');
  const comp = document.getElementById('selectComparacao');
  if (!agrp || !comp) return;

  const agrpVal = agrp.value;
  const compVal = comp.value;

  Array.from(agrp.options).forEach(opt => {
    if (opt.value && opt.value === compVal) {
      opt.disabled = true;
    } else {
      opt.disabled = false;
    }
  });

  Array.from(comp.options).forEach(opt => {
    if (opt.value && opt.value === agrpVal) {
      opt.disabled = true;
    } else {
      opt.disabled = false;
    }
  });
}

function injetarInterfaceMobile() {
  const container = document.querySelector('.search-page-theme');
  const layoutBase = document.querySelector('.pe-pivot-layout');
  
  if (!container || !layoutBase) return;

  const html = `
    <div class="pe-mobile-guided-view" id="mobileGuidedView">
      <h2><i class="fas fa-magic" aria-hidden="true"></i> Monte sua consulta</h2>
      <p>Escolha um indicador, defina o período e selecione como deseja visualizar os dados.</p>
      
      <!-- Etapa 1: Indicador -->
      <div class="pe-step">
        <label class="pe-step-label" for="selectIndicador">1. O que você quer consultar?</label>
        <select id="selectIndicador" class="pe-guided-control">
          <option value="depositos">Número de Depósitos</option>
          <option value="concessoes">Número de Concessões/Decisões</option>
        </select>
      </div>

      <!-- Etapa 2: Período -->
      <div class="pe-step">
        <label class="pe-step-label">2. Qual período deseja analisar?</label>
        <div class="pe-period-grid-mobile">
          <div>
            <label for="mobilePeriodStart" style="font-size:0.8rem;">Inicial</label>
            <select id="mobilePeriodStart" class="pe-guided-control"></select>
          </div>
          <div>
            <label for="mobilePeriodEnd" style="font-size:0.8rem;">Final</label>
            <select id="mobilePeriodEnd" class="pe-guided-control"></select>
          </div>
        </div>
      </div>

      <!-- Etapa 3: Agrupamento -->
      <div class="pe-step">
        <label class="pe-step-label" for="selectAgrupamento">3. Como deseja visualizar os dados?</label>
        <select id="selectAgrupamento" class="pe-guided-control">
          <option value="">Sem agrupamento</option>
          <option value="ano">Por ano</option>
          <option value="periodo">Por mês</option>
          <option value="tipoAtivo" selected>Por tipo de ativo</option>
          <option value="origem">Por origem do depositante</option>
          <option value="pais">Por país</option>
          <option value="regiao">Por região</option>
          <option value="uf">Por UF</option>
          <option value="natureza">Por natureza jurídica</option>
          <option value="naturezaDetalhada">Por natureza jurídica detalhada</option>
        </select>
      </div>

      <!-- Etapa 4: Comparação -->
      <div class="pe-step">
        <label class="pe-step-label" for="selectComparacao">4. Deseja comparar por alguma categoria?</label>
        <select id="selectComparacao" class="pe-guided-control">
          <option value="">Não comparar</option>
          <option value="tipoAtivo">Tipo de ativo</option>
          <option value="origem">Origem do depositante</option>
          <option value="pais">País</option>
          <option value="regiao">Região</option>
          <option value="uf">UF</option>
          <option value="natureza">Natureza jurídica</option>
          <option value="naturezaDetalhada">Natureza jurídica detalhada</option>
        </select>
      </div>

      <!-- Etapa 5: Filtro de Ativos -->
      <div class="pe-step" id="mobileAssetFilterContainer">
        <label class="pe-step-label">5. Quais ativos deseja considerar?</label>
        <div class="pe-asset-chips" id="assetChipsContainer">
          <!-- Chips gerados pelo JS baseados em hierarquiaAtivos -->
        </div>
      </div>

      <!-- Chips de Filtros Ativos -->
      <div class="pe-step" id="mobileActiveFiltersContainer" style="display: none;">
        <label class="pe-step-label"><i class="fas fa-filter" aria-hidden="true"></i> Filtros ativos</label>
        <div class="pe-filter-chips" id="activeFiltersChips"></div>
      </div>

      <!-- Resultado da Consulta -->
      <div class="pe-step" id="mobileResultSection">
        <label class="pe-step-label" style="padding-top:1rem; border-top: 2px solid #1351b4;">
          <i class="fas fa-poll" aria-hidden="true"></i> Resultado da consulta
        </label>
        
        <div id="mobileContextSummary" class="pe-context-summary">
          Exibindo dados...
        </div>

        <div class="pe-summary-card" id="mobileSummaryCard">
          <div class="title" id="mobileSummaryTotalLabel">Total de Registros</div>
          <div class="value" id="mobileSummaryTotal">0</div>
        </div>
        
        <div class="pe-guided-chart-wrapper" id="mobileChartContainer">
          <canvas id="mobileChartCanvas"></canvas>
        </div>

        <!-- Ações -->
        <div class="pe-mobile-actions">
          <button type="button" class="pe-btn pe-btn--primary" onclick="window.exportarCSV()">
            <i class="fas fa-download"></i> Baixar dados
          </button>
          <button type="button" class="pe-btn" onclick="limparConsultaMobile()">
            <i class="fas fa-eraser"></i> Limpar consulta
          </button>
        </div>

        <!-- Versão Desktop Responsiva -->
        <a href="../portal-estatisticas-home-mobile-ux.html" class="pe-advanced-config-toggle" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #1351b4; margin-top: 1rem;">
          <i class="fas fa-desktop" aria-hidden="true"></i> Acessar versão desktop completa
        </a>
      </div>
    </div>
  `;

  // Inserir antes da Pivot Table Base. A Pivot Table Base será usada Apenas para exibir a tabela no CSS.
  layoutBase.insertAdjacentHTML('beforebegin', html);

  // Reordenar: colocar a tabela ANTES do gráfico
  const chartContainer = document.getElementById('mobileChartContainer');
  if (chartContainer) {
    chartContainer.insertAdjacentElement('beforebegin', layoutBase);
  }
}

function popularSelectsPeriodo() {
  const startSel = document.getElementById('mobilePeriodStart');
  const endSel = document.getElementById('mobilePeriodEnd');
  if (!startSel || !endSel) return;
  
  const periodos = window.pivotEngine ? window.pivotEngine.uniqueValues('periodo', window.rawPivotData) : ['Jan/20', 'Dez/24'];
  const opts = periodos.map(p => `<option value="${p}">${p}</option>`).join('');
  
  startSel.innerHTML = opts; 
  endSel.innerHTML = opts;
  
  startSel.value = periodos[0]; 
  endSel.value = periodos[periodos.length-1];
}

function renderAssetChips() {
  const container = document.getElementById('assetChipsContainer');
  if (!container) return;
  
  const tiposUnicos = window.pivotEngine ? window.pivotEngine.uniqueValues('tipoAtivo', window.rawPivotData) : ['Marcas', 'Patentes', 'Desenho Industrial', 'Programa de Computador', 'Contratos de Transf. Tecnologia', 'Indicação Geográfica'];
  
  let html = `<button type="button" class="pe-asset-chip selected" aria-pressed="true" data-ativo="TODOS">Todos</button>`;
  html += tiposUnicos.map(tipo => 
    `<button type="button" class="pe-asset-chip" aria-pressed="false" data-ativo="${tipo}">${tipo}</button>`
  ).join('');
  
  container.innerHTML = html;

  container.addEventListener('click', (e) => {
    if (e.target.classList.contains('pe-asset-chip')) {
      const ativo = e.target.dataset.ativo;
      
      if (ativo === 'TODOS') {
        mobileConsultaState.ativos = [];
      } else {
        const idx = mobileConsultaState.ativos.indexOf(ativo);
        if (idx > -1) {
          mobileConsultaState.ativos.splice(idx, 1);
        } else {
          mobileConsultaState.ativos.push(ativo);
        }
      }
      updateMobileConsulta();
    }
  });
}

function getPeriodoNum(str) {
  const m = {Jan:1,Fev:2,Mar:3,Abr:4,Mai:5,Jun:6,Jul:7,Ago:8,Set:9,Out:10,Nov:11,Dez:12};
  const parts = (str||'').split('/');
  if(parts.length !== 2) return 0;
  return Number(parts[1]) * 100 + m[parts[0]];
}

function updateMobileConsulta() {
  if (window.innerWidth > 768) return;

  // 1. Sincronizar visual dos chips de ativos
  const isTodos = mobileConsultaState.ativos.length === 0;
  document.querySelectorAll('.pe-asset-chip').forEach(chip => {
    const ativo = chip.dataset.ativo;
    if (ativo === 'TODOS') {
      if (isTodos) {
        chip.classList.add('selected');
        chip.setAttribute('aria-pressed', 'true');
      } else {
        chip.classList.remove('selected');
        chip.setAttribute('aria-pressed', 'false');
      }
    } else {
      if (mobileConsultaState.ativos.includes(ativo)) {
        chip.classList.add('selected');
        chip.setAttribute('aria-pressed', 'true');
      } else {
        chip.classList.remove('selected');
        chip.setAttribute('aria-pressed', 'false');
      }
    }
  });

  // 2. Filtrar os dados brutos no estado atual
  const pStartNum = getPeriodoNum(mobileConsultaState.periodoInicial);
  const pEndNum = getPeriodoNum(mobileConsultaState.periodoFinal);

  const filteredData = (window.rawPivotData || []).filter(row => {
    const pNum = getPeriodoNum(row.periodo);
    if (pNum < pStartNum || pNum > pEndNum) return false;
    if (!isTodos) {
      if (!mobileConsultaState.ativos.includes(row.tipoAtivo)) return false;
    }
    return true;
  });

  // 3. Calcular os Totais e atualizar os Cards
  let total = 0;
  filteredData.forEach(row => {
    total += Number(row[mobileConsultaState.indicador] || 0);
  });
  
  const lbl = FIELD_LABELS[mobileConsultaState.indicador] || 'Total';
  document.getElementById('mobileSummaryTotalLabel').textContent = lbl;
  document.getElementById('mobileSummaryTotal').textContent = total.toLocaleString('pt-BR');

  // 4. Atualizar o Resumo Textual
  const agrupStr = mobileConsultaState.agrupamento ? `agrupado ${FIELD_LABELS[mobileConsultaState.agrupamento] ? 'por ' + FIELD_LABELS[mobileConsultaState.agrupamento].toLowerCase() : ''}` : 'sem agrupamento';
  const compStr = mobileConsultaState.comparacao ? `, comparando por ${FIELD_LABELS[mobileConsultaState.comparacao] ? FIELD_LABELS[mobileConsultaState.comparacao].toLowerCase() : ''}` : '';
  const ativosStr = isTodos ? 'todos os ativos' : mobileConsultaState.ativos.join(', ');
  
  const resumoHtml = `Exibindo <strong>${lbl.toLowerCase()}</strong> ${agrupStr}${compStr}, considerando <strong>${ativosStr}</strong>, no período de <strong>${mobileConsultaState.periodoInicial} a ${mobileConsultaState.periodoFinal}</strong>.`;
  document.getElementById('mobileContextSummary').innerHTML = resumoHtml;

  // 5. Atualizar os Chips de Filtros Ativos
  renderActiveFiltersChips();

  // 6. INJETAR dados filtrados no motor original da tabela
  // Modificando o array in-place para que pivot-ui.js (que guardou a referência) enxergue os dados filtrados!
  if (window.appPivotState && window.appRenderAll && window.pivotData) {
    window.pivotData.length = 0;
    window.pivotData.push(...filteredData);
    
    window.appPivotState.values = [ mobileConsultaState.indicador ];
    
    if (mobileConsultaState.comparacao) {
      window.appPivotState.columns = [ mobileConsultaState.comparacao ];
    } else {
      window.appPivotState.columns = [];
    }
    
    window.appPivotState.filters = [];
    window.appPivotState.slicers = [];
    
    if (mobileConsultaState.agrupamento) {
      window.appPivotState.rows = [ mobileConsultaState.agrupamento ];
    } else {
      window.appPivotState.rows = [];
    }
    window.appRenderAll();
  }

  // 7. Atualizar o Gráfico
  updateChart(filteredData);
}

function renderActiveFiltersChips() {
  const container = document.getElementById('mobileActiveFiltersContainer');
  const chipsDiv = document.getElementById('activeFiltersChips');
  
  let hasFilters = false;
  let html = '';

  // Period
  if (mobileConsultaState.periodoInicial && mobileConsultaState.periodoFinal) {
    hasFilters = true;
    html += `
      <div class="pe-filter-chip">
        <i class="fas fa-calendar-alt" aria-hidden="true"></i>
        Período: ${mobileConsultaState.periodoInicial} - ${mobileConsultaState.periodoFinal}
      </div>
    `;
  }

  // Comparison
  if (mobileConsultaState.comparacao) {
    hasFilters = true;
    const lbl = FIELD_LABELS[mobileConsultaState.comparacao] || mobileConsultaState.comparacao;
    html += `
      <div class="pe-filter-chip">
        <i class="fas fa-columns" aria-hidden="true"></i>
        Comparar: ${lbl}
        <button type="button" aria-label="Remover comparação" data-tipo="comparacao">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
  
  if (mobileConsultaState.ativos.length > 0) {
    hasFilters = true;
    html += mobileConsultaState.ativos.map(ativo => `
      <div class="pe-filter-chip">
        Ativo: ${ativo}
        <button type="button" aria-label="Remover filtro ${ativo}" data-ativo="${ativo}">
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>
      </div>
    `).join('');
  }
  
  if (!hasFilters) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  chipsDiv.innerHTML = html;

  chipsDiv.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const el = e.currentTarget;
      if (el.dataset.tipo === 'comparacao') {
        mobileConsultaState.comparacao = '';
        const selComp = document.getElementById('selectComparacao');
        if (selComp) selComp.value = '';
        sincronizarOpcoesSelects();
        updateMobileConsulta();
      } else if (el.dataset.ativo) {
        const ativo = el.dataset.ativo;
        const idx = mobileConsultaState.ativos.indexOf(ativo);
        if (idx > -1) {
          mobileConsultaState.ativos.splice(idx, 1);
          updateMobileConsulta();
        }
      }
    });
  });
}

// Chart.js integration
let mobileChartInstance = null;

function initChart() {
  const canvas = document.getElementById('mobileChartCanvas');
  if (!canvas || !window.Chart) return;
  
  mobileChartInstance = new window.Chart(canvas, {
    type: 'bar',
    data: { labels: [], datasets: [] },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false, position: 'bottom' }
      },
      scales: {
        x: { stacked: false },
        y: { beginAtZero: true, stacked: false }
      }
    }
  });
}

function updateChart(filteredData) {
  if (!mobileChartInstance) return;

  const agrp = mobileConsultaState.agrupamento || 'tipoAtivo';
  const comp = mobileConsultaState.comparacao;
  const xAxisField = mobileConsultaState.agrupamento || (mobileConsultaState.comparacao || 'tipoAtivo');

  if (!comp || comp === agrp) {
    // Série Simples
    const groupedData = {};
    filteredData.forEach(row => {
      const key = row[xAxisField] || 'Total';
      if (!groupedData[key]) groupedData[key] = 0;
      groupedData[key] += Number(row[mobileConsultaState.indicador] || 0);
    });

    const sortedKeys = Object.keys(groupedData).sort((a, b) => {
      if (xAxisField === 'ano' || xAxisField === 'periodo') return a.localeCompare(b);
      return groupedData[b] - groupedData[a];
    });

    mobileChartInstance.data.labels = sortedKeys;
    mobileChartInstance.data.datasets = [{
      label: FIELD_LABELS[mobileConsultaState.indicador] || 'Valor',
      data: sortedKeys.map(k => groupedData[k]),
      backgroundColor: '#1351b4'
    }];
    mobileChartInstance.options.plugins.legend.display = false;
  } else {
    // Múltiplas Séries
    const groupedData = {}; 
    const compCategories = new Set();

    filteredData.forEach(row => {
      const xKey = row[xAxisField] || 'Total';
      const cKey = row[comp] || 'N/A';
      compCategories.add(cKey);
      
      if (!groupedData[xKey]) groupedData[xKey] = {};
      if (!groupedData[xKey][cKey]) groupedData[xKey][cKey] = 0;
      groupedData[xKey][cKey] += Number(row[mobileConsultaState.indicador] || 0);
    });

    const sortedXKeys = Object.keys(groupedData).sort((a, b) => {
      if (xAxisField === 'ano' || xAxisField === 'periodo') return a.localeCompare(b);
      return a.localeCompare(b); // sort strings if not ano/periodo? well, let's just sort keys.
    });

    const sortedCompKeys = Array.from(compCategories).sort();
    const colors = ['#1351b4', '#d32f2f', '#2e7d32', '#f57c00', '#6a1b9a', '#0277bd', '#c2185b', '#00695c'];

    mobileChartInstance.data.labels = sortedXKeys;
    mobileChartInstance.data.datasets = sortedCompKeys.map((cKey, i) => {
      return {
        label: cKey,
        data: sortedXKeys.map(xKey => groupedData[xKey][cKey] || 0),
        backgroundColor: colors[i % colors.length]
      };
    });
    mobileChartInstance.options.plugins.legend.display = true;
  }
  
  mobileChartInstance.update();
}
