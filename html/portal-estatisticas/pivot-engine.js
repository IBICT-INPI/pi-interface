/* ============================================================
   TABELA DINÂMICA — Lógica da Pivot Table (Motor)
============================================================ */

/* ---- Utilitários de comparação e formatação ---- */
function fmt(n) { return Number(n||0).toLocaleString('pt-BR'); }
function displayValue(v) { return String(v) === 'Sem segmentação' ? '' : v; }

function periodoSortValue(v) {
  const ord = {Jan:1,Fev:2,Mar:3,Abr:4,Mai:5,Jun:6,Jul:7,Ago:8,Set:9,Out:10,Nov:11,Dez:12};
  const p = String(v).split('/');
  if (p.length !== 2) return 999999;
  return Number('20'+p[1]) * 100 + (ord[p[0]]||99);
}

function compareFieldValues(field, a, b) {
  if (field === 'periodo') return periodoSortValue(a) - periodoSortValue(b);
  if (field === 'ano' || field === 'mes') return Number(a) - Number(b);
  return String(a).localeCompare(String(b), 'pt-BR');
}

function compareKeyArrays(fields, arrA, arrB) {
  for (let i = 0; i < Math.max(arrA.length, arrB.length); i++) {
    const cmp = compareFieldValues(fields[i], arrA[i]??'', arrB[i]??'');
    if (cmp !== 0) return cmp;
  }
  return 0;
}

function uniqueValues(field, source = window.pivotData) {
  const values = [...new Set(source.map(d => d[field]))]
    .filter(v => v !== undefined && v !== null && v !== '' && v !== 'Sem segmentação');
  if (field === 'periodo') return values.sort((a,b) => periodoSortValue(a)-periodoSortValue(b));
  if (field === 'ano' || field === 'mes') return values.sort((a,b) => Number(a)-Number(b));
  return values.sort((a,b) => String(a).localeCompare(String(b),'pt-BR'));
}

function periodoDentroDoIntervalo(per, periodRange) {
  const ini = periodoSortValue(periodRange.start), fim = periodoSortValue(periodRange.end);
  const atual = periodoSortValue(per);
  return atual >= Math.min(ini,fim) && atual <= Math.max(ini,fim);
}

/* ---- Filtragem ---- */
function getFilteredData(dados, pivotState, filterSelections, slicerSelections, periodRange) {
  return dados.filter(d => {
    if (!periodoDentroDoIntervalo(d.periodo, periodRange)) return false;
    for (const field of pivotState.filters) {
      const sel = filterSelections[field];
      if (sel && sel !== '__ALL__' && String(d[field]) !== sel) return false;
    }
    for (const field of pivotState.slicers) {
      const set = slicerSelections[field];
      if (set && !set.has('__ALL__') && !set.has(String(d[field]))) return false;
    }
    return true;
  });
}

/* ---- Agregação Base ---- */
function keyFor(d, fields) { return fields.length ? fields.map(f => String(d[f] ?? 'Não informado')) : ['Total']; }

function buildPivotBase(filteredData, pivotState, aggType) {
  const rowFields = pivotState.rows;
  const colFields = pivotState.columns;
  const valueFields = pivotState.values.length ? pivotState.values : ['depositos'];
  const rowLeafMap = new Map(), colMap = new Map(), matrix = new Map();

  filteredData.forEach(d => {
    const rArr = keyFor(d, rowFields), cArr = keyFor(d, colFields);
    const rKey = rArr.join('|||'), cKey = cArr.join('|||');
    if (!rowLeafMap.has(rKey)) rowLeafMap.set(rKey, rArr);
    if (!colMap.has(cKey)) colMap.set(cKey, cArr);
    valueFields.forEach(vf => {
      const k = `${rKey}###${cKey}###${vf}`;
      matrix.set(k, (matrix.get(k)||0) + (aggType === 'count' ? 1 : Number(d[vf]||0)));
    });
  });

  const colKeys = [...colMap.keys()].sort((a,b) => compareKeyArrays(colFields, colMap.get(a), colMap.get(b)));
  return { rowLeafMap, colKeys, colMap, matrix, valueFields };
}

/* ---- Hierarquia (nós de subtotal) ---- */
function buildHierarchicalRows(rowLeafMap, rowFields) {
  const nodes = new Map();
  rowLeafMap.forEach((arr) => {
    for (let lv = 1; lv <= arr.length; lv++) {
      const path = arr.slice(0, lv), key = path.join('|||');
      if (!nodes.has(key)) nodes.set(key, { key, path, level: lv, label: path[path.length-1], isLeaf: lv===arr.length, hasChildren: lv < arr.length });
      if (lv < arr.length) nodes.get(key).hasChildren = true;
    }
  });
  return [...nodes.values()].sort((a,b) => compareKeyArrays(rowFields.slice(0,a.path.length), a.path, b.path));
}

function isHiddenByCollapse(node, collapsedNodes) {
  for (let i = 1; i < node.path.length; i++) {
    if (collapsedNodes.has(node.path.slice(0,i).join('|||'))) return true;
  }
  return false;
}

function matchesNodePath(leafArr, nodePath) {
  if (nodePath.length > leafArr.length) return false;
  for (let i = 0; i < nodePath.length; i++) { if (leafArr[i] !== nodePath[i]) return false; }
  return true;
}

function aggregateForNode(node, colKey, vf, rowLeafMap, matrix) {
  let total = 0;
  rowLeafMap.forEach((leafArr, leafKey) => {
    if (!matchesNodePath(leafArr, node.path)) return;
    total += matrix.get(`${leafKey}###${colKey}###${vf}`) || 0;
  });
  return total;
}

function aggregateGrandTotal(colKey, vf, rowLeafMap, matrix) {
  let total = 0;
  rowLeafMap.forEach((_, leafKey) => { total += matrix.get(`${leafKey}###${colKey}###${vf}`) || 0; });
  return total;
}

// Export para global
window.pivotEngine = {
  fmt, displayValue, uniqueValues, getFilteredData, buildPivotBase, 
  buildHierarchicalRows, isHiddenByCollapse, aggregateForNode, aggregateGrandTotal
};
