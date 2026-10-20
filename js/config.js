/* Jessica Ballassa Confeitaria · tudo que muda com frequência mora aqui.
   Trocar um link, um horário ou um cupom é mudar uma linha deste arquivo. */
window.JB = {
  whats: "5511917703998",
  whatsTexto: "(11) 91770-3998",
  instagram: "https://www.instagram.com/jballassaconfeitaria/",

  /* O delivery próprio é o Saipos. O utm diz de onde veio o pedido. */
  delivery: "https://jbconfeitaria.saipos.com/?utm_source=site&utm_medium=linkbio&utm_campaign=bio",

  /* Os apps ficam em segundo plano de propósito. Link vazio vira só o nome. */
  /* nota: o que o cliente vê em cada app. Conferir e atualizar de tempos em tempos (conferido nos portais em 20/10/2026: iFood 5, com 46 de 48 avaliações em 5 estrelas em 90 dias; Keeta 58 de 62 em 5 estrelas em 30 dias; o portal do 99Food não mostra mais a nota). */
  apps: [
    { nome: "iFood",  nota: "nota 5,0", url: "https://www.ifood.com.br/delivery/sao-paulo-sp/jb-confeitaria-bolo-de-pote-brownie-doces-vila-madalena/94072a9c-350e-499f-b17c-5c1fd3f1986c" },
    { nome: "99Food", nota: "", url: "" },
    { nome: "Keeta",  nota: "95% cinco estrelas", url: "" }
  ],
  notasData: "outubro de 2026",

  /* Cupons do delivery próprio, conferidos no Saipos em 13/10/2026, válidos até 31/12/2026. O VOLTEI (panfleto da sacola) fica fora do site de propósito. */
  cupons: [
    { codigo: "BEMVINDO",    texto: "10% no seu primeiro pedido", regra: "acima de R$ 45" },
    { codigo: "FRETEGRATIS", texto: "entrega grátis",             regra: "acima de R$ 49,90" }
  ],

  endereco: "Rua Wisard, 598",
  bairro: "Vila Madalena, São Paulo",
  mapa: "https://www.google.com/maps/search/?api=1&query=Rua+Wisard+598+Vila+Madalena+S%C3%A3o+Paulo",

  /* Empresa, para o rodapé (obrigatório em site que recebe pedido). */
  cnpj: "47.010.705/0001-53",

  /* Horário do DELIVERY próprio, confirmado pelo Henrique em 29/09/2026:
     segunda a sábado das 11h às 22h45, domingo das 15h às 22h45 desde 04/10/2026, antes 14h às 21h45 (igual ao do ateliê).
     Fora do horário o Saipos aceita agendamento para os próximos 2 dias. */
  delivery_horario: {
    0: [15 * 60, 22 * 60 + 45],
    1: [11 * 60, 22 * 60 + 45],
    2: [11 * 60, 22 * 60 + 45],
    3: [11 * 60, 22 * 60 + 45],
    4: [11 * 60, 22 * 60 + 45],
    5: [11 * 60, 22 * 60 + 45],
    6: [11 * 60, 22 * 60 + 45]
  },
  delivery_agenda: true,
  delivery_minimo: 25,

  /* Horário do ateliê (retirada e balcão). 0 = domingo. [abre, fecha] em minutos do dia. */
  horario: {
    0: [15 * 60, 22 * 60 + 45],
    1: [11 * 60, 22 * 60 + 45],
    2: [11 * 60, 22 * 60 + 45],
    3: [11 * 60, 22 * 60 + 45],
    4: [11 * 60, 22 * 60 + 45],
    5: [11 * 60, 22 * 60 + 45],
    6: [11 * 60, 22 * 60 + 45]
  },

  /* Janela de retirada das encomendas, de meia em meia hora. */
  retirada: {
    0: [15 * 60, 22 * 60],
    1: [11 * 60, 22 * 60],
    2: [11 * 60, 22 * 60],
    3: [11 * 60, 22 * 60],
    4: [11 * 60, 22 * 60],
    5: [11 * 60, 22 * 60],
    6: [11 * 60, 22 * 60]
  },
  antecedenciaHoras: 48,

  /* Loja de digitais (e-books e adesivos). O pagamento e a entrega são da Kiwify.
     Para lançar um produto novo: cole o link do checkout em url. Link vazio = "em breve".
     Preços conferidos na Kiwify em 19/10/2026 (valor à vista); Bolo Nuvem conferido em 20/10/2026. */
  loja: [
    { id: "nuvem",    tipo: "E-book", nome: "Bolo Nuvem",          preco: 99.9, url: "https://pay.kiwify.com.br/dRvKBop", novo: true,
      texto: "O bolo da casa, do jeito que sai na nossa produção: massa, calda, brigadeiro meio amargo, creme nuvem em duas etapas, montagem, corte e validade." },
    { id: "cookie",   tipo: "E-book", nome: "Cookie Kinder",       preco: 34, url: "https://pay.kiwify.com.br/S46PZDh",
      texto: "O cookie recheado que sai do ateliê, com massa, recheio e o ponto certo do forno." },
    { id: "gelato",   tipo: "E-book", nome: "Gelato Artesanal",    preco: 29, url: "https://pay.kiwify.com.br/y65joCs",
      texto: "Gelato cremoso feito em casa, do jeito que a Jessica faz no ateliê." },
    { id: "basca",    tipo: "E-book", nome: "Torta Basca",         preco: 24, url: "https://pay.kiwify.com.br/5YrSEcS",
      texto: "A basca de centro cremoso e topo caramelizado, passo a passo." },
    { id: "franui",   tipo: "E-book", nome: "Torta Franui",        preco: 24, url: "https://pay.kiwify.com.br/mS8899G",
      texto: "A torta de framboesa com chocolate inspirada no Franui, camada por camada." },
    { id: "adesivos", tipo: "Pack digital", nome: "Adesivos para Stories", preco: 52, url: "https://pay.kiwify.com.br/sB77I36",
      texto: "Adesivos com a estética da JB para deixar os seus stories mais bonitos." }
  ],

  /* Combos: aparecem no topo da loja só quando tiverem o link do checkout da Kiwify.
     "itens" são os ids da lista acima; o "de" é a soma dos preços deles. destaque = cartão escuro. */
  combos: [
    { id: "colecao",   nome: "Coleção da Jessica", preco: 149.9, url: "", destaque: true,
      itens: ["nuvem", "cookie", "gelato", "basca", "franui", "adesivos"],
      texto: "Todos os e-books e os adesivos para stories. Por pouco mais que o Bolo Nuvem sozinho." },
    { id: "classicos", nome: "Kit Clássicos", preco: 79.9, url: "",
      itens: ["cookie", "gelato", "basca", "franui"],
      texto: "Cookie Kinder, Gelato, Torta Basca e Torta Franui." }
  ],

  supabase: {
    url: "https://yudtseanlkhxkmnranmg.supabase.co",
    chave: "sb_publishable_M77s2Y-DZGl0xLZYYGKniA_ZdkxBO8O"
  }
};
