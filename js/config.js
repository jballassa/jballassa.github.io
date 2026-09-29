/* Jessica Ballassa Confeitaria · tudo que muda com frequência mora aqui.
   Trocar um link, um horário ou um cupom é mudar uma linha deste arquivo. */
window.JB = {
  whats: "5511917703998",
  whatsTexto: "(11) 91770-3998",
  instagram: "https://www.instagram.com/jballassaconfeitaria/",

  /* O delivery próprio é o Saipos. O utm diz de onde veio o pedido. */
  delivery: "https://jbconfeitaria.saipos.com/?utm_source=site&utm_medium=linkbio&utm_campaign=bio",

  /* Os apps ficam em segundo plano de propósito. Link vazio vira só o nome. */
  /* nota: o que o cliente vê em cada app. Conferir e atualizar de tempos em tempos (levantado em 17/09/2026). */
  apps: [
    { nome: "iFood",  nota: "nota 5,0", url: "https://www.ifood.com.br/delivery/sao-paulo-sp/jb-confeitaria-bolo-de-pote-brownie-doces-vila-madalena/94072a9c-350e-499f-b17c-5c1fd3f1986c" },
    { nome: "99Food", nota: "nota 4,8", url: "" },
    { nome: "Keeta",  nota: "96% cinco estrelas", url: "" }
  ],
  notasData: "setembro de 2026",

  /* Cupons do delivery próprio, criados no Saipos, válidos até 31/12/2026. */
  cupons: [
    { codigo: "BEMVINDA",    texto: "10% no seu primeiro pedido", regra: "acima de R$ 35" },
    { codigo: "FRETEGRATIS", texto: "entrega grátis",             regra: "acima de R$ 49,90" }
  ],

  endereco: "Rua Wisard, 598",
  bairro: "Vila Madalena, São Paulo",
  mapa: "https://www.google.com/maps/search/?api=1&query=Rua+Wisard+598+Vila+Madalena+S%C3%A3o+Paulo",

  /* Empresa, para o rodapé (obrigatório em site que recebe pedido). */
  cnpj: "47.010.705/0001-53",

  /* Horário do DELIVERY próprio (o que o Saipos aceita hoje, lido em 29/09/2026).
     Terça das 11h às 20h, quarta a sábado das 11h às 21h. Sem segunda e domingo.
     Fora do horário o Saipos aceita agendamento para os próximos 2 dias. */
  delivery_horario: {
    2: [11 * 60, 20 * 60],
    3: [11 * 60, 21 * 60],
    4: [11 * 60, 21 * 60],
    5: [11 * 60, 21 * 60],
    6: [11 * 60, 21 * 60]
  },
  delivery_agenda: true,
  delivery_minimo: 25,

  /* Horário do ateliê (retirada e balcão). 0 = domingo. [abre, fecha] em minutos do dia. */
  horario: {
    0: [14 * 60, 21 * 60 + 45],
    1: [11 * 60, 22 * 60 + 45],
    2: [11 * 60, 22 * 60 + 45],
    3: [11 * 60, 22 * 60 + 45],
    4: [11 * 60, 22 * 60 + 45],
    5: [11 * 60, 22 * 60 + 45],
    6: [11 * 60, 22 * 60 + 45]
  },

  /* Janela de retirada das encomendas, de meia em meia hora. */
  retirada: {
    0: [14 * 60, 21 * 60],
    1: [11 * 60, 22 * 60],
    2: [11 * 60, 22 * 60],
    3: [11 * 60, 22 * 60],
    4: [11 * 60, 22 * 60],
    5: [11 * 60, 22 * 60],
    6: [11 * 60, 22 * 60]
  },
  antecedenciaHoras: 48,

  supabase: {
    url: "https://yudtseanlkhxkmnranmg.supabase.co",
    chave: "sb_publishable_M77s2Y-DZGl0xLZYYGKniA_ZdkxBO8O"
  }
};
