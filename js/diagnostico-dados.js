/* Diagnóstico de crescimento · formulário de dados (diagnostico-dados.html?c=CODIGO).
   Abre só com o código que a equipe manda depois do pagamento (jb_diagnostico_abrir).
   Salva rascunho no banco e no aparelho; "Enviar para análise" grava com final = true
   (jb_diagnostico_salvar). Enquanto a análise não começa, a cliente pode corrigir. */
(function(){
  const J = window.JB, P = J.parcerias || {}, S = J.supabase;
  const codigo = String(new URLSearchParams(location.search).get("c") || "").trim().toUpperCase();
  const CHAVE = "jb_diag_" + codigo;
  const form = $("formDados");
  const BLOCOS = [["b1","Você e a loja"],["b2","Canais"],["b3","Números"],["b4","Cardápio"],["b5","Promoções"],["b6","Custos"],["b7","Dificuldades"],["b8","Meta"],["b9","Prints"]];
  const PROD = [["nome","Produto","text"],["preco_ifood","Preço iFood","decimal"],["preco_99","Preço 99Food","decimal"],["preco_keeta","Preço Keeta","decimal"],["preco_proprio","Preço direto","decimal"],["custo","Custo por unidade","decimal"],["vendas_mes","Vendidos por mês","numeric"]];
  const OBRIG = [
    ["nome", "lb_nome", "Escreva o seu nome."],
    ["loja", "lb_loja", "Escreva o nome da loja."],
    ["whats", "lb_whats", "Deixe um WhatsApp com DDD para a gente combinar a chamada."],
    ["bairro", "lb_bairro", "Conte a cidade e o bairro da loja."],
    ["venda_m1", "lb_venda_m1", "Coloque quanto vendeu no último mês, mesmo aproximado."],
    ["dor_maior", "lb_dor_maior", "Conte qual é a coisa que você mais quer resolver."],
    ["meta", "lb_meta", "Conte a sua meta para os próximos meses."],
    ["ok_dados", "lb_ok", "Marque a autorização no fim do formulário para enviar."]
  ];

  let mudou = false, timer = null, salvando = false;

  $("rodCnpj").textContent = J.cnpj;
  const email = P.email || "jbconfeitariaparcerias@gmail.com";
  $("lnkEmailDados").textContent = email;
  $("lnkEmailDados").href = "mailto:" + email + "?subject=" + encodeURIComponent("Diagnóstico " + codigo);

  function guardar(k, v){ try { localStorage.setItem(k, JSON.stringify(v)); } catch(e){} }
  function ler(k){ try { return JSON.parse(localStorage.getItem(k) || "null"); } catch(e){ return null; } }

  function semCodigo(texto){
    $("semCodigo").classList.remove("hide");
    if(texto) $("semCodigoTx").textContent = texto;
    $("semCodigoWhats").href = linkWhats("Oi! Estou com dificuldade para abrir o formulário do diagnóstico" + (codigo ? " (" + codigo + ")" : "") + ".");
    $("passos").classList.add("hide");
  }

  async function rpc(nome, corpo){
    const r = await fetch(S.url + "/rest/v1/rpc/" + nome, {
      method: "POST", headers: { apikey: S.chave, "Content-Type": "application/json" }, body: JSON.stringify(corpo)
    });
    const d = await r.json().catch(() => ({}));
    if(!r.ok){ const e = new Error(String(d.message || "rede")); e.codigo = String(d.message || ""); throw e; }
    return d;
  }

  /* produtos: linhas repetidas */
  function linhaProduto(v){
    v = v || {};
    const box = document.createElement("div"); box.className = "produto";
    const g = document.createElement("div"); g.className = "prod-grade";
    PROD.forEach(([k, rot, tipo], i) => {
      const lb = document.createElement("label"); lb.className = "campo";
      if(i === 0) lb.style.gridColumn = "1 / -1";
      lb.append(rot);
      const inp = document.createElement("input");
      inp.dataset.p = k; inp.maxLength = i === 0 ? 80 : 20;
      if(tipo !== "text"){ inp.inputMode = tipo; inp.placeholder = k === "vendas_mes" ? "un" : "R$"; }
      inp.value = v[k] || "";
      lb.appendChild(inp); g.appendChild(lb);
    });
    const tira = document.createElement("button"); tira.type = "button"; tira.className = "tira"; tira.textContent = "tirar";
    tira.onclick = () => { box.remove(); tocou(); botaoMais(); };
    box.append(tira, g);
    $("produtos").appendChild(box);
    botaoMais();
  }
  function botaoMais(){ $("maisProduto").classList.toggle("hide", $("produtos").children.length >= 8); }
  $("maisProduto").onclick = () => { linhaProduto(); tocou(); };

  function coletar(){
    const o = {};
    form.querySelectorAll("[name]").forEach(el => {
      if(el.type === "checkbox"){
        if(!Array.isArray(o[el.name])) o[el.name] = [];
        if(el.checked) o[el.name].push(el.value);
      } else o[el.name] = el.value.trim();
    });
    ["ok_dados","prints_email"].forEach(k => { o[k] = (o[k] || []).length ? "sim" : ""; });
    o.produtos = [...$("produtos").children].map(box => {
      const p = {}; box.querySelectorAll("input[data-p]").forEach(i => p[i.dataset.p] = i.value.trim());
      return p;
    }).filter(p => Object.values(p).some(Boolean));
    o._salvo = new Date().toISOString();
    return o;
  }
  function preencher(o){
    o = o || {};
    form.querySelectorAll("[name]").forEach(el => {
      const v = o[el.name];
      if(el.type === "checkbox"){
        el.checked = Array.isArray(v) ? v.includes(el.value) : v === el.value;
      } else if(v != null) el.value = v;
    });
    $("produtos").innerHTML = "";
    const lista = Array.isArray(o.produtos) && o.produtos.length ? o.produtos : [{}, {}, {}];
    lista.slice(0, 8).forEach(linhaProduto);
    marcarPassos();
  }

  function marcarPassos(){
    const ul = $("passos"); ul.innerHTML = "";
    BLOCOS.forEach(([id, nome]) => {
      const b = $(id);
      const tem = [...b.querySelectorAll("input,select,textarea")].some(el => el.type === "checkbox" ? el.checked : el.value.trim());
      const li = document.createElement("li"); const a = document.createElement("a");
      a.href = "#" + id; a.textContent = nome; if(tem) a.className = "ok";
      li.appendChild(a); ul.appendChild(li);
    });
  }

  function tocou(){
    mudou = true;
    guardar(CHAVE, coletar());
    $("salvo").textContent = "Salvo neste aparelho.";
    clearTimeout(timer);
    timer = setTimeout(() => salvar(false, true), 8000);
  }
  form.addEventListener("input", ev => {
    const c = ev.target.closest(".campo"); if(c) c.classList.remove("falta");
    const l = ev.target.closest("label"); if(l) l.classList.remove("falta");
    $("erro").classList.add("hide");
    tocou();
  });
  form.addEventListener("change", marcarPassos);

  async function salvar(final, auto){
    if(salvando) return false;
    clearTimeout(timer);
    const dados = coletar();
    guardar(CHAVE, dados);
    salvando = true;
    if(!auto) $("salvo").textContent = "Salvando...";
    try {
      await rpc("jb_diagnostico_salvar", { c: codigo, p: dados, final: !!final });
      mudou = false;
      const h = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      $("salvo").textContent = "Salvo às " + h + ". Pode fechar e voltar pelo mesmo link.";
      salvando = false;
      return true;
    } catch(e){
      salvando = false;
      if(e.codigo === "fechado"){ fechado(); return false; }
      $("salvo").textContent = "Sem conexão agora. Ficou salvo neste aparelho; tente de novo em instantes.";
      return false;
    }
  }
  $("salvar").onclick = async () => { const ok = await salvar(false); if(ok) toast("Salvo. Volte pelo mesmo link quando quiser."); };

  function faltas(d){
    const f = [];
    OBRIG.forEach(([k, lb, msg]) => {
      let ok = String(d[k] || "").trim().length >= 2;
      if(k === "whats"){ const dg = String(d.whats || "").replace(/\D/g, ""); ok = dg.length >= 10 && dg.length <= 13; }
      if(k === "ok_dados") ok = d.ok_dados === "sim";
      if(!ok) f.push([lb, msg]);
    });
    if(!(d.canais || []).length) f.splice(Math.min(f.length, 4), 0, [null, "Marque pelo menos um canal onde você vende (parte 2)."]);
    return f;
  }

  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    form.querySelectorAll(".falta").forEach(c => c.classList.remove("falta"));
    const d = coletar(), f = faltas(d);
    if(f.length){
      f.forEach(([lb]) => { if(lb) $(lb).classList.add("falta"); });
      $("erro").textContent = f[0][1] + (f.length > 1 ? " Faltam " + f.length + " itens no total." : "");
      $("erro").classList.remove("hide");
      const alvo = f[0][0] ? $(f[0][0]) : $("b2");
      alvo.scrollIntoView({ behavior: "smooth", block: "center" });
      const campo = alvo.querySelector("input,select,textarea"); if(campo) campo.focus({ preventScroll: true });
      return;
    }
    const bt = $("enviar"); bt.disabled = true; bt.textContent = "Enviando...";
    const ok = await salvar(true);
    bt.disabled = false; bt.textContent = "Enviar para análise";
    if(!ok){
      $("erro").textContent = "Não conseguimos enviar agora. Seus dados ficaram salvos neste aparelho; tente de novo em instantes ou chame no WhatsApp.";
      $("erro").classList.remove("hide");
      return;
    }
    marcar("diag_dados_enviados", codigo);
    recebido(d.nome);
  });

  function recebido(nome){
    form.classList.add("hide"); $("passos").classList.add("hide");
    $("feito").classList.remove("hide");
    $("feitoCod").textContent = "Diagnóstico " + codigo;
    $("feitoNome").textContent = String(nome || "").split(" ")[0].toLowerCase();
    $("feitoTx").textContent = "Seus dados chegaram. A análise leva até " + ((J.diagnostico || {}).prazoAnalise || "7 dias úteis")
      + " e a gente te chama no WhatsApp para marcar a chamada com a Jessica. Lembrou de alguma coisa? Dá para corrigir até a análise começar.";
    $("feitoWhats").href = linkWhats("Oi! Mandei os dados do diagnóstico (" + codigo + ").");
    $("feito").focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  $("feitoEditar").onclick = () => {
    $("feito").classList.add("hide"); form.classList.remove("hide"); $("passos").classList.remove("hide");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  function fechado(){
    form.classList.add("hide"); $("passos").classList.add("hide");
    $("feito").classList.remove("hide");
    $("feitoCod").textContent = "Diagnóstico " + codigo;
    $("feitoNome").textContent = "e em análise";
    $("feitoTx").textContent = "A equipe já está analisando os seus dados, então o formulário fechou. Precisa mudar alguma coisa? Chama no WhatsApp.";
    $("feitoEditar").classList.add("hide");
    $("feitoWhats").href = linkWhats("Oi! Preciso corrigir um dado do diagnóstico (" + codigo + ").");
  }

  window.addEventListener("beforeunload", e => { if(mudou){ salvar(false, true); } });

  /* abrir */
  (async function abrir(){
    if(!/^DG[A-Z0-9]{6,12}$/.test(codigo)){ semCodigo(); return; }
    $("codTopo").textContent = "Diagnóstico " + codigo;
    let d;
    try { d = await rpc("jb_diagnostico_abrir", { c: codigo }); }
    catch(e){
      if(e.codigo === "codigo"){ semCodigo("Não encontramos esse código. Confira o link que a gente te mandou ou chame no WhatsApp."); return; }
      semCodigo("Não conseguimos abrir o formulário agora. Tente de novo em instantes ou chame no WhatsApp."); return;
    }
    if(d.nome) $("ola").innerHTML = "oi, <em></em>";
    if(d.nome) $("ola").querySelector("em").textContent = String(d.nome).toLowerCase() + ".";
    if(!d.aberto){ fechado(); return; }
    const local = ler(CHAVE), servidor = d.respostas || {};
    const usar = local && (!servidor._salvo || local._salvo > servidor._salvo) ? local : servidor;
    if(!usar.loja && d.loja) usar.loja = d.loja;
    form.classList.remove("hide");
    preencher(usar);
    if(d.enviado) $("salvo").textContent = "Você já enviou os dados. Se corrigir alguma coisa, toque em Enviar de novo.";
  })();
})();
