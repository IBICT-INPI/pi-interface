/**
 * RPI Online — Base de Dados Demonstrativa
 * =========================================
 * Dados de protótipo para a Revista da Propriedade Industrial.
 * Somente Desenho Industrial (Seção III) da RPI 2897 está funcional.
 *
 * ATENÇÃO: Estes são dados reais de publicações da RPI nº 2897,
 * utilizados exclusivamente para fins de prototipação.
 */

/* global window */

(function () {
  'use strict';

  /**
   * Registros individuais de publicação.
   * Cada registro representa um despacho publicado na RPI.
   */
  var RPI_REGISTROS = [
    {
      id: 'br302026004580-3',
      numero: 'BR302026004580-3',
      numeroSecundario: '0/0000004580',
      ativo: 'Desenho Industrial',
      rpi: '2897',
      dataPublicacao: '14/07/2026',
      dataDeposito: '',
      secao: 'Seção III',
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categoria: 'Exigência de pagamento',
      despacho: 'Exigência de pagamento',
      codigoDespacho: '395',
      titular: 'HENRIQUE INDUSTRIA E COMERCIO DE MOVEIS JACI LTDA [BR/SP]',
      procurador: 'Cancelado',
      detalhes: 'Considerando que o pedido foi protocolado após a entrada em vigor da nova tabela de retribuições, complemente a retribuição devida no exato valor fixado na tabela vigente. Siga as instruções da seção 3.3.3 do Manual de Desenhos Industriais para efetuar a complementação do valor devido, por meio de GRU sob o código de serviço 800. Cumpra esta exigência por meio de formulário de cumprimento de exigência formal, apresentando o comprovante de pagamento complementar.',
      prazo: '5 dias',
      fundamentacao: 'Artigos 103 e 221 da Lei da Propriedade Industrial.'
    },
    {
      id: 'br302026003617-0',
      numero: 'BR302026003617-0',
      numeroSecundario: '0/0000003617',
      ativo: 'Desenho Industrial',
      rpi: '2897',
      dataPublicacao: '14/07/2026',
      dataDeposito: '21/05/2026',
      secao: 'Seção III',
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categoria: 'Notificação de depósito',
      despacho: 'Notificação do depósito — exame formal concluído',
      codigoDespacho: '860',
      titular: 'TENAZ ENGENHARIA E INDÚSTRIA MECÂNICA [BR/PR]',
      procurador: 'Não informado',
      detalhes: 'O pedido cumpre as condições de admissibilidade previstas na Lei da Propriedade Industrial e segue para a etapa de exame técnico. Este despacho não gera direito à fotocópia por parte de terceiros.'
    },
    {
      id: 'br302026003623-5',
      numero: 'BR302026003623-5',
      numeroSecundario: '0/0000003623',
      ativo: 'Desenho Industrial',
      rpi: '2897',
      dataPublicacao: '14/07/2026',
      dataDeposito: '21/05/2026',
      secao: 'Seção III',
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categoria: 'Notificação de depósito',
      despacho: 'Notificação do depósito — exame formal concluído',
      codigoDespacho: '860',
      titular: 'SUPER TOYS INDÚSTRIA E COMÉRCIO DE ARTEFATOS PLÁSTICOS LTDA. [BR/SP]',
      procurador: 'Marília Crozatti',
      detalhes: 'O pedido cumpre as condições de admissibilidade previstas na Lei da Propriedade Industrial e segue para a etapa de exame técnico.'
    },
    {
      id: 'br302026004063-1',
      numero: 'BR302026004063-1',
      numeroSecundario: '0/0000004063',
      ativo: 'Desenho Industrial',
      rpi: '2897',
      dataPublicacao: '14/07/2026',
      dataDeposito: '09/06/2026',
      secao: 'Seção III',
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categoria: 'Notificação de depósito',
      despacho: 'Notificação do depósito — exame formal concluído',
      codigoDespacho: '860',
      titular: 'FORD GLOBAL TECHNOLOGIES, LLC [US]',
      procurador: 'Jacques Labrunie',
      detalhes: 'Notificado o depósito sem requerimento de sigilo, tendo em vista não ter havido pagamento tempestivo da guia referente ao requerimento de sigilo de desenho industrial.'
    },
    {
      id: 'br302026004087-9',
      numero: 'BR302026004087-9',
      numeroSecundario: '0/0000004087',
      ativo: 'Desenho Industrial',
      rpi: '2897',
      dataPublicacao: '14/07/2026',
      dataDeposito: '09/06/2026',
      secao: 'Seção III',
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categoria: 'Notificação de depósito',
      despacho: 'Notificação do depósito — exame formal concluído',
      codigoDespacho: '860',
      titular: 'COLGATE-PALMOLIVE COMPANY [US]',
      procurador: 'Clarke, Modet Propriedade Intelectual Ltda.',
      detalhes: 'O pedido cumpre as condições de admissibilidade previstas na Lei da Propriedade Industrial e segue para a etapa de exame técnico.'
    },
    {
      id: 'br302026003798-3',
      numero: 'BR302026003798-3',
      numeroSecundario: '0/0000003798',
      ativo: 'Desenho Industrial',
      rpi: '2897',
      dataPublicacao: '14/07/2026',
      dataDeposito: '28/05/2026',
      secao: 'Seção III',
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categoria: 'Notificação de depósito — pedido em sigilo',
      despacho: 'Notificação do depósito com requerimento de sigilo — exame formal concluído',
      codigoDespacho: '009',
      titular: 'THE YOKOHAMA RUBBER CO., LTD. [JP]',
      procurador: 'MMV Agentes da Propriedade Industrial Ltda.',
      detalhes: 'O pedido cumpre as condições de admissibilidade previstas na Lei da Propriedade Industrial e seguirá para a etapa de exame técnico após a observação do prazo de sigilo.'
    }
  ];

  /**
   * Edições da RPI disponíveis no protótipo.
   */
  var RPI_EDICOES = [
    // --- Julho 2026 ---
    { numero: '2897', data: '14/07/2026', dataFormatada: '14 de julho de 2026', mes: '07', ano: '2026', ativosDisponiveis: ['Desenho Industrial'], pdf: 'Desenhos_Industriais2897.pdf', ativa: true },
    { numero: '2896', data: '07/07/2026', dataFormatada: '7 de julho de 2026', mes: '07', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2896.pdf', ativa: false },
    // --- Junho 2026 ---
    { numero: '2895', data: '30/06/2026', dataFormatada: '30 de junho de 2026', mes: '06', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2895.pdf', ativa: false },
    { numero: '2894', data: '23/06/2026', dataFormatada: '23 de junho de 2026', mes: '06', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2894.pdf', ativa: false },
    { numero: '2893', data: '16/06/2026', dataFormatada: '16 de junho de 2026', mes: '06', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2893.pdf', ativa: false },
    { numero: '2892', data: '09/06/2026', dataFormatada: '9 de junho de 2026', mes: '06', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2892.pdf', ativa: false },
    { numero: '2891', data: '02/06/2026', dataFormatada: '2 de junho de 2026', mes: '06', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2891.pdf', ativa: false },
    // --- Fevereiro 2026 (Citado no prompt) ---
    { numero: '2875', data: '10/02/2026', dataFormatada: '10 de fevereiro de 2026', mes: '02', ano: '2026', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2875.pdf', ativa: false },
    // --- Março 2025 ---
    { numero: '2828', data: '25/03/2025', dataFormatada: '25 de março de 2025', mes: '03', ano: '2025', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2828.pdf', ativa: false },
    { numero: '2827', data: '18/03/2025', dataFormatada: '18 de março de 2025', mes: '03', ano: '2025', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2827.pdf', ativa: false },
    { numero: '2826', data: '11/03/2025', dataFormatada: '11 de março de 2025', mes: '03', ano: '2025', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2826.pdf', ativa: false },
    { numero: '2825', data: '04/03/2025', dataFormatada: '4 de março de 2025', mes: '03', ano: '2025', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2825.pdf', ativa: false },
    // --- Novembro 2024 (Citado no prompt) ---
    { numero: '2812', data: '25/11/2024', dataFormatada: '25 de novembro de 2024', mes: '11', ano: '2024', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2812.pdf', ativa: false },
    { numero: '2811', data: '18/11/2024', dataFormatada: '18 de novembro de 2024', mes: '11', ano: '2024', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2811.pdf', ativa: false },
    { numero: '2810', data: '11/11/2024', dataFormatada: '11 de novembro de 2024', mes: '11', ano: '2024', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2810.pdf', ativa: false },
    { numero: '2809', data: '04/11/2024', dataFormatada: '4 de novembro de 2024', mes: '11', ano: '2024', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2809.pdf', ativa: false },
    // --- Setembro 2023 (Citado no prompt) ---
    { numero: '2750', data: '12/09/2023', dataFormatada: '12 de setembro de 2023', mes: '09', ano: '2023', ativosDisponiveis: [], pdf: 'Desenhos_Industriais2750.pdf', ativa: false }
  ];

  /**
   * Seções/ativos disponíveis dentro de uma edição.
   */
  var RPI_SECOES = [
    { id: 'desenho-industrial', nome: 'Desenho Industrial — Seção III', ativa: true },
    { id: 'marcas', nome: 'Marcas — em breve', ativa: false },
    { id: 'patentes', nome: 'Patentes — em breve', ativa: false },
    { id: 'programas', nome: 'Programas de Computador — em breve', ativa: false },
    { id: 'contratos', nome: 'Contratos de Tecnologia — em breve', ativa: false }
  ];

  /**
   * Estrutura hierárquica das categorias da seção de Desenho Industrial.
   * Cada grupo contém subcategorias com contagem demonstrativa.
   * As categorias marcadas como `funcional: true` possuem registros na base.
   */
  var RPI_CATEGORIAS_DI = [
    {
      grupo: 'Pedidos de registro de desenho industrial em andamento',
      categorias: [
        { nome: 'Exigência de pagamento', slug: 'exigencia-de-pagamento', funcional: true },
        { nome: 'Notificação de depósito', slug: 'notificacao-de-deposito', funcional: true },
        { nome: 'Notificação de depósito — pedido em sigilo', slug: 'notificacao-de-deposito-pedido-em-sigilo', funcional: true },
        { nome: 'Exame técnico: Exigência', slug: 'exame-tecnico-exigencia', funcional: false },
        { nome: 'Exame técnico: Indeferimento', slug: 'exame-tecnico-indeferimento', funcional: false },
        { nome: 'Perda de Prioridade Unionista', slug: 'perda-de-prioridade-unionista', funcional: false }
      ]
    },
    {
      grupo: 'Pedidos de registro de desenho industrial considerados inexistentes',
      categorias: [
        { nome: 'Em vista da divisão fora do prazo ou não solicitada', slug: 'divisao-fora-do-prazo', funcional: false }
      ]
    },
    {
      grupo: 'Pedidos de registro de desenho industrial definitivamente arquivados',
      categorias: [
        { nome: 'Por falta de resposta à exigência técnica', slug: 'falta-de-resposta-exigencia', funcional: false }
      ]
    },
    {
      grupo: 'Desistências em pedido de registro de desenho industrial',
      categorias: [
        { nome: 'Exame de petição: Deferimento', slug: 'desistencia-deferimento', funcional: false }
      ]
    },
    {
      grupo: 'Concessões de registros de desenho industrial',
      categorias: [
        { nome: 'Registro de desenho industrial concedido', slug: 'registro-concedido', funcional: false },
        { nome: 'Concessão em designação', slug: 'concessao-designacao', funcional: false }
      ]
    },
    {
      grupo: 'Nulidades administrativas de registros de desenho industrial',
      categorias: [
        { nome: 'Notificação de nulidade administrativa', slug: 'nulidade-notificacao', funcional: false },
        { nome: 'Instrução técnica: Exigência', slug: 'nulidade-exigencia', funcional: false },
        { nome: 'Instrução técnica: Intimação para manifestação', slug: 'nulidade-intimacao', funcional: false }
      ]
    },
    {
      grupo: 'Manutenções e renovações de registros de desenho industrial',
      categorias: [
        { nome: 'Outros despachos — Manutenção', slug: 'manutencao', funcional: false }
      ]
    },
    {
      grupo: 'Anotações de alteração de nome e endereço',
      categorias: [
        { nome: 'Exame de petição: Deferimento', slug: 'alteracao-nome-deferimento', funcional: false }
      ]
    },
    {
      grupo: 'Anotações de transferência de titularidade',
      categorias: [
        { nome: 'Exame de petição: Deferimento', slug: 'transferencia-deferimento', funcional: false }
      ]
    },
    {
      grupo: 'Recursos',
      categorias: [
        { nome: 'Notificação de recurso para manifestação', slug: 'recurso-notificacao', funcional: false }
      ]
    },
    {
      grupo: 'Outras petições',
      categorias: [
        { nome: 'Exame de petição: Deferimento', slug: 'outras-peticoes-deferimento', funcional: false },
        { nome: 'Petição de retificação atendida', slug: 'retificacao-atendida', funcional: false }
      ]
    },
    {
      grupo: 'Notificações e decisões judiciais',
      categorias: [
        { nome: 'Notificação de procedimento judicial', slug: 'procedimento-judicial', funcional: false }
      ]
    },
    {
      grupo: 'Disponibilidade de documentos oficiais',
      categorias: [
        { nome: 'Disponibilidade de outros documentos oficiais', slug: 'disponibilidade-documentos', funcional: false },
        { nome: 'Reemissão de certificado de registro', slug: 'reemissao-certificado', funcional: false }
      ]
    }
  ];

  // Expor no escopo global para uso pelas páginas
  window.RPI_REGISTROS = RPI_REGISTROS;
  window.RPI_EDICOES = RPI_EDICOES;
  window.RPI_SECOES = RPI_SECOES;
  window.RPI_CATEGORIAS_DI = RPI_CATEGORIAS_DI;

})();
