/* ============================================================
   TABELA DINÂMICA — Interface e Interação (Fase 6)
============================================================ */

(function() {
  const { 
    fmt, displayValue, uniqueValues, getFilteredData, buildPivotBase, 
    buildHierarchicalRows, isHiddenByCollapse, aggregateForNode, aggregateGrandTotal 
  } = window.pivotEngine;

  const fieldDefs = window.fieldDefs;
  const dados = window.pivotData;

  /* ---- Estado inicial ---- */
  const defaultState = {
    filters: [],
    slicers: ['tipoAtivo'],
    rows: ['tipoAtivo', 'segmento1'],
    columns: ['ano'],
    values: ['depositos']
  };

  let pivotState = JSON.parse(JSON.stringify(defaultState));
  let filterSelections = {};
  let slicerSelections = {};
  let collapsedNodes = new Set();
  let periodRange = { start: 'Jan/20', end: 'Dez/24' };

  /* ---- Período ---- */
  function renderPeriodRangeFilter() {
    const startSel = document.getElementById('periodStart');
    const endSel = document.getElementById('periodEnd');
    const periodos = uniqueValues('periodo');
    const opts = periodos.map(p => `<option value="${p}">${p}</option>`).join('');
    startSel.innerHTML = opts; endSel.innerHTML = opts;
    if (!periodos.includes(periodRange.start)) periodRange.start = periodos[0];
    if (!periodos.includes(periodRange.end)) periodRange.end = periodos[periodos.length-1];
    startSel.value = periodRange.start; endSel.value = periodRange.end;
  }

  window.aplicarPeriodoCompleto = function() {
    const p = uniqueValues('periodo');
    periodRange.start = p[0]; periodRange.end = p[p.length-1];
    slicerSelections['periodo'] = new Set(['__ALL__']);
    renderAll();
  };

  /* ---- Sidebar: lista de campos ---- */
  function renderFieldsList() {
    const list = document.getElementById('fieldsList');
    const q = document.getElementById('fieldSearch').value.toLowerCase().trim();
    list.innerHTML = '';
    Object.entries(fieldDefs).forEach(([key, def]) => {
      if (q && !def.label.toLowerCase().includes(q)) return;
      const div = document.createElement('div');
      div.className = 'pe-field-item';
      div.draggable = true;
      div.dataset.field = key;
      div.setAttribute('role', 'option');
      div.setAttribute('tabindex', '0');
      div.innerHTML = `<span>${def.label}</span>
        <span class="pe-field-type ${def.type==='measure'?'pe-field-type--measure':'pe-field-type--dim'}">${def.type==='measure'?'medida':'dimensão'}</span>`;
      div.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', key); });
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter') { showFieldMenu(key, div); }
      });
      div.addEventListener('dblclick', () => { showFieldMenu(key, div); });
      list.appendChild(div);
    });
  }

  /* ---- Alternativa por clique ---- */
  function showFieldMenu(field, anchor) {
    const def = fieldDefs[field];
    const zones = def.type === 'measure' ? ['values'] : ['filters','slicers','rows','columns'];
    const labels = { filters:'Filtros', slicers:'Segmentações', rows:'Linhas', columns:'Colunas', values:'Valores' };

    const old = document.getElementById('pe-field-menu');
    if (old) old.remove();

    const menu = document.createElement('div');
    menu.id = 'pe-field-menu';
    menu.style.cssText = 'position:fixed;z-index:9999;background:#fff;border:1px solid #dee2e6;border-radius:6px;box-shadow:0 4px 16px rgba(0,0,0,0.15);padding:4px 0;min-width:160px;';
    const rect = anchor.getBoundingClientRect();
    menu.style.top = (rect.bottom + 4) + 'px';
    menu.style.left = rect.left + 'px';

    zones.forEach(zone => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.style.cssText = 'display:block;width:100%;text-align:left;border:0;background:transparent;padding:8px 14px;font-size:0.8rem;cursor:pointer;font-family:inherit;';
      btn.textContent = `Adicionar a ${labels[zone]}`;
      btn.addEventListener('mouseenter', () => { btn.style.background='#dbe8fb'; });
      btn.addEventListener('mouseleave', () => { btn.style.background='transparent'; });
      btn.addEventListener('click', () => { addFieldToZone(field, zone); menu.remove(); });
      menu.appendChild(btn);
    });

    document.body.appendChild(menu);
    setTimeout(() => {
      const close = (e) => { if (!menu.contains(e.target)) { menu.remove(); document.removeEventListener('click', close); } };
      document.addEventListener('click', close);
    }, 10);
  }

  /* ---- Movimentação nas zonas ---- */
  window.moveField = function(zone, field, direction) {
    const arr = pivotState[zone];
    const idx = arr.indexOf(field);
    const newIdx = idx + direction;
    if (idx < 0 || newIdx < 0 || newIdx >= arr.length) return;
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    collapsedNodes.clear();
    renderAll();
  };

  /* ---- Renderizar zonas ---- */
  function renderZones() {
    ['filters','slicers','rows','columns','values'].forEach(zone => {
      const box = document.getElementById(`zone-${zone}`);
      box.innerHTML = '';
      pivotState[zone].forEach(field => {
        const item = document.createElement('span');
        item.className = 'pe-zone-chip';
        item.draggable = true;
        item.dataset.field = field;
        item.innerHTML = `${fieldDefs[field].label}
          <button class="pe-chip-move" title="Mover para cima" onclick="moveField('${zone}','${field}',-1)">↑</button>
          <button class="pe-chip-move" title="Mover para baixo" onclick="moveField('${zone}','${field}',1)">↓</button>
          <button class="pe-chip-remove" title="Remover">×</button>`;
        item.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', field); });
        item.querySelector('.pe-chip-remove').addEventListener('click', () => {
          pivotState[zone] = pivotState[zone].filter(f => f !== field);
          if (zone === 'filters') delete filterSelections[field];
          if (zone === 'slicers') delete slicerSelections[field];
          collapsedNodes.clear(); renderAll();
        });
        box.appendChild(item);
      });
    });
  }

  /* ---- Drag-and-drop zones ---- */
  function setupDropZones() {
    document.querySelectorAll('.pe-drop-zone').forEach(el => {
      el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('over'); });
      el.addEventListener('dragleave', () => { el.classList.remove('over'); });
      el.addEventListener('drop', e => {
        e.preventDefault(); el.classList.remove('over');
        addFieldToZone(e.dataTransfer.getData('text/plain'), el.dataset.zone);
      });
    });
  }

  function addFieldToZone(field, zone) {
    const type = fieldDefs[field].type;
    if (zone === 'values' && type !== 'measure') { alert('Na área Valores, use apenas medidas.'); return; }
    if (zone !== 'values' && type === 'measure') { alert('Medidas devem ir para Valores.'); return; }
    Object.keys(pivotState).forEach(z => { pivotState[z] = pivotState[z].filter(f => f !== field); });
    pivotState[zone].push(field);
    if (!pivotState.values.length) pivotState.values.push('depositos');
    collapsedNodes.clear(); renderAll();
  }

  /* ---- Filtros ativos ---- */
  function renderActiveFilters() {
    const panel = document.getElementById('filtersPanel');
    const grid = document.getElementById('activeFilters');
    grid.innerHTML = '';
    if (!pivotState.filters.length) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    pivotState.filters.forEach(field => {
      if (!filterSelections[field]) filterSelections[field] = '__ALL__';
      const box = document.createElement('div');
      box.className = 'pe-filter-box';
      const values = uniqueValues(field);
      box.innerHTML = `<label>${fieldDefs[field].label}</label>
        <select data-filter="${field}">
          <option value="__ALL__">Todos</option>
          ${values.map(v => `<option value="${String(v).replaceAll('"','&quot;')}">${displayValue(v)}</option>`).join('')}
        </select>`;
      const sel = box.querySelector('select');
      sel.value = filterSelections[field];
      sel.addEventListener('change', e => { filterSelections[field] = e.target.value; collapsedNodes.clear(); renderTable(); });
      grid.appendChild(box);
    });
  }

  /* ---- Segmentações ativas ---- */
  function renderActiveSlicers() {
    const panel = document.getElementById('slicersPanel');
    const grid = document.getElementById('activeSlicers');
    grid.innerHTML = '';
    if (!pivotState.slicers.length) { panel.style.display = 'none'; return; }
    panel.style.display = 'block';
    pivotState.slicers.forEach(field => {
      if (!slicerSelections[field]) slicerSelections[field] = new Set(['__ALL__']);
      const box = document.createElement('div');
      box.className = 'pe-filter-box';
      const values = uniqueValues(field);
      const label = document.createElement('label');
      label.textContent = fieldDefs[field].label;
      box.appendChild(label);
      const opts = document.createElement('div');
      opts.className = 'pe-slicer-options';

      const allBtn = document.createElement('button');
      allBtn.type = 'button';
      allBtn.className = slicerSelections[field].has('__ALL__') ? 'pe-slicer-chip active' : 'pe-slicer-chip';
      allBtn.textContent = 'Todos';
      allBtn.addEventListener('click', () => { slicerSelections[field] = new Set(['__ALL__']); collapsedNodes.clear(); renderAll(); });
      opts.appendChild(allBtn);

      values.forEach(value => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = slicerSelections[field].has(String(value)) ? 'pe-slicer-chip active' : 'pe-slicer-chip';
        btn.textContent = displayValue(value);
        btn.addEventListener('click', () => {
          if (slicerSelections[field].has('__ALL__')) slicerSelections[field] = new Set();
          if (slicerSelections[field].has(String(value))) slicerSelections[field].delete(String(value));
          else slicerSelections[field].add(String(value));
          if (!slicerSelections[field].size) slicerSelections[field] = new Set(['__ALL__']);
          collapsedNodes.clear(); renderAll();
        });
        opts.appendChild(btn);
      });
      box.appendChild(opts);
      grid.appendChild(box);
    });
  }

  /* ---- Tabela Renderização ---- */
  window.toggleNode = function(key) { if (collapsedNodes.has(key)) collapsedNodes.delete(key); else collapsedNodes.add(key); renderTable(); };
  window.expandAll = function() { collapsedNodes.clear(); renderTable(); };
  window.collapseAll = function() {
    collapsedNodes.clear();
    const aggType = document.getElementById('aggregation').value;
    const fData = getFilteredData(dados, pivotState, filterSelections, slicerSelections, periodRange);
    const { rowLeafMap } = buildPivotBase(fData, pivotState, aggType);
    buildHierarchicalRows(rowLeafMap, pivotState.rows).filter(n => n.hasChildren).forEach(n => collapsedNodes.add(n.key));
    renderTable();
  };

  function renderTable() {
    const aggType = document.getElementById('aggregation').value;
    const fData = getFilteredData(dados, pivotState, filterSelections, slicerSelections, periodRange);
    const { rowLeafMap, colKeys, colMap, matrix, valueFields } = buildPivotBase(fData, pivotState, aggType);
    const rows = buildHierarchicalRows(rowLeafMap, pivotState.rows);
    const visibleRows = rows.filter(r => !isHiddenByCollapse(r, collapsedNodes) && !(r.label==='Sem segmentação' && r.isLeaf));
    
    const showSub = document.getElementById('showSubtotals').checked;
    const showGT = document.getElementById('showGrandTotal').checked;
    const thead = document.querySelector('#pivotTable thead');
    const tbody = document.querySelector('#pivotTable tbody');
    thead.innerHTML = ''; tbody.innerHTML = '';

    document.getElementById('pageInfo').innerHTML = `<i class="fas fa-table" aria-hidden="true"></i> ${visibleRows.length} linhas visíveis`;

    document.getElementById('indicator').innerHTML =
      `<strong>${pivotState.rows.map(f=>fieldDefs[f].label).join(' → ')||'Total'}</strong> nas linhas · ` +
      `<strong>${pivotState.columns.map(f=>fieldDefs[f].label).join(' → ')||'Total'}</strong> nas colunas · ` +
      `Valores: <strong>${valueFields.map(f=>fieldDefs[f].label).join(', ')}</strong> · ` +
      `Período: <strong>${periodRange.start} a ${periodRange.end}</strong>`;

    if (!visibleRows.length && !showGT) {
      tbody.innerHTML = '<tr><td colspan="99" class="pe-empty-state"><i class="fas fa-inbox"></i>Nenhum dado encontrado para os filtros selecionados.</td></tr>';
      return;
    }

    const trh = document.createElement('tr');
    trh.innerHTML = `<th class="rowno"></th>
      <th>${pivotState.rows.map(f=>fieldDefs[f].label).join(' → ')||'Total'} <span class="pe-sort">⇅</span></th>
      ${colKeys.map(c => {
        const label = colMap.get(c).map(displayValue).filter(v=>v!=='').join(' / ');
        if (valueFields.length === 1) return `<th class="num">${label}</th>`;
        return valueFields.map(v => `<th class="num">${label} · ${fieldDefs[v].label}</th>`).join('');
      }).join('')}`;
    thead.appendChild(trh);

    visibleRows.slice(0, 700).forEach((row, i) => {
      const tr = document.createElement('tr');
      if (!row.isLeaf && showSub) tr.classList.add('pe-subtotal');
      const toggleHtml = row.hasChildren
        ? `<button class="pe-toggle" onclick="toggleNode('${row.key.replaceAll("'","\\'")}')" aria-label="${collapsedNodes.has(row.key)?'Expandir':'Recolher'} ${displayValue(row.label)}">${collapsedNodes.has(row.key)?'+':'−'}</button>`
        : '<span class="pe-placeholder-toggle"></span>';
      const vals = colKeys.map(c => valueFields.map(v => {
        const value = aggregateForNode(row, c, v, rowLeafMap, matrix);
        return `<td class="num">${value ? fmt(value) : ''}</td>`;
      }).join('')).join('');
      tr.innerHTML = `<td class="rowno">${i+1}</td>
        <td class="pe-level-${Math.min(row.level,5)} pe-indent-${Math.min(row.level-1,4)}">${toggleHtml}${displayValue(row.label)}</td>${vals}`;
      tbody.appendChild(tr);
    });

    if (showGT) {
      const tr = document.createElement('tr');
      tr.className = 'pe-grand-total';
      const vals = colKeys.map(c => valueFields.map(v => {
        const value = aggregateGrandTotal(c, v, rowLeafMap, matrix);
        return `<td class="num">${value ? fmt(value) : ''}</td>`;
      }).join('')).join('');
      tr.innerHTML = `<td class="rowno"></td><td><strong>Total Geral</strong></td>${vals}`;
      tbody.appendChild(tr);
    }
  }

  /* ---- Reset & Export ---- */
  window.resetPivot = function() {
    pivotState = JSON.parse(JSON.stringify(defaultState));
    filterSelections = {}; slicerSelections = {};
    periodRange = { start: 'Jan/20', end: 'Dez/24' };
    collapsedNodes.clear(); renderAll();
  };

  window.exportarCSV = function() {
    const rows = [...document.querySelectorAll('#pivotTable tr')];
    const csv = rows.map(row =>
      [...row.children].map(cell => `"${cell.textContent.trim().replaceAll('"','""')}"`).join(';')
    ).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const d = new Date().toISOString().slice(0,10);
    a.href = url; a.download = `tabela_dinamica_pi_${d}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  /* ---- Inicialização ---- */
  function renderAll() {
    renderFieldsList(); renderZones(); renderPeriodRangeFilter();
    renderActiveFilters(); renderActiveSlicers(); renderTable();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('fieldSearch').addEventListener('input', renderFieldsList);
    document.getElementById('aggregation').addEventListener('change', renderTable);
    document.getElementById('showSubtotals').addEventListener('change', renderTable);
    document.getElementById('showGrandTotal').addEventListener('change', renderTable);
    document.getElementById('periodStart').addEventListener('change', e => { periodRange.start = e.target.value; collapsedNodes.clear(); renderTable(); });
    document.getElementById('periodEnd').addEventListener('change', e => { periodRange.end = e.target.value; collapsedNodes.clear(); renderTable(); });

    setupDropZones();
    renderAll();
  });

})();
