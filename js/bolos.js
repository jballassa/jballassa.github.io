/* Bolos por encomenda: o montador.
   As opções e os preços vêm do banco (a Jessica muda pelo JB OS). Se o banco
   não responder, a página usa a cópia abaixo, para o cardápio nunca sumir.
   O preço que vale é o que o banco recalcula na hora de gravar. */

const CARDAPIO_RESERVA = [
  { id:"tam_pp", grupo:"tamanho", nome:"PP", descricao:"13cm", ordem:10, detalhe:{cm:13,fatias:10,kg:1.2} },
  { id:"tam_p",  grupo:"tamanho", nome:"P",  descricao:"15cm", ordem:20, detalhe:{cm:15,fatias:15,kg:1.8} },
  { id:"tam_m",  grupo:"tamanho", nome:"M",  descricao:"17cm", ordem:30, detalhe:{cm:17,fatias:20,kg:2.2} },
  { id:"tam_g",  grupo:"tamanho", nome:"G",  descricao:"20cm", ordem:40, detalhe:{cm:20,fatias:25,kg:2.8} },
  { id:"mod_naked", grupo:"modelo", nome:"Naked Cake", descricao:"Laterais aparentes, montado no acetato", ordem:10, preco_pp:170, preco_p:220, preco_m:290, preco_g:350 },
  { id:"mod_chant", grupo:"modelo", nome:"Chantininho", descricao:"Espatulado liso em uma cor", ordem:20, preco_pp:200, preco_p:260, preco_m:320, preco_g:390 },
  { id:"mas_baunilha", grupo:"massa", nome:"Baunilha", ordem:10 },
  { id:"mas_choco", grupo:"massa", nome:"Chocolate", ordem:20 },
  { id:"mas_red", grupo:"massa", nome:"Red velvet", ordem:30, preco_pp:12, preco_p:16, preco_m:20, preco_g:24 },
  { id:"mas_brownie", grupo:"massa", nome:"Brownie", ordem:40, premium:true, preco_pp:48, preco_p:60, preco_m:70, preco_g:80 },
  { id:"rec_ninho", grupo:"recheio", nome:"Ninho trufado", ordem:10 },
  { id:"rec_brig", grupo:"recheio", nome:"Brigadeiro meio amargo", ordem:20 },
  { id:"rec_cocada", grupo:"recheio", nome:"Cocada cremosa", ordem:30 },
  { id:"rec_ddl", grupo:"recheio", nome:"Doce de leite", ordem:40 },
  { id:"rec_kinder", grupo:"recheio", nome:"Kinder Bueno", ordem:50, premium:true, preco_pp:45, preco_p:55, preco_m:68, preco_g:78 },
  { id:"cmb_perfeito", grupo:"combinacao", nome:"Duo perfeito", descricao:"Brigadeiro meio amargo e ninho trufado", ordem:10, preco_pp:25, preco_p:35, preco_m:45, preco_g:50 },
  { id:"cmb_classico", grupo:"combinacao", nome:"Duo clássico", descricao:"Cocada cremosa e brigadeiro meio amargo", ordem:20, preco_pp:25, preco_p:35, preco_m:45, preco_g:55 },
  { id:"cmb_brownie", grupo:"combinacao", nome:"Duo brownie", descricao:"Brigadeiro cremoso ou ninho trufado, com pedaços de brownie", ordem:30, preco_pp:18, preco_p:24, preco_m:30, preco_g:38, detalhe:{escolha:["Brigadeiro cremoso","Ninho trufado"]} },
  { id:"adc_morango", grupo:"adicional", nome:"Morangos frescos", ordem:10, preco_pp:18, preco_p:28, preco_m:36, preco_g:48 },
  { id:"adc_geleia", grupo:"adicional", nome:"Geleia de frutas vermelhas", ordem:20, preco_pp:28, preco_p:36, preco_m:44, preco_g:58 },
  { id:"dec_classico", grupo:"decoracao", nome:"Espatulado clássico", descricao:"Sem detalhes de bico", ordem:10, preco_pp:25, preco_p:25, preco_m:35, preco_g:45, so_modelo:"mod_chant" },
  { id:"dec_vintage", grupo:"decoracao", nome:"Vintage cake", descricao:"Com fitas de cetim", ordem:20, preco_pp:50, preco_p:60, preco_m:70, preco_g:88, so_modelo:"mod_chant" },
  { id:"dec_escrita", grupo:"decoracao", nome:"Espatulado com escrita", ordem:30, preco_pp:45, preco_p:55, preco_m:65, preco_g:70, so_modelo:"mod_chant" },
  { id:"dec_bico", grupo:"decoracao", nome:"Espatulado com detalhes de bico", ordem:40, preco_pp:58, preco_p:68, preco_m:78, preco_g:88, so_modelo:"mod_chant" },
  { id:"acb_brilho", grupo:"acabamento", nome:"Glitter, pérolas ou dragées", ordem:10, preco_pp:45, preco_p:55, preco_m:68, preco_g:78, so_modelo:"mod_chant" }
];

/* Os sabores da casa são atalhos: cada um já escolhe o recheio certo.
   camadas: de cima para baixo, as cores do recheio que aparecem na fatia. */
const MASSA_COR = "#E9C7A2", CREME = "#FFF8F1";
const SABORES_CASA = [
  { tipo:"combinacao", id:"cmb_perfeito", camadas:["#5A3326", "#FFF6EA"] },
  { tipo:"combinacao", id:"cmb_classico", camadas:["#FFF3DF", "#5A3326"] },
  { tipo:"combinacao", id:"cmb_brownie",  camadas:["#FFF6EA", "#3E2219"], pedacos:true },
  { tipo:"recheio",    id:"rec_kinder",   camadas:["#F4E3CC", "#7A4A2E"] }
];

/* Uma fatia de bolo em SVG: cobertura, massa, recheio, massa, recheio, massa. */
function fatiaSVG(sc){
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "4 6 40 38"); svg.setAttribute("width", "54"); svg.setAttribute("height", "51");
  svg.setAttribute("aria-hidden", "true"); svg.setAttribute("class", "fatia");
  const cl = document.createElementNS(ns, "clipPath"); cl.setAttribute("id", "cl-" + sc.id);
  const cr = document.createElementNS(ns, "rect");
  cr.setAttribute("x", "6"); cr.setAttribute("y", "8"); cr.setAttribute("width", "36"); cr.setAttribute("height", "34"); cr.setAttribute("rx", "2");
  cl.appendChild(cr); svg.appendChild(cl);
  const g = document.createElementNS(ns, "g"); g.setAttribute("clip-path", "url(#cl-" + sc.id + ")");
  svg.appendChild(g);
  const add = (y, h, cor) => { const e = document.createElementNS(ns, "rect");
    e.setAttribute("x", "6"); e.setAttribute("y", y); e.setAttribute("width", "36"); e.setAttribute("height", h);
    e.setAttribute("fill", cor); g.appendChild(e); };
  add(8, 5, CREME);
  add(13, 7, MASSA_COR);
  add(20, 4, sc.camadas[0]);
  add(24, 7, MASSA_COR);
  add(31, 4, sc.camadas[1]);
  add(35, 7, MASSA_COR);
  if(sc.pedacos){
    [[9,20.6],[16,21.4],[24,20.8],[31,21.2],[37,20.6],[11,31.4],[20,30.8],[28,31.5],[35,31]].forEach(([x,y]) => {
      const c = document.createElementNS(ns, "rect");
      c.setAttribute("x", x); c.setAttribute("y", y); c.setAttribute("width", "2.6"); c.setAttribute("height", "2.6");
      c.setAttribute("rx", ".6"); c.setAttribute("fill", "#3E2219"); g.appendChild(c);
    });
  }
  const borda = document.createElementNS(ns, "rect");
  borda.setAttribute("x", "6.5"); borda.setAttribute("y", "8.5"); borda.setAttribute("width", "35"); borda.setAttribute("height", "33");
  borda.setAttribute("rx", "7.5"); borda.setAttribute("fill", "none"); borda.setAttribute("stroke", "rgba(78,47,42,.12)");
  svg.appendChild(borda);
  return svg;
}

let OPC = [];
const S = {
  tamanho:null, modelo:null, massa:null,
  modo:"recheio", recheio:null, combinacao:null, escolha:null,
  adicionais:new Set(), decoracao:null, acabamento:false,
  forma:"retirada", cor:null
};
let ENVIANDO = false;
let CARDAPIO_DA_RESERVA = false;

/* Amostras de cor do chantininho. "Outra" abre o campo de texto. */
const CORES = [
  { id:"branco",     nome:"Branco",      hex:"#FFFFFF" },
  { id:"marfim",     nome:"Marfim",      hex:"#F6EEDC" },
  { id:"rosa-bebe",  nome:"Rosa bebê",   hex:"#F6CFD4" },
  { id:"pessego",    nome:"Pêssego",     hex:"#F7D2B8" },
  { id:"lilas",      nome:"Lilás",       hex:"#D9C8EA" },
  { id:"azul-bebe",  nome:"Azul bebê",   hex:"#C9DDEF" },
  { id:"verde-menta",nome:"Verde menta", hex:"#CFE6D6" },
  { id:"amarelo",    nome:"Amarelo manteiga", hex:"#F7E7B3" },
  { id:"outra",      nome:"Outra cor",   hex:null }
];
function corEscolhida(){
  if(!S.cor) return "";
  if(S.cor === "outra") return $("cor").value.trim();
  return (CORES.find(c => c.id === S.cor) || {}).nome || "";
}
function desenharCores(){
  const cx = $("cores"); if(!cx) return;
  cx.innerHTML = "";
  CORES.forEach(c => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "cor" + (S.cor === c.id ? " on" : "") + (c.hex ? "" : " outra");
    b.setAttribute("aria-pressed", String(S.cor === c.id));
    b.setAttribute("aria-label", c.nome);
    const am = document.createElement("i"); if(c.hex) am.style.background = c.hex; else am.textContent = "+";
    const n = document.createElement("span"); n.textContent = c.nome;
    b.append(am, n);
    b.onclick = () => { S.cor = c.id; atualizar(); if(c.id === "outra") setTimeout(() => $("cor").focus(), 50); };
    cx.appendChild(b);
  });
  $("lbCor").classList.toggle("hide", S.cor !== "outra");
}

const grupo = g => OPC.filter(o => o.grupo === g).sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
const achar = id => OPC.find(o => o.id === id) || null;
function preco(op, tam){
  if(!op || !tam) return 0;
  return Number(op["preco_" + tam.replace("tam_", "")] || 0);
}

/* ---------------- carregar ---------------- */
async function carregarCardapio(){
  try {
    const J = window.JB.supabase;
    const r = await fetch(J.url + "/rest/v1/jb_bolo_opcao?select=*&ativo=eq.true&order=grupo,ordem", {
      headers: { apikey: J.chave }
    });
    if(!r.ok) throw new Error(String(r.status));
    const d = await r.json();
    if(!Array.isArray(d) || !d.length) throw new Error("vazio");
    OPC = d.map(o => ({ ...o, detalhe: o.detalhe || null }));
  } catch(e){
    OPC = CARDAPIO_RESERVA;
    CARDAPIO_DA_RESERVA = true;
  }
}

/* ---------------- desenhar ---------------- */
function opcao({ tipo, nome, valor, marcado, titulo, sub, direita, classe, premium, aoMudar }){
  const lb = document.createElement("label");
  lb.className = "op" + (tipo === "checkbox" ? " caixa" : "") + (classe ? " " + classe : "") + (marcado ? " on" : "");
  const inp = document.createElement("input");
  inp.type = tipo; inp.name = nome; inp.value = valor; inp.checked = !!marcado;
  inp.addEventListener("change", () => aoMudar(inp.checked));
  const m = document.createElement("span"); m.className = "marca-op"; m.setAttribute("aria-hidden", "true");
  const tx = document.createElement("span"); tx.className = "tx";
  const b = document.createElement("b"); b.textContent = titulo;
  if(premium){ const p = document.createElement("span"); p.className = "premium"; p.textContent = "premium"; b.appendChild(p); }
  tx.appendChild(b);
  if(sub){ const s = document.createElement("span"); s.textContent = sub; tx.appendChild(s); }
  lb.append(inp, m, tx);
  if(direita != null){ const d = document.createElement("span"); d.className = "pr"; d.textContent = direita; lb.appendChild(d); }
  return lb;
}

/* preço de um adicional, com o tamanho escolhido ou "a partir de" */
function rotuloPreco(op, base){
  const semTam = !S.tamanho;
  const v = semTam ? Math.min(preco(op, "tam_pp"), preco(op, "tam_g")) : preco(op, S.tamanho);
  if(!v) return base ? "" : "incluso";
  return (base ? "" : "+ ") + (semTam ? "a partir de " : "") + reais(v).replace(",00", "");
}

/* Os sabores da casa moram no passo 04: cartões com o acréscimo já no tamanho
   escolhido. Escolher um cartão é o mesmo que escolher o recheio. */
function desenharCasa(){
  const cx = $("casa"); cx.innerHTML = "";
  SABORES_CASA.forEach(sc => {
    const op = achar(sc.id);
    if(!op) return;
    const on = sc.tipo === "combinacao" ? S.combinacao === sc.id : S.recheio === sc.id;
    const b = document.createElement("button");
    b.type = "button"; b.className = "sabor" + (on ? " on" : "");
    b.dataset.id = sc.id;
    b.setAttribute("aria-pressed", String(on));
    const t = document.createElement("b"); t.textContent = op.nome;
    const d = document.createElement("span");
    d.textContent = op.descricao || (sc.tipo === "recheio" ? "Recheio premium de Kinder Bueno" : "");
    const pr = document.createElement("span"); pr.className = "pr";
    pr.textContent = rotuloPreco(op);
    b.append(t, d, pr);
    b.onclick = () => escolherSaborDaCasa(sc);
    cx.appendChild(b);
  });
  /* duo brownie: escolher o creme logo abaixo dos cartões */
  const velho = cx.parentNode.querySelector(".casa + .sub-escolha");
  if(velho) velho.remove();
  const combo = achar(S.combinacao);
  if(combo && combo.detalhe && combo.detalhe.escolha){
    const sub = document.createElement("div"); sub.className = "sub-escolha";
    sub.setAttribute("role", "group"); sub.setAttribute("aria-label", "Escolha o creme do " + combo.nome);
    combo.detalhe.escolha.forEach(e => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = e;
      b.setAttribute("aria-pressed", String(S.escolha === e));
      b.onclick = () => { S.escolha = e; atualizar(); };
      sub.appendChild(b);
    });
    cx.after(sub);
  }
}

function desenharTamanhos(){
  const cx = $("opTamanho"); cx.innerHTML = "";
  grupo("tamanho").forEach(o => {
    const d = o.detalhe || {};
    const lb = opcao({
      tipo:"radio", nome:"tamanho", valor:o.id, marcado:S.tamanho === o.id, classe:"tam",
      titulo:"", sub:(d.fatias ? d.fatias + " fatias" : "")
        + (d.cm ? "\n" + d.cm + "cm" : "") + (d.kg ? " · " + String(d.kg).replace(".", ",") + "kg" : ""),
      aoMudar: v => { if(v){ S.tamanho = o.id; atualizar(); } }
    });
    const big = document.createElement("span"); big.className = "big"; big.textContent = o.nome;
    lb.querySelector(".tx b").replaceWith(big);
    cx.appendChild(lb);
  });
}

function desenharModelos(){
  const cx = $("opModelo"); cx.innerHTML = "";
  grupo("modelo").forEach(o => {
    const lb = opcao({
      tipo:"radio", nome:"modelo", valor:o.id, marcado:S.modelo === o.id,
      titulo:o.nome, sub:o.descricao,
      aoMudar: v => { if(v){ S.modelo = o.id; atualizar(); } }
    });
    const p = document.createElement("span");
    p.className = "valor-modelo";
    p.textContent = S.tamanho ? reais(preco(o, S.tamanho)).replace(",00", "") : "desde " + reais(preco(o, "tam_pp")).replace(",00", "");
    lb.querySelector(".tx").appendChild(p);
    cx.appendChild(lb);
  });
}

function desenharLista(cxId, g, nomeInput, chave){
  const cx = $(cxId); cx.innerHTML = "";
  const daCasa = SABORES_CASA.map(sc => sc.id);
  grupo(g).filter(o => g !== "recheio" || !daCasa.includes(o.id)).forEach(o => {
    const v = preco(o, S.tamanho || "tam_pp");
    cx.appendChild(opcao({
      tipo:"radio", nome:nomeInput, valor:o.id, marcado:S[chave] === o.id,
      titulo:o.nome, sub:o.descricao, premium:o.premium,
      direita: v ? rotuloPreco(o) : null,
      aoMudar: x => { if(x){ S[chave] = o.id; if(chave === "recheio"){ S.combinacao = null; S.escolha = null; } atualizar(); } }
    }));
    /* duo brownie: escolher o creme */
    if(g === "combinacao" && o.detalhe && o.detalhe.escolha && S.combinacao === o.id){
      const sub = document.createElement("div"); sub.className = "sub-escolha";
      sub.setAttribute("role", "group"); sub.setAttribute("aria-label", "Escolha o creme do " + o.nome);
      o.detalhe.escolha.forEach(e => {
        const b = document.createElement("button");
        b.type = "button"; b.textContent = e;
        b.setAttribute("aria-pressed", String(S.escolha === e));
        b.onclick = () => { S.escolha = e; atualizar(); };
        sub.appendChild(b);
      });
      cx.appendChild(sub);
    }
  });
}

function desenharAdicionais(){
  const cx = $("opAdicional"); cx.innerHTML = "";
  grupo("adicional").forEach(o => {
    cx.appendChild(opcao({
      tipo:"checkbox", nome:"adicional", valor:o.id, marcado:S.adicionais.has(o.id),
      titulo:o.nome, direita:rotuloPreco(o),
      aoMudar: v => { v ? S.adicionais.add(o.id) : S.adicionais.delete(o.id); atualizar(); }
    }));
  });
}

function desenharDecoracao(){
  const cx = $("opDecoracao");
  const esc = $("lbEscrita");
  cx.parentNode.insertBefore(esc, cx);   // tira de dentro antes de limpar
  cx.innerHTML = "";
  cx.appendChild(opcao({
    tipo:"radio", nome:"decoracao", valor:"", marcado:!S.decoracao,
    titulo:"Liso, só a cor", sub:"Já incluso no chantininho", direita:"incluso",
    aoMudar: v => { if(v){ S.decoracao = null; atualizar(); } }
  }));
  grupo("decoracao").forEach(o => {
    cx.appendChild(opcao({
      tipo:"radio", nome:"decoracao", valor:o.id, marcado:S.decoracao === o.id,
      titulo:o.nome, sub:o.descricao, direita:rotuloPreco(o),
      aoMudar: v => { if(v){ S.decoracao = o.id; atualizar(); } }
    }));
    if(o.id === "dec_escrita") cx.appendChild($("lbEscrita"));
  });
  const ax = $("opAcabamento"); ax.innerHTML = "";
  grupo("acabamento").forEach(o => {
    ax.appendChild(opcao({
      tipo:"checkbox", nome:"acabamento", valor:o.id, marcado:S.acabamento,
      titulo:o.nome, sub:"Por cima de qualquer decoração", direita:rotuloPreco(o),
      aoMudar: v => { S.acabamento = v; atualizar(); }
    }));
  });
}

function desenharForma(){
  const cx = $("opForma"); cx.innerHTML = "";
  [
    { v:"retirada", t:"Retiro no ateliê", s:window.JB.endereco + ", " + window.JB.bairro.split(",")[0] },
    { v:"uber", t:"Vou mandar um Uber Flash", s:"Chame na categoria carro: bolo não viaja bem de moto. A corrida é por sua conta." }
  ].forEach(f => cx.appendChild(opcao({
    tipo:"radio", nome:"forma", valor:f.v, marcado:S.forma === f.v, titulo:f.t, sub:f.s,
    aoMudar: x => { if(x){ S.forma = f.v; atualizar(); } }
  })));
}

/* ---------------- data e hora ---------------- */
/* O primeiro instante possível é agora + 48h. Os horários de retirada vêm da config. */
function minimoRetirada(){
  return new Date(agoraSP().instante.getTime() + window.JB.antecedenciaHoras * 3600e3);
}
function dataSP(d){
  return new Intl.DateTimeFormat("en-CA", { timeZone:"America/Sao_Paulo", year:"numeric", month:"2-digit", day:"2-digit" }).format(d);
}
function instanteDe(data, min){
  return new Date(data + "T" + horaDe(min) + ":00-03:00");
}
function diaDaSemana(data){
  return new Date(data + "T12:00:00-03:00").getUTCDay();
}
function horariosDoDia(data){
  const j = window.JB.retirada[diaDaSemana(data)];
  if(!j) return [];
  const lim = minimoRetirada().getTime();
  const out = [];
  for(let m = j[0]; m <= j[1]; m += 30){
    out.push({ min:m, ok: instanteDe(data, m).getTime() >= lim });
  }
  return out;
}
function primeiraDataPossivel(){
  let d = dataSP(minimoRetirada());
  for(let i = 0; i < 10; i++){
    if(horariosDoDia(d).some(h => h.ok)) return d;
    const x = new Date(d + "T12:00:00-03:00"); x.setUTCDate(x.getUTCDate() + 1);
    d = dataSP(x);
  }
  return d;
}
function montarHoras(){
  const data = $("data").value;
  const sel = $("hora");
  const antes = sel.value;
  sel.innerHTML = "";
  if(!data){ sel.innerHTML = '<option value="">escolha o dia</option>'; return; }
  const hs = horariosDoDia(data).filter(h => h.ok);
  if(!hs.length){
    sel.innerHTML = '<option value="">sem horário</option>';
    return;
  }
  const o0 = document.createElement("option"); o0.value = ""; o0.textContent = "escolha"; sel.appendChild(o0);
  hs.forEach(h => {
    const o = document.createElement("option"); o.value = String(h.min); o.textContent = horaDe(h.min);
    sel.appendChild(o);
  });
  if(hs.some(h => String(h.min) === antes)) sel.value = antes;
}
function descreverData(data){
  const [a, m, d] = data.split("-");
  return DIAS[diaDaSemana(data)].toLowerCase() + ", " + d + "/" + m;
}

/* ---------------- a conta ---------------- */
function conta(){
  const t = S.tamanho, linhas = [];
  if(!t || !S.modelo) return null;
  const tam = achar(t), mod = achar(S.modelo);
  const d = tam.detalhe || {};
  linhas.push({ nome:"Tamanho " + tam.nome + ", " + (d.cm ? d.cm + "cm" : tam.descricao)
                 + (d.fatias ? " (" + d.fatias + " fatias)" : ""), valor:null, det:true });
  linhas.push({ nome:mod.nome, valor:preco(mod, t) });
  if(S.massa){ const o = achar(S.massa); linhas.push({ nome:"Massa " + o.nome.toLowerCase(), valor:preco(o, t) }); }
  if(S.modo === "recheio" && S.recheio){
    const o = achar(S.recheio); linhas.push({ nome:"Recheio " + o.nome.toLowerCase(), valor:preco(o, t) });
  }
  if(S.modo === "combinacao" && S.combinacao){
    const o = achar(S.combinacao);
    linhas.push({ nome:o.nome + (S.escolha ? ", com " + S.escolha.toLowerCase() : ""), valor:preco(o, t) });
  }
  grupo("adicional").filter(o => S.adicionais.has(o.id)).forEach(o => linhas.push({ nome:o.nome, valor:preco(o, t) }));
  if(S.modelo === "mod_chant"){
    if(S.decoracao){ const o = achar(S.decoracao); linhas.push({ nome:o.nome, valor:preco(o, t) }); }
    if(S.acabamento){ const o = grupo("acabamento")[0]; if(o) linhas.push({ nome:o.nome, valor:preco(o, t) }); }
  }
  const total = linhas.reduce((s, l) => s + (l.valor || 0), 0);
  return { linhas, total, sinal: Math.round(total * 50) / 100 };
}

/* ---------------- atualizar tudo ---------------- */
function atualizar(){
  const foco = document.activeElement;
  const lembrar = foco && foco.matches && foco.matches(".op input") ? { n: foco.name, v: foco.value } : null;
  const chant = S.modelo === "mod_chant";
  if(!chant){ S.decoracao = null; S.acabamento = false; }
  S.modo = S.combinacao ? "combinacao" : "recheio";

  desenharTamanhos();
  desenharModelos();
  desenharLista("opMassa", "massa", "massa", "massa");
  desenharCasa();
  desenharLista("opRecheio", "recheio", "recheio", "recheio");
  desenharAdicionais();
  if(chant) desenharDecoracao();
  if(chant) desenharCores();
  desenharForma();
  if($("avisoReserva")) $("avisoReserva").classList.toggle("hide", !CARDAPIO_DA_RESERVA);

  $("etDecoracao").classList.toggle("hide", !chant);
  $("nRetirada").textContent = chant ? "07" : "06";
  $("nDados").textContent = chant ? "08" : "07";
  $("lbEscrita").classList.toggle("hide", S.decoracao !== "dec_escrita");

  pintarResumo();
  if(lembrar){
    const el = [...document.querySelectorAll('.op input[name="' + lembrar.n + '"]')].find(i => i.value === lembrar.v);
    if(el) el.focus({ preventScroll:true });
  }
}

/* o botão diz quanto (como na Ladurée): "Enviar pedido · R$ 712,00" */
function textoEnviar(){
  const c = conta();
  return c ? "Enviar pedido · " + reais(c.total) : "Enviar pedido pelo WhatsApp";
}

function pintarResumo(){
  const c = conta();
  if(!ENVIANDO) $("enviar").textContent = textoEnviar();
  const box = $("resumoLinhas");
  box.innerHTML = "";
  $("totais").classList.toggle("hide", !c);
  pintarBarra();
  if(!c){
    box.innerHTML = '<p class="vazio">Escolha o tamanho e o modelo para ver o valor.</p>';
    return;
  }
  c.linhas.forEach(l => {
    const d = document.createElement("div"); d.className = "ln" + (l.det ? " det" : "");
    const a = document.createElement("span"); a.textContent = l.nome;
    const b = document.createElement("span"); b.textContent = l.valor == null ? "" : (l.valor ? reais(l.valor) : "incluso");
    d.append(a, b); box.appendChild(d);
  });
  $("total").textContent = reais(c.total);
  $("sinal").textContent = reais(c.sinal);
  $("barraTotal").textContent = reais(c.total);
  $("avisoOrc").classList.toggle("hide", !(S.modelo === "mod_chant" && $("outro").value.trim()));
}

/* ---------------- sabores da casa ---------------- */
function escolherSaborDaCasa(sc){
  if(sc.tipo === "combinacao"){ S.combinacao = sc.id; S.recheio = null; S.escolha = null; }
  else { S.recheio = sc.id; S.combinacao = null; S.escolha = null; }
  atualizar();
}

/* ---------------- conferir antes de mandar ---------------- */
function faltando(){
  const f = [];
  const marca = (id, cond) => { $(id).classList.toggle("falta", cond); if(cond) f.push(id); };
  marca("etTamanho", !S.tamanho);
  marca("etModelo", !S.modelo);
  marca("etMassa", !S.massa);
  const semRecheio = S.modo === "recheio" ? !S.recheio
    : (!S.combinacao || ((achar(S.combinacao) || {}).detalhe && achar(S.combinacao).detalhe.escolha && !S.escolha));
  marca("etRecheio", semRecheio);
  const semEscrita = S.modelo === "mod_chant" && S.decoracao === "dec_escrita" && !$("escrita").value.trim();
  $("lbEscrita").classList.toggle("falta", semEscrita);
  if(semEscrita) f.push("etDecoracao");
  const semData = !$("data").value || !$("hora").value;
  $("data").closest(".campo").classList.toggle("falta", !$("data").value);
  $("hora").closest(".campo").classList.toggle("falta", !$("hora").value);
  if(semData) f.push("etRetirada");
  const nome = $("nome").value.trim();
  const whats = $("whats").value.replace(/\D/g, "");
  $("nome").closest(".campo").classList.toggle("falta", nome.length < 2);
  $("whats").closest(".campo").classList.toggle("falta", !/^(55)?\d{10,11}$/.test(whats));
  if(nome.length < 2 || !/^(55)?\d{10,11}$/.test(whats)) f.push("etDados");
  return f;
}

const RECADOS = {
  antecedencia: "Esse horário ficou a menos de 48 horas. Escolha um pouco mais para frente.",
  limite: "Recebemos várias encomendas desse número hoje. Fale com a gente direto no WhatsApp.",
  whats: "Confira o número do WhatsApp, com DDD.",
  nome: "Escreva o seu nome.",
  escrita: "Conte o que vai escrito no bolo.",
  combinacao: "Escolha o creme do Duo brownie."
};

function mensagem(c, codigo){
  const data = $("data").value, min = Number($("hora").value);
  const L = [];
  L.push("Oi, Jessica! Quero encomendar um bolo :)");
  L.push("");
  if(codigo) L.push("*Pedido " + codigo + "*");
  L.push("Retirada: " + descreverData(data) + " às " + horaDe(min));
  L.push(S.forma === "uber" ? "Como: vou mandar um Uber Flash (carro)" : "Como: retiro no ateliê");
  L.push("");
  L.push("*O bolo*");
  c.linhas.forEach(l => L.push(l.nome + (l.valor ? ": " + reais(l.valor) : "")));
  if(S.modelo === "mod_chant" && corEscolhida()) L.push("Cor do chantininho: " + corEscolhida());
  if(S.decoracao === "dec_escrita" && $("escrita").value.trim()) L.push("Escrita: “" + $("escrita").value.trim() + "”");
  L.push("");
  L.push("*Total: " + reais(c.total) + "*");
  L.push("Sinal de 50% para reservar a data: " + reais(c.sinal));
  const outro = S.modelo === "mod_chant" ? $("outro").value.trim() : "";
  if(outro){ L.push(""); L.push("Quero algo diferente (orçamento): " + outro); }
  const oc = $("ocasiao").value.trim(), ob = $("obs").value.trim();
  if(oc || ob) L.push("");
  if(oc) L.push("Ocasião: " + oc);
  if(ob) L.push("Observações: " + ob);
  L.push("");
  L.push("Nome: " + $("nome").value.trim());
  return L.join("\n");
}

async function enviar(ev){
  ev.preventDefault();
  if(ENVIANDO) return;
  $("erro").classList.add("hide");
  const f = faltando();
  if(f.length){
    $("erro").textContent = "Falta pouco: confira o que ficou marcado em coral.";
    $("erro").classList.remove("hide");
    $(f[0]).scrollIntoView({ behavior:"smooth", block:"start" });
    return;
  }
  const c = conta();
  const chant = S.modelo === "mod_chant";
  const payload = {
    nome: $("nome").value.trim(),
    whats: $("whats").value,
    retirada_em: instanteDe($("data").value, Number($("hora").value)).toISOString(),
    forma: S.forma,
    tamanho: S.tamanho, modelo: S.modelo, massa: S.massa,
    recheio: S.modo === "recheio" ? S.recheio : null,
    combinacao: S.modo === "combinacao" ? S.combinacao : null,
    combinacao_escolha: S.modo === "combinacao" ? S.escolha : null,
    adicionais: [...S.adicionais],
    decoracao: chant ? S.decoracao : null,
    acabamento: chant && S.acabamento ? (grupo("acabamento")[0] || {}).id : null,
    cor: chant ? corEscolhida() : null,
    escrita: chant && S.decoracao === "dec_escrita" ? $("escrita").value.trim() : null,
    ocasiao: $("ocasiao").value.trim(),
    obs: [$("obs").value.trim(), chant && $("outro").value.trim() ? "Algo diferente: " + $("outro").value.trim() : ""].filter(Boolean).join(" | "),
    orcamento: chant && !!$("outro").value.trim(),
    origem: new URLSearchParams(location.search).get("utm_source") || "site"
  };

  ENVIANDO = true;
  marcar("enviar_pedido", (S.modelo || "") + " " + (S.tamanho || "") + " " + Math.round(c.total));
  const bt = $("enviar"); bt.disabled = true; bt.textContent = "Registrando seu pedido...";
  let codigo = null, total = c.total, sinal = c.sinal, falhouRede = false;
  try {
    const J = window.JB.supabase;
    const r = await fetch(J.url + "/rest/v1/rpc/jb_encomenda_criar", {
      method: "POST",
      headers: { apikey: J.chave, "Content-Type": "application/json" },
      body: JSON.stringify({ p: payload })
    });
    const d = await r.json().catch(() => ({}));
    if(!r.ok){
      const k = String(d.message || "");
      if(RECADOS[k]){
        $("erro").textContent = RECADOS[k];
        $("erro").classList.remove("hide");
        ENVIANDO = false; bt.disabled = false; bt.textContent = textoEnviar();
        return;
      }
      falhouRede = true;
    } else {
      codigo = d.codigo; total = Number(d.total); sinal = Number(d.sinal);
    }
  } catch(e){
    falhouRede = true;
  }

  /* O preço que vale é o do banco. Se por algum motivo ele diferir do da tela, a mensagem usa o do banco. */
  const cc = { ...c, total, sinal };
  const link = linkWhats(mensagem(cc, codigo));
  mostrarFeito(codigo, sinal, link, falhouRede);
  ENVIANDO = false; bt.disabled = false; bt.textContent = textoEnviar();
  /* abre o WhatsApp na mesma aba: depois de um await, abrir janela nova é bloqueado no celular */
  if(!window.__NAO_ABRIR) location.href = link;
}

function mostrarFeito(codigo, sinal, link, falhou){
  $("monta").classList.add("hide");
  document.querySelectorAll(".capa,.passos,.bloco:not(#monta)").forEach(e => e.classList.add("hide"));
  $("barra").classList.add("hide");
  $("feito").classList.remove("hide");
  $("feitoNome").textContent = $("nome").value.trim().split(" ")[0];
  $("feitoCodigo").textContent = codigo ? "Pedido " + codigo : "";
  $("feitoCodigo").classList.toggle("hide", !codigo);
  $("feitoTexto").textContent = (falhou
      ? "Não conseguimos registrar agora, mas o seu pedido está todo escrito na mensagem do WhatsApp. É só enviar. "
      : "O seu pedido já chegou para a Jessica. ")
    + "Ela te responde no WhatsApp para confirmar e manda a chave Pix do sinal de " + reais(sinal)
    + ". A data fica reservada assim que o sinal cair.";
  $("feitoWhats").href = link;
  window.scrollTo({ top:0, behavior:"smooth" });
  $("feito").focus({ preventScroll:true });
}

/* ---------------- ligar ---------------- */
async function iniciar(){
  $("rodEnd").textContent = window.JB.endereco;
  if($("rodCnpj")) $("rodCnpj").textContent = window.JB.cnpj || "";
  medirCliques({ rodWhats:"whatsapp", navWhats:"whatsapp", menuWhats:"whatsapp", barraIr:"barra" });
  document.querySelectorAll(".comecar").forEach(a => a.addEventListener("click", () => marcar("comecar_bolo")));
  /* os chips de ocasião já preenchem o campo do passo final e levam ao montador */
  document.querySelectorAll(".ocasioes button").forEach(b => b.addEventListener("click", () => {
    $("ocasiao").value = b.textContent.trim().toLowerCase();
    document.querySelectorAll(".ocasioes button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
    marcar("comecar_bolo", b.textContent.trim());
    $("monta").scrollIntoView({ behavior:"smooth", block:"start" });
  }));
  await carregarCardapio();

  const d0 = primeiraDataPossivel();
  if($("retiradaTx")) $("retiradaTx").textContent = "No ateliê, na " + window.JB.endereco + ", de segunda a sábado das "
    + horaCurta(window.JB.retirada[1][0]) + " às " + horaCurta(window.JB.retirada[1][1]) + " e domingo das "
    + horaCurta(window.JB.retirada[0][0]) + " às " + horaCurta(window.JB.retirada[0][1])
    + ". Se preferir, envie um Uber Flash na categoria carro: bolo não viaja bem de moto, e a corrida fica por sua conta.";
  if($("proxData")) $("proxData").textContent = "Próximo dia disponível: " + descreverData(d0);
  if($("porcoes")) $("porcoes").textContent = grupo("tamanho").map(o => { const d = o.detalhe || {};
    return o.nome + ": " + (d.cm ? d.cm + " cm, " : "") + (d.fatias ? "cerca de " + d.fatias + " fatias" : "") + (d.kg ? ", " + String(d.kg).replace(".", ",") + " kg" : ""); }).join(" · ") + ".";
  $("data").min = d0;
  const max = new Date(agoraSP().instante.getTime() + 120 * 864e5);
  $("data").max = dataSP(max);
  $("notaData").textContent = "A partir de " + descreverData(d0) + ". Retiradas de segunda a sábado das "
    + horaCurta(window.JB.retirada[1][0]) + " às " + horaCurta(window.JB.retirada[1][1])
    + ", domingo das " + horaCurta(window.JB.retirada[0][0]) + " às " + horaCurta(window.JB.retirada[0][1]) + ".";
  $("data").addEventListener("change", () => {
    if($("data").value && $("data").value < d0){ $("data").value = d0; toast("Precisamos de 48 horas. Ajustei para o primeiro dia possível."); }
    montarHoras();
  });

  $("outro").addEventListener("input", pintarResumo);
  $("monta").addEventListener("submit", enviar);
  $("barraIr").onclick = () => $(conta() ? "resumo" : proximaEtapa()).scrollIntoView({ behavior:"smooth", block:"start" });
  $("outroPedido").onclick = () => location.reload();

  if("IntersectionObserver" in window){
    new IntersectionObserver(es => {
      RESUMO_VISIVEL = es.some(e => e.isIntersecting);
      pintarBarra();
    }, { threshold: 0.15 }).observe($("resumo"));
  }

  atualizar();
  window.__PRONTO = true;
}
let RESUMO_VISIVEL = false;
/* A barra aparece desde o começo: "a partir de" até ter tamanho e modelo, depois o total. */
function aPartirDe(){
  const mods = grupo("modelo");
  const tams = S.tamanho ? [S.tamanho] : grupo("tamanho").map(t => t.id);
  const lista = (S.modelo ? [achar(S.modelo)] : mods).filter(Boolean);
  let min = Infinity;
  lista.forEach(m => tams.forEach(t => { const v = preco(m, t); if(v && v < min) min = v; }));
  return isFinite(min) ? min : 0;
}
function proximaEtapa(){
  if(!S.tamanho) return "etTamanho";
  if(!S.modelo) return "etModelo";
  return "resumo";
}
function pintarBarra(){
  const c = conta();
  const feito = !$("feito").classList.contains("hide");
  const inicio = !c && aPartirDe() > 0;
  $("barra").classList.toggle("hide", feito || RESUMO_VISIVEL || (!c && !inicio));
  $("barraK").textContent = c ? "Total" : "A partir de";
  $("barraTotal").textContent = reais(c ? c.total : aPartirDe());
  $("barraIr").textContent = c ? "Revisar pedido" : "Começar";
}
iniciar();
