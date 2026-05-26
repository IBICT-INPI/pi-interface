/**
 * dados-estatisticas.js
 * Camada de dados do Portal de Estatísticas — ServiçosPI / INPI
 *
 * FONTES REAIS:
 *   - tabelas_completas_jan_2026.xls  → dados mensais (Janeiro/2026)
 *   - Indicadores_PTN_Anuario_2024.xlsx → dados anuais (2000-2024)
 *
 * DADOS SIMULADOS/DEMONSTRATIVOS: marcados com [SIMULADO]
 * Utilizados apenas para demonstrar comportamento de interface quando
 * o indicador existe nas user stories mas não há dados reais nas planilhas.
 */

// ============================================================
// DADOS MENSAIS — Janeiro/2026
// Fonte: tabelas_completas_jan_2026.xls
// ============================================================

const DADOS_MENSAIS = {

  // Período de referência
  referencia: 'Janeiro/2026',
  dataExtracao: '03/02/2026',

  // 1. DECISÕES — 1_DECISOES
  // Real: decisões por tipo de ativo, tipo de decisão, jan/2026
  decisoes: {
    patentes: {
      label: 'Patentes (PI + MU + CA)',
      depositos: 2449,
      decisoes: 2725,
      concessoes: 1394,
      indeferimentos: 309,
      arquivamentos: 1020,
      desistencias: 2
    },
    patenteInvento: {
      label: 'Patente de Invenção (PI)',
      depositos: 2228,
      decisoes: 2509,
      concessoes: 1298,
      indeferimentos: 285,
      arquivamentos: 924,
      desistencias: 2
    },
    modeloUtilidade: {
      label: 'Modelo de Utilidade (MU)',
      depositos: 212,
      decisoes: 201,
      concessoes: 85,
      indeferimentos: 23,
      arquivamentos: 93,
      desistencias: 0
    }
    // [SIMULADO] Dados de decisões para marcas, DI, PC, contratos
    // não estão na planilha de decisões com o mesmo formato
  },

  // 2. DEPÓSITOS POR TIPO DE PROTEÇÃO E ORIGEM — 1.1_TT_MIDIA
  // Real: jan/2026
  depositosPorTipo: {
    contratos: { residente: 30, naoResidente: 13, total: 43 },
    desenhoIndustrial: { residente: 489, naoResidente: 205, total: 694 },
    indicacaoGeografica: { residente: 1, naoResidente: 0, total: 1 },
    marcas: { residente: 25826, naoResidente: 4302, total: 30128 },
    patentes: { residente: 837, naoResidente: 1612, total: 2449 },
    programaComputador: { residente: 669, naoResidente: 0, total: 669 },
    topografiaCircuito: { residente: 0, naoResidente: 0, total: 0 },
    totalGeral: { residente: 27852, naoResidente: 6132, total: 33984 }
  },

  // 3. DEPÓSITOS POR TIPO E ORIGEM/NAT. JURÍDICA — 1.3_TT_ORIGEM_NATJUR
  // Real: jan/2026
  depositosPorOrigemNatJur: {
    naoResidente: { contratos: 13, di: 205, ig: 0, marcas: 1887, patentes: 1612, pc: 0, tci: 0, total: 3717 },
    residPessoaFisica: { contratos: 0, di: 14, ig: 0, marcas: 436, patentes: 24, pc: 0, tci: 0, total: 474 },
    residPessoaJuridica: { contratos: 13, di: 191, ig: 0, marcas: 1451, patentes: 1588, pc: 0, tci: 0, total: 3243 },
    residente: { contratos: 30, di: 489, ig: 1, marcas: 25826, patentes: 837, pc: 669, tci: 0, total: 27852 },
    totalGeral: { contratos: 43, di: 694, ig: 1, marcas: 27713, patentes: 2449, pc: 669, tci: 0, total: 31569 }
  },

  // 4. DEPÓSITOS POR TIPO E UF DO RESIDENTE — 2.4_TT_RES_UF
  // Real: jan/2026 (período acumulado jan-jan)
  depositosPorUF: [
    { sigla: 'AC', nome: 'Acre',                  contratos: 0,  di: 0,   ig: 0, marcas: 30,   patentes: 2,   pc: 1,   tci: 0, total: 33    },
    { sigla: 'AL', nome: 'Alagoas',               contratos: 0,  di: 1,   ig: 0, marcas: 158,  patentes: 10,  pc: 12,  tci: 0, total: 181   },
    { sigla: 'AM', nome: 'Amazonas',              contratos: 2,  di: 20,  ig: 0, marcas: 191,  patentes: 9,   pc: 7,   tci: 0, total: 229   },
    { sigla: 'AP', nome: 'Amapá',                 contratos: 0,  di: 0,   ig: 0, marcas: 34,   patentes: 5,   pc: 5,   tci: 0, total: 44    },
    { sigla: 'BA', nome: 'Bahia',                 contratos: 1,  di: 6,   ig: 0, marcas: 848,  patentes: 30,  pc: 31,  tci: 0, total: 916   },
    { sigla: 'CE', nome: 'Ceará',                 contratos: 0,  di: 7,   ig: 0, marcas: 727,  patentes: 14,  pc: 17,  tci: 0, total: 765   },
    { sigla: 'DF', nome: 'Distrito Federal',      contratos: 0,  di: 2,   ig: 0, marcas: 484,  patentes: 26,  pc: 26,  tci: 0, total: 538   },
    { sigla: 'ES', nome: 'Espírito Santo',        contratos: 0,  di: 0,   ig: 0, marcas: 562,  patentes: 16,  pc: 14,  tci: 0, total: 592   },
    { sigla: 'GO', nome: 'Goiás',                 contratos: 1,  di: 5,   ig: 0, marcas: 1098, patentes: 29,  pc: 42,  tci: 0, total: 1175  },
    { sigla: 'MA', nome: 'Maranhão',              contratos: 0,  di: 2,   ig: 0, marcas: 177,  patentes: 10,  pc: 19,  tci: 0, total: 208   },
    { sigla: 'MG', nome: 'Minas Gerais',          contratos: 1,  di: 18,  ig: 0, marcas: 2796, patentes: 102, pc: 61,  tci: 0, total: 2978  },
    { sigla: 'MS', nome: 'Mato Grosso do Sul',    contratos: 0,  di: 2,   ig: 0, marcas: 220,  patentes: 8,   pc: 10,  tci: 0, total: 240   },
    { sigla: 'MT', nome: 'Mato Grosso',           contratos: 0,  di: 0,   ig: 0, marcas: 480,  patentes: 8,   pc: 17,  tci: 0, total: 505   },
    { sigla: 'PA', nome: 'Pará',                  contratos: 0,  di: 0,   ig: 0, marcas: 276,  patentes: 5,   pc: 19,  tci: 0, total: 300   },
    { sigla: 'PB', nome: 'Paraíba',               contratos: 0,  di: 2,   ig: 0, marcas: 285,  patentes: 9,   pc: 9,   tci: 0, total: 305   },
    { sigla: 'PE', nome: 'Pernambuco',            contratos: 0,  di: 8,   ig: 0, marcas: 650,  patentes: 9,   pc: 12,  tci: 0, total: 679   },
    { sigla: 'PI', nome: 'Piauí',                 contratos: 0,  di: 1,   ig: 0, marcas: 117,  patentes: 1,   pc: 12,  tci: 0, total: 131   },
    { sigla: 'PR', nome: 'Paraná',                contratos: 6,  di: 56,  ig: 0, marcas: 1776, patentes: 64,  pc: 41,  tci: 0, total: 1943  },
    { sigla: 'RJ', nome: 'Rio de Janeiro',        contratos: 4,  di: 28,  ig: 0, marcas: 1944, patentes: 75,  pc: 48,  tci: 0, total: 2099  },
    { sigla: 'RN', nome: 'Rio Grande do Norte',   contratos: 0,  di: 4,   ig: 0, marcas: 216,  patentes: 8,   pc: 20,  tci: 0, total: 248   },
    { sigla: 'RO', nome: 'Rondônia',              contratos: 0,  di: 0,   ig: 0, marcas: 122,  patentes: 1,   pc: 18,  tci: 0, total: 141   },
    { sigla: 'RR', nome: 'Roraima',               contratos: 0,  di: 0,   ig: 0, marcas: 49,   patentes: 5,   pc: 2,   tci: 0, total: 56    },
    { sigla: 'RS', nome: 'Rio Grande do Sul',     contratos: 0,  di: 29,  ig: 0, marcas: 1328, patentes: 66,  pc: 52,  tci: 0, total: 1475  },
    { sigla: 'SC', nome: 'Santa Catarina',        contratos: 2,  di: 38,  ig: 0, marcas: 1788, patentes: 67,  pc: 36,  tci: 0, total: 1931  },
    { sigla: 'SE', nome: 'Sergipe',               contratos: 0,  di: 2,   ig: 0, marcas: 101,  patentes: 5,   pc: 5,   tci: 0, total: 113   },
    { sigla: 'SP', nome: 'São Paulo',             contratos: 13, di: 258, ig: 1, marcas: 9268, patentes: 253, pc: 131, tci: 0, total: 9924  },
    { sigla: 'TO', nome: 'Tocantins',             contratos: 0,  di: 0,   ig: 0, marcas: 101,  patentes: 0,   pc: 2,   tci: 0, total: 103   }
  ],

  // 5. CONTRATOS POR CATEGORIA — 1.14_CONTRATOS
  // Real: jan/2026
  contratosPorCategoria: {
    usoMarcas: 12,
    exploracaoPatentes: null, // [SIMULADO] não disponível separadamente na planilha jan
    exploracaoDI: null,
    fornecimentoTecnologia: null,
    totalRequerimentos: 43
  }
};

// ============================================================
// DADOS ANUAIS — 2000-2024
// Fonte: Indicadores_PTN_Anuario_2024.xlsx
// ATENÇÃO: Este arquivo contém apenas dados de PATENTES
// Dados de outras modalidades anuais [SIMULADO] para demonstração
// ============================================================

const DADOS_ANUAIS = {

  referencia: 'Anuário Estatístico 2024 (2000–2024)',
  fonte: 'INPI/CGEI — BADEPI v11.0',

  // 1. DEPÓSITOS DE PATENTES POR TIPO — Deposito_Tipo
  // Real: 2000-2024
  depositosPatentesPorTipo: [
    { ano: 2000, pi: 17442, mu: 3336, ca: 79,  total: 20857 },
    { ano: 2001, pi: 17900, mu: 3568, ca: 92,  total: 21560 },
    { ano: 2002, pi: 16682, mu: 3591, ca: 102, total: 20375 },
    { ano: 2003, pi: 16396, mu: 3687, ca: 127, total: 20210 },
    { ano: 2004, pi: 16708, mu: 3673, ca: 122, total: 20503 },
    { ano: 2005, pi: 18477, mu: 3281, ca: 122, total: 21882 },
    { ano: 2006, pi: 19830, mu: 3206, ca: 117, total: 23154 },
    { ano: 2007, pi: 21643, mu: 3078, ca: 137, total: 24863 },
    { ano: 2008, pi: 23124, mu: 3460, ca: 129, total: 26714 },
    { ano: 2009, pi: 22390, mu: 3425, ca: 121, total: 25939 },
    { ano: 2010, pi: 24976, mu: 3057, ca: 107, total: 28141 },
    { ano: 2011, pi: 28652, mu: 3169, ca: 88,  total: 31914 },
    { ano: 2012, pi: 30544, mu: 3071, ca: 132, total: 33747 },
    { ano: 2013, pi: 30829, mu: 3080, ca: 133, total: 34042 },
    { ano: 2014, pi: 30285, mu: 2775, ca: 101, total: 33161 },
    { ano: 2015, pi: 30194, mu: 2785, ca: 105, total: 33090 },
    { ano: 2016, pi: 28014, mu: 2975, ca: 71,  total: 31060 },
    { ano: 2017, pi: 25615, mu: 2958, ca: 92,  total: 28665 },
    { ano: 2018, pi: 24917, mu: 2603, ca: 105, total: 27625 },
    { ano: 2019, pi: 25384, mu: 2833, ca: 98,  total: 28315 },
    { ano: 2020, pi: 24340, mu: 2672, ca: 90,  total: 27102 },
    { ano: 2021, pi: 24221, mu: 2589, ca: 110, total: 26920 },
    { ano: 2022, pi: 24750, mu: 2284, ca: 105, total: 27139 },
    { ano: 2023, pi: 25369, mu: 2447, ca: 102, total: 27918 },
    { ano: 2024, pi: 25062, mu: 2534, ca: 105, total: 27701 }
  ],

  // 2. CONCESSÕES DE PATENTES POR TIPO — Concessao_Tipo
  // Real: 2000-2024
  concessoesPatentesPorTipo: [
    { ano: 2000, pi: 6268,  mu: 426,  ca: 1,  total: 6695  },
    { ano: 2001, pi: 3298,  mu: 326,  ca: 3,  total: 3627  },
    { ano: 2002, pi: 4430,  mu: 359,  ca: 3,  total: 4792  },
    { ano: 2003, pi: 4277,  mu: 476,  ca: 13, total: 4766  },
    { ano: 2004, pi: 2265,  mu: 269,  ca: 8,  total: 2542  },
    { ano: 2005, pi: 2473,  mu: 369,  ca: 16, total: 2858  },
    { ano: 2006, pi: 2510,  mu: 276,  ca: 15, total: 2801  },
    { ano: 2007, pi: 1650,  mu: 200,  ca: 13, total: 1863  },
    { ano: 2008, pi: 2522,  mu: 290,  ca: 18, total: 2830  },
    { ano: 2009, pi: 2791,  mu: 357,  ca: 16, total: 3164  },
    { ano: 2010, pi: 3251,  mu: 362,  ca: 10, total: 3623  },
    { ano: 2011, pi: 3451,  mu: 349,  ca: 13, total: 3813  },
    { ano: 2012, pi: 2836,  mu: 292,  ca: 11, total: 3139  },
    { ano: 2013, pi: 2974,  mu: 347,  ca: 6,  total: 3327  },
    { ano: 2014, pi: 2751,  mu: 366,  ca: 6,  total: 3123  },
    { ano: 2015, pi: 3412,  mu: 479,  ca: 5,  total: 3896  },
    { ano: 2016, pi: 4196,  mu: 564,  ca: 12, total: 4772  },
    { ano: 2017, pi: 5450,  mu: 788,  ca: 12, total: 6250  },
    { ano: 2018, pi: 9969,  mu: 1098, ca: 24, total: 11091 },
    { ano: 2019, pi: 12706, mu: 1022, ca: 24, total: 13752 },
    { ano: 2020, pi: 20416, mu: 859,  ca: 36, total: 21311 },
    { ano: 2021, pi: 26890, mu: 698,  ca: 56, total: 27644 },
    { ano: 2022, pi: 23544, mu: 759,  ca: 50, total: 24353 },
    { ano: 2023, pi: 18287, mu: 873,  ca: 44, total: 19204 },
    { ano: 2024, pi: 12096, mu: 781,  ca: 37, total: 12914 }
  ],

  // 3. DEPÓSITOS DE PATENTES PI POR UF (residentes) — Deposito_PI_UF
  // Real: 2000-2024
  depositosPIporUF: [
    { sigla: 'SP', nome: 'São Paulo',           valores: [1525,1583,1614,1781,1834,1797,1721,1847,1824,1825,1785,1997,2041,1951,1814,1592,1513,1564,1516,1567,1596,1472,1347,1436,1582] },
    { sigla: 'RJ', nome: 'Rio de Janeiro',      valores: [301,291,335,321,410,393,379,384,390,374,336,355,390,389,407,364,673,651,361,518,515,463,439,483,613] },
    { sigla: 'MG', nome: 'Minas Gerais',        valores: [268,348,337,393,365,373,401,490,397,433,475,473,465,515,463,401,508,617,586,636,585,479,514,601,771] },
    { sigla: 'RS', nome: 'Rio Grande do Sul',   valores: [238,240,257,294,335,330,344,332,372,339,320,422,449,457,412,397,461,434,409,442,412,460,431,469,545] },
    { sigla: 'PR', nome: 'Paraná',              valores: [209,205,234,287,326,332,331,375,394,409,338,359,410,399,360,342,401,433,413,437,432,364,352,345,446] },
    { sigla: 'SC', nome: 'Santa Catarina',      valores: [158,218,189,256,255,271,246,231,310,268,324,291,267,293,292,300,308,303,327,399,353,344,303,376,400] },
    { sigla: 'PE', nome: 'Pernambuco',          valores: [47,50,57,39,42,60,49,40,53,53,46,76,70,85,96,109,145,148,147,133,187,116,116,158,165] },
    { sigla: 'DF', nome: 'Distrito Federal',    valores: [73,58,75,80,91,76,85,51,65,63,79,92,97,103,75,62,90,91,88,98,84,73,69,66,98] },
    { sigla: 'BA', nome: 'Bahia',               valores: [45,48,40,59,53,62,63,70,92,92,115,130,142,135,128,107,139,109,97,129,144,143,114,130,154] },
    { sigla: 'CE', nome: 'Ceará',               valores: [37,50,37,45,52,51,38,50,56,67,72,75,70,94,96,91,117,165,137,108,146,87,77,102,107] },
    { sigla: 'PB', nome: 'Paraíba',             valores: [13,21,25,14,15,18,30,18,24,22,28,32,18,36,30,46,69,181,206,238,205,118,116,157,181] },
    { sigla: 'GO', nome: 'Goiás',               valores: [49,49,43,77,64,75,46,66,61,54,52,82,83,82,77,84,88,114,87,118,80,79,72,91,84] },
    { sigla: 'AM', nome: 'Amazonas',            valores: [9,18,15,21,39,27,22,27,43,48,37,46,33,27,25,22,20,28,18,26,24,14,21,27,44] },
    { sigla: 'ES', nome: 'Espírito Santo',      valores: [54,59,55,69,55,59,63,68,75,70,79,61,72,116,105,124,127,91,104,97,105,65,93,95,86] },
    { sigla: 'RN', nome: 'Rio Grande do Norte', valores: [19,10,2,22,18,30,21,24,16,28,22,24,32,38,45,66,55,61,43,66,45,56,49,79,61] },
    { sigla: 'AL', nome: 'Alagoas',             valores: [4,8,3,9,5,6,5,7,6,11,14,11,13,21,20,27,31,37,52,52,61,48,32,29,42] },
    { sigla: 'PA', nome: 'Pará',                valores: [9,15,17,9,16,22,13,22,20,12,24,23,15,19,18,37,42,45,39,64,60,53,44,62,65] },
    { sigla: 'MT', nome: 'Mato Grosso',         valores: [18,15,18,13,12,14,33,38,23,13,11,25,26,16,22,15,29,20,24,28,28,32,30,29,38] },
    { sigla: 'SE', nome: 'Sergipe',             valores: [8,8,6,6,10,13,11,8,5,19,9,34,30,34,39,41,36,64,36,64,46,53,33,53,62] },
    { sigla: 'MS', nome: 'Mato Grosso do Sul',  valores: [10,17,11,10,18,18,17,19,12,19,21,20,27,31,39,25,26,42,60,50,54,45,33,57,44] },
    { sigla: 'MA', nome: 'Maranhão',            valores: [9,6,5,8,5,7,5,1,8,19,15,18,34,26,17,28,46,44,54,66,56,48,48,51,50] },
    { sigla: 'PI', nome: 'Piauí',               valores: [8,4,2,0,3,3,3,4,5,7,6,21,22,14,22,15,24,14,18,25,15,19,22,36,44] },
    { sigla: 'RO', nome: 'Rondônia',            valores: [6,5,7,9,6,4,4,7,6,7,1,13,8,4,4,9,15,15,63,16,6,5,4,3,3] },
    { sigla: 'AC', nome: 'Acre',                valores: [0,1,1,5,1,1,5,2,2,1,0,1,0,0,2,0,2,4,10,5,8,8,2,8,9] },
    { sigla: 'AP', nome: 'Amapá',               valores: [2,1,2,1,4,2,0,0,0,2,2,1,0,0,1,1,2,5,4,7,5,5,4,3,11] },
    { sigla: 'RR', nome: 'Roraima',             valores: [2,0,2,2,0,1,4,4,0,1,1,1,1,1,1,1,0,6,3,0,1,0,9,9,11] },
    { sigla: 'TO', nome: 'Tocantins',           valores: [3,2,8,4,3,1,4,1,3,4,3,3,9,5,10,2,11,12,11,14,10,5,9,10,13] }
  ],
  // Anos correspondentes aos valores do array depositosPIporUF
  anosUF: [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024],

  // [SIMULADO] Dados anuais por tipo de ativo (não-patente) para demonstração do explorador
  // Foram estimados com base nas proporções do relatório mensal jan/2026 e tendências publicadas no anuário
  depositosTodosTiposAnual: [
    { ano: 2020, patentes: 27102, marcas: 291000, di: 14200, pc: 13500, contratos: 2100, ig: 35, tci: 5 },
    { ano: 2021, patentes: 26920, marcas: 306000, di: 15800, pc: 16200, contratos: 2300, ig: 42, tci: 8 },
    { ano: 2022, patentes: 27139, marcas: 328000, di: 16900, pc: 18700, contratos: 2500, ig: 48, tci: 6 },
    { ano: 2023, patentes: 27918, marcas: 345000, di: 17500, pc: 20100, contratos: 2700, ig: 51, tci: 7 },
    { ano: 2024, patentes: 27701, marcas: 362000, di: 18300, pc: 22400, contratos: 2900, ig: 55, tci: 9 }
  ]
};

// ============================================================
// UTILITÁRIOS
// ============================================================

const Utils = {
  formatNum(n) {
    if (n === null || n === undefined) return '—';
    return new Intl.NumberFormat('pt-BR').format(n);
  },
  formatPct(n, total) {
    if (!total || !n) return '0,0%';
    return (n / total * 100).toFixed(1).replace('.', ',') + '%';
  },
  anos() {
    return DADOS_ANUAIS.depositosPatentesPorTipo.map(d => d.ano);
  }
};

// Exporta para uso global nos HTMLs
window.DADOS_MENSAIS = DADOS_MENSAIS;
window.DADOS_ANUAIS  = DADOS_ANUAIS;
window.Utils         = Utils;
