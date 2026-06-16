/* ============================================================
   TABELA DINÂMICA — Dados e Definições (Fase 3)
============================================================ */

/* ---- Constantes ---- */
const mesesNome = {1:'Jan',2:'Fev',3:'Mar',4:'Abr',5:'Mai',6:'Jun',7:'Jul',8:'Ago',9:'Set',10:'Out',11:'Nov',12:'Dez'};

/* ---- Definição de campos ---- */
const fieldDefs = {
  tipoAtivo:         { label: 'Tipo de Ativo',            type: 'dim',     group: 'Ativo' },
  segmento1:         { label: 'Segmentação Nível 2',      type: 'dim',     group: 'Ativo' },
  segmento2:         { label: 'Segmentação Nível 3',      type: 'dim',     group: 'Ativo' },
  origem:            { label: 'Origem do Depositante',    type: 'dim',     group: 'Depositante' },
  pais:              { label: 'País de Origem',           type: 'dim',     group: 'Depositante' },
  natureza:          { label: 'Natureza Jurídica',        type: 'dim',     group: 'Depositante' },
  naturezaDetalhada: { label: 'Natureza Jurídica Detalhada', type: 'dim', group: 'Depositante' },
  regiao:            { label: 'Região do Brasil',         type: 'dim',     group: 'Depositante' },
  uf:                { label: 'Unidade da Federação',     type: 'dim',     group: 'Depositante' },
  ano:               { label: 'Ano',                      type: 'dim',     group: 'Período' },
  periodo:           { label: 'Ano/Mês',                  type: 'dim',     group: 'Período' },
  depositos:         { label: 'Número de Depósitos',      type: 'measure', group: 'Medidas' },
  concessoes:        { label: 'Número de Concessões/Decisões', type: 'measure', group: 'Medidas' }
};

/* ---- Hierarquia de ativos (baseada em Medidas_DImensões.xlsx) ---- */
const hierarquiaAtivos = {
  'Patentes': {
    'Patente de Invenção': [],
    'Modelo de Utilidade': [],
    'Certificado de Adição': []
  },
  'Marcas': {
    'Produto': [],
    'Serviço': [],
    'Produto e/ou Serviço': [],
    'Coletiva': [],
    'Certificação': []
  },
  'Desenho Industrial': {},
  'Indicação Geográfica': {
    'Indicação de Procedência': [],
    'Denominação de Origem': []
  },
  'Programa de Computador': {},
  'Topografia de CI': {},
  'Contratos de Transf. Tecnologia': {
    'Uso de Marcas': ['Licença', 'Cessão'],
    'Exploração de Patentes': ['Licença', 'Cessão'],
    'Exploração de DI': ['Licença', 'Cessão'],
    'Serv. Assistência Técnica': [],
    'Franquia': [],
    'Alteração de Certificado': []
  }
};

/* ---- Perfis de depositantes para dados demonstrativos ---- */
const depositantes = [
  ['Residente','Brasil','Pessoa Jurídica','Empresa','Sudeste','São Paulo (SP)'],
  ['Residente','Brasil','Pessoa Jurídica','Empresa','Sudeste','Rio de Janeiro (RJ)'],
  ['Residente','Brasil','Pessoa Física','Pessoa Física','Sudeste','Minas Gerais (MG)'],
  ['Residente','Brasil','Pessoa Jurídica','Universidade','Nordeste','Pernambuco (PE)'],
  ['Residente','Brasil','Pessoa Jurídica','ICT','Sul','Paraná (PR)'],
  ['Residente','Brasil','Pessoa Jurídica','Associação','Sul','Rio Grande do Sul (RS)'],
  ['Residente','Brasil','Pessoa Jurídica','Empresa','Norte','Amazonas (AM)'],
  ['Residente','Brasil','Pessoa Jurídica','Empresa','Nordeste','Bahia (BA)'],
  ['Não residente','Estados Unidos','Pessoa Jurídica','Empresa estrangeira','Exterior','Exterior'],
  ['Não residente','China','Pessoa Jurídica','Empresa estrangeira','Exterior','Exterior'],
  ['Não residente','Alemanha','Pessoa Jurídica','Empresa estrangeira','Exterior','Exterior'],
  ['Não residente','Japão','Pessoa Jurídica','Empresa estrangeira','Exterior','Exterior'],
  ['Não residente','França','Pessoa Jurídica','Empresa estrangeira','Exterior','Exterior']
];

/* ---- Gerador de dados sintéticos calibrados (Amostra representativa leve) ---- */
function ativoRows() {
  const out = [];
  Object.entries(hierarquiaAtivos).forEach(([tipo, n2]) => {
    const nivel2 = Object.keys(n2);
    if (!nivel2.length) { out.push([tipo, 'Sem segmentação', 'Sem segmentação']); }
    nivel2.forEach(seg1 => {
      const nivel3 = n2[seg1];
      if (!nivel3.length) { out.push([tipo, seg1, 'Sem segmentação']); }
      else { nivel3.forEach(seg2 => out.push([tipo, seg1, seg2])); }
    });
  });
  return out;
}

function baseAtivo(tipo) {
  return {'Marcas':4200,'Patentes':980,'Desenho Industrial':620,'Indicação Geográfica':12,
    'Programa de Computador':380,'Topografia de CI':3,
    'Contratos de Transf. Tecnologia':95}[tipo] || 100;
}

function fatorSegmento(seg1, seg2) {
  const f1 = {'Patente de Invenção':1,'Modelo de Utilidade':0.28,'Certificado de Adição':0.03,
    'Produto':1,'Serviço':0.86,'Produto e/ou Serviço':0.45,'Coletiva':0.03,'Certificação':0.02,
    'Indicação de Procedência':1,'Denominação de Origem':0.55,
    'Uso de Marcas':1,'Exploração de Patentes':0.90,'Exploração de DI':0.55,
    'Serv. Assistência Técnica':0.80,'Franquia':0.62,'Alteração de Certificado':0.30,
    'Sem segmentação':1};
  const f2 = {'Licença':1,'Cessão':0.38,'Sem segmentação':1};
  return (f1[seg1]||1) * (f2[seg2]||1);
}

function fatorDepositante(origem, pais, natDet, uf) {
  if (origem === 'Não residente') {
    return {'Estados Unidos':0.55,'China':0.42,'Alemanha':0.25,'Japão':0.22,'França':0.18}[pais]||0.15;
  }
  const fUF = {'São Paulo (SP)':1,'Rio de Janeiro (RJ)':0.42,'Minas Gerais (MG)':0.35,
    'Pernambuco (PE)':0.18,'Paraná (PR)':0.22,'Rio Grande do Sul (RS)':0.25,
    'Amazonas (AM)':0.12,'Bahia (BA)':0.16};
  const fN = {'Empresa':1,'Pessoa Física':0.35,'Universidade':0.22,'ICT':0.12,'Associação':0.08};
  return (fUF[uf]||0.1) * (fN[natDet]||1);
}

function gerarDados() {
  const linhas = [];
  [2020,2021,2022,2023,2024].forEach(ano => {
    ativoRows().forEach(([tipoAtivo, segmento1, segmento2]) => {
      depositantes.forEach(([origem, pais, natureza, natDet, regiao, uf]) => {
        for (let mes = 1; mes <= 12; mes++) {
          const saz = 0.78 + (mes % 6) * 0.08;
          const cresc = {2020:0.92,2021:0.88,2022:0.90,2023:0.97,2024:1.07}[ano]||1;
          const dep = Math.round(baseAtivo(tipoAtivo) * fatorSegmento(segmento1,segmento2) *
            fatorDepositante(origem,pais,natDet,uf) * saz * cresc);
          if (dep <= 0) continue;
          let taxa = 0.43;
          if (tipoAtivo === 'Indicação Geográfica') taxa = 0.40;
          if (tipoAtivo.startsWith('Contrato')) taxa = 0.52;
          if (tipoAtivo === 'Patentes') taxa = 0.36;
          linhas.push({ ano, mes, periodo:`${mesesNome[mes]}/${String(ano).slice(2)}`,
            tipoAtivo, segmento1, segmento2, origem, pais, natureza, naturezaDetalhada:natDet,
            regiao, uf, depositos:dep, concessoes:Math.round(dep*taxa) });
        }
      });
    });
  });
  return linhas;
}

// Os dados agregados leves para rodar no client-side
window.pivotData = gerarDados();
window.fieldDefs = fieldDefs;
