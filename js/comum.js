/* Pedaços usados pelas duas páginas. */
const $ = id => document.getElementById(id);

const DIAS = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const DIAS_CURTOS = ["dom","seg","ter","qua","qui","sex","sáb"];

function reais(v){
  return "R$ " + Number(v || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function horaDe(min){
  const h = Math.floor(min / 60), m = min % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}
function horaCurta(min){
  const h = Math.floor(min / 60), m = min % 60;
  return h + "h" + (m ? String(m).padStart(2, "0") : "");
}

/* O relógio de São Paulo, não o do celular do cliente. Os testes fingem outra hora. */
function agoraSP(){
  const base = window.__AGORA ? new Date(window.__AGORA) : new Date();
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false, weekday: "short"
  }).formatToParts(base).reduce((o, x) => (o[x.type] = x.value, o), {});
  const dias = { Sun:0, Mon:1, Tue:2, Wed:3, Thu:4, Fri:5, Sat:6 };
  return {
    instante: base,
    data: p.year + "-" + p.month + "-" + p.day,
    dia: dias[p.weekday],
    min: (Number(p.hour) % 24) * 60 + Number(p.minute)
  };
}

function linkWhats(texto){
  return "https://wa.me/" + window.JB.whats + "?text=" + encodeURIComponent(texto);
}

let TOAST_T = null;
function toast(texto){
  const t = $("toast"); if(!t) return;
  t.textContent = texto; t.classList.add("on");
  clearTimeout(TOAST_T);
  TOAST_T = setTimeout(() => t.classList.remove("on"), 2600);
}

async function copiar(texto, recado){
  try {
    await navigator.clipboard.writeText(texto);
  } catch(e){
    const ta = document.createElement("textarea");
    ta.value = texto; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); } catch(_){}
    ta.remove();
  }
  toast(recado || "Copiado.");
}

/* Junta os dias com o mesmo horário: "Segunda a sábado 11h às 22h45". */
function montarHorarios(dl, horario){
  const H = horario || window.JB.horario;
  const ordem = [1,2,3,4,5,6,0];
  const grupos = [];
  ordem.forEach(d => {
    const h = H[d];
    const chave = h ? h.join("-") : "fechado";
    const ult = grupos[grupos.length - 1];
    if(ult && ult.chave === chave) ult.dias.push(d);
    else grupos.push({ chave, h, dias: [d] });
  });
  dl.innerHTML = "";
  grupos.forEach(g => {
    const dt = document.createElement("dt");
    const a = DIAS[g.dias[0]], b = DIAS[g.dias[g.dias.length - 1]];
    dt.textContent = g.dias.length === 1 ? a : a + " a " + b.toLowerCase();
    const dd = document.createElement("dd");
    dd.textContent = g.h ? horaCurta(g.h[0]) + " às " + horaCurta(g.h[1]) : "fechado";
    dl.append(dt, dd);
  });
}

/* O status do herói fala do DELIVERY, porque o botão ao lado leva ao delivery.
   Usa delivery_horario (o que o Saipos aceita), não o horário do ateliê. */
function pintarStatus(caixa, tx){
  const a = agoraSP();
  const H = window.JB.delivery_horario || window.JB.horario;
  const h = H[a.dia];
  if(h && a.min >= h[0] && a.min < h[1]){
    caixa.classList.add("aberto");
    tx.textContent = "Delivery aberto · até " + horaCurta(h[1]);
    return;
  }
  for(let i = 0; i < 8; i++){
    const d = (a.dia + i) % 7;
    const hh = H[d];
    if(!hh) continue;
    if(i === 0 && a.min >= hh[0]) continue;
    const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS[d].toLowerCase();
    tx.textContent = "Delivery fechado · abre " + quando + " às " + horaCurta(hh[0])
      + (window.JB.delivery_agenda ? " · dá para agendar" : "");
    return;
  }
}

/* Medição leve e anônima: qual botão foi tocado. Nada de cookie, nada de nome.
   Grava em jb_evento_site pelo REST do Supabase; se falhar, ninguém percebe. */
function marcar(evento, detalhe){
  try {
    const J = window.JB.supabase;
    if(!J || !navigator.onLine) return;
    const corpo = JSON.stringify({ pagina: location.pathname.replace(/^\//, "") || "index.html", evento: String(evento).slice(0, 40),
      detalhe: detalhe == null ? null : String(detalhe).slice(0, 80), largura: Math.min(innerWidth, 9999) });
    fetch(J.url + "/rest/v1/jb_evento_site", { method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json", apikey: J.chave, Authorization: "Bearer " + J.chave, Prefer: "return=minimal" },
      body: corpo }).catch(() => {});
  } catch(e){}
}
function medirCliques(mapa){
  Object.entries(mapa).forEach(([id, ev]) => { const el = $(id); if(el) el.addEventListener("click", () => marcar(ev, id)); });
}

/* o menu de três linhas, como no site da clínica */
function ligarMenu(){
  const bt = $("menuBt"), menu = $("menu");
  if(!bt || !menu) return;
  const fechar = () => { menu.classList.add("hide"); bt.setAttribute("aria-expanded", "false"); bt.setAttribute("aria-label", "Abrir o menu"); document.body.style.overflow = ""; };
  bt.onclick = () => {
    const abrir = menu.classList.contains("hide");
    if(!abrir){ fechar(); return; }
    menu.classList.remove("hide"); bt.setAttribute("aria-expanded", "true"); bt.setAttribute("aria-label", "Fechar o menu");
    document.body.style.overflow = "hidden";
  };
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", fechar));
  document.addEventListener("keydown", e => { if(e.key === "Escape") fechar(); });
}

/* cada bloco aparece de leve quando entra na tela */
function ligarSurge(){
  document.documentElement.classList.remove("sem-js");
  const els = document.querySelectorAll(".surge");
  if(!("IntersectionObserver" in window)){ els.forEach(e => e.classList.add("visto")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add("visto"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
  els.forEach(e => io.observe(e));
}
