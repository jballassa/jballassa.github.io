/* Parcerias e collabs. O formulário grava pelo banco (jb_parceria_criar) e o pedido
   aparece no JB OS do gestor, em Parcerias. Se a rede falhar, o mesmo texto vai
   pronto para o WhatsApp da loja, para ninguém perder a ideia. */
(function(){
  const J = window.JB, P = J.parcerias || {};

  const TIPOS = {
    jb: [
      ["collab", "Collab de produto"],
      ["corporativo", "Kits e presentes corporativos"],
      ["evento", "Evento ou ação"],
      ["revenda", "Revenda no meu café ou loja"],
      ["outro", "Outra ideia"]
    ],
    jessica: [
      ["publi", "Publi ou conteúdo"],
      ["presenca", "Presença em evento"],
      ["aula", "Aula, workshop ou palestra"],
      ["outro", "Outra ideia"]
    ]
  };
  const RECADOS = {
    nome: "Escreva o seu nome.",
    contato: "Deixe um WhatsApp com DDD ou um e-mail para a gente responder.",
    instagram: "Esse @ do Instagram parece incompleto. Pode deixar em branco.",
    ideia: "Conte um pouco mais da ideia (pelo menos uma frase).",
    tipo: "Escolha o que você tem em mente.",
    com_quem: "Escolha com quem é a parceria.",
    formato: "Escolha o formato ou deixe em \"Ainda não sei\".",
    limite: "Recebemos vários pedidos seus hoje. A gente já vai responder; se for urgente, chame no WhatsApp."
  };

  let QUEM = "jb";
  let ENVIANDO = false;

  /* links fixos da página */
  const wa = linkWhats("Oi! Vim pela página de parcerias da JB :)");
  $("lnkInstaJB").href = J.instagram; $("rodInsta").href = J.instagram;
  $("lnkInstaJes").href = P.instagramJessica || J.instagram;
  $("rodEnd").textContent = J.endereco + " · " + J.bairro;
  $("rodCnpj").textContent = J.cnpj;
  $("feitoWhats").href = wa;

  /* números */
  const ul = $("numerosLista");
  (P.numeros || []).forEach(n => {
    const li = document.createElement("li"); li.className = "surge";
    const b = document.createElement("b"); b.textContent = n.valor;
    const s = document.createElement("span"); s.textContent = n.texto;
    li.append(b, s); ul.appendChild(li);
  });
  if(!(P.numeros || []).length) $("numeros").classList.add("hide");
  $("numerosData").textContent = P.numerosData ? "Números conferidos em " + P.numerosData + "." : "";

  /* com quem: o seletor do formulário e os dois cartões */
  function escolher(quem, rolar){
    QUEM = quem === "jessica" ? "jessica" : "jb";
    $("quemJB").setAttribute("aria-pressed", String(QUEM === "jb"));
    $("quemJes").setAttribute("aria-pressed", String(QUEM === "jessica"));
    const sel = $("tipo"), antes = sel.value;
    sel.innerHTML = "";
    const o0 = document.createElement("option"); o0.value = ""; o0.textContent = "Escolha";
    sel.appendChild(o0);
    TIPOS[QUEM].forEach(([v, t]) => {
      const o = document.createElement("option"); o.value = v; o.textContent = t; sel.appendChild(o);
    });
    if(TIPOS[QUEM].some(([v]) => v === antes)) sel.value = antes;
    if(rolar){ $("contar").scrollIntoView({ behavior: "smooth", block: "start" }); }
  }
  $("quemJB").onclick = () => escolher("jb");
  $("quemJes").onclick = () => escolher("jessica");
  document.querySelectorAll(".caminho [data-quem]").forEach(b => b.addEventListener("click", () => {
    marcar("parceria_caminho", b.dataset.quem);
    escolher(b.dataset.quem, true);
  }));
  /* link direto: parcerias.html?com=jessica */
  escolher(new URLSearchParams(location.search).get("com") === "jessica" ? "jessica" : "jb");

  /* validação do lado de cá (o banco confere de novo) */
  function contatoOk(v){
    v = String(v || "").trim();
    if(/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v)) return true;
    const d = v.replace(/\D/g, "");
    return !/[a-z@]/i.test(v) && d.length >= 10 && d.length <= 13;
  }
  function instaOk(v){
    v = String(v || "").trim();
    if(!v) return true;
    v = v.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//i, "").replace(/[\/?].*$/, "").replace(/^@+/, "");
    return /^[A-Za-z0-9._]{1,30}$/.test(v);
  }
  function faltas(){
    const f = [];
    if(!$("tipo").value) f.push(["lbTipo", "tipo"]);
    if($("nome").value.trim().length < 2) f.push(["lbNome", "nome"]);
    if(!contatoOk($("contato").value)) f.push(["lbContato", "contato"]);
    if(!instaOk($("instagram").value)) f.push(["lbInsta", "instagram"]);
    if($("ideia").value.trim().length < 10) f.push(["lbIdeia", "ideia"]);
    return f;
  }
  ["tipo","nome","contato","instagram","ideia"].forEach(id => $(id).addEventListener("input", () => {
    $(id).closest(".campo").classList.remove("falta");
    $("erro").classList.add("hide");
  }));

  function nomeTipo(){
    const t = TIPOS[QUEM].find(([v]) => v === $("tipo").value);
    return t ? t[1] : "";
  }
  function mensagemWhats(codigo){
    const l = [
      "Oi! Quero propor uma parceria " + (QUEM === "jessica" ? "com a Jessica" : "com a JB Confeitaria") + (codigo ? " (" + codigo + ")" : "") + ".",
      "Tipo: " + nomeTipo(),
      "Nome: " + $("nome").value.trim() + ($("marca").value.trim() ? ", " + $("marca").value.trim() : ""),
      $("instagram").value.trim() ? "Instagram: " + $("instagram").value.trim() : "",
      $("quando").value.trim() ? "Para quando: " + $("quando").value.trim() : "",
      "Ideia: " + $("ideia").value.trim()
    ];
    return l.filter(Boolean).join("\n");
  }

  $("formParc").addEventListener("submit", async ev => {
    ev.preventDefault();
    if(ENVIANDO) return;
    document.querySelectorAll("#formParc .campo.falta").forEach(c => c.classList.remove("falta"));
    const f = faltas();
    if(f.length){
      f.forEach(([lb]) => $(lb).classList.add("falta"));
      $("erro").textContent = RECADOS[f[0][1]];
      $("erro").classList.remove("hide");
      $(f[0][0]).querySelector("input,select,textarea").focus();
      return;
    }
    const payload = {
      com_quem: QUEM, tipo: $("tipo").value,
      nome: $("nome").value.trim(), marca: $("marca").value.trim(),
      contato: $("contato").value.trim(), instagram: $("instagram").value.trim(),
      quando: $("quando").value.trim(), formato: $("formato").value,
      ideia: $("ideia").value.trim(), hp: $("site").value,
      origem: new URLSearchParams(location.search).get("utm_source") || "site"
    };
    ENVIANDO = true;
    const bt = $("enviar"); bt.disabled = true; bt.textContent = "Enviando...";
    marcar("parceria_enviar", QUEM + " " + payload.tipo);
    let codigo = null, falhou = false;
    try {
      const S = J.supabase;
      const r = await fetch(S.url + "/rest/v1/rpc/jb_parceria_criar", {
        method: "POST",
        headers: { apikey: S.chave, "Content-Type": "application/json" },
        body: JSON.stringify({ p: payload })
      });
      const d = await r.json().catch(() => ({}));
      if(!r.ok){
        const k = String(d.message || "");
        if(RECADOS[k]){
          $("erro").textContent = RECADOS[k];
          $("erro").classList.remove("hide");
          ENVIANDO = false; bt.disabled = false; bt.textContent = "Enviar minha ideia";
          return;
        }
        falhou = true;
      } else codigo = d.codigo || null;
    } catch(e){ falhou = true; }

    $("formParc").classList.add("hide");
    $("feito").classList.remove("hide");
    $("feitoNome").textContent = payload.nome.split(" ")[0].toLowerCase();
    $("feitoCodigo").textContent = codigo ? "Pedido " + codigo : "";
    $("feitoCodigo").classList.toggle("hide", !codigo);
    $("feitoWhats").href = linkWhats(mensagemWhats(codigo));
    if(falhou){
      $("feitoTexto").textContent = "Não conseguimos registrar agora, mas a sua ideia já está escrita na mensagem do WhatsApp. É só tocar no botão e enviar.";
      $("feitoWhats").textContent = "Enviar pelo WhatsApp";
    } else {
      $("feitoTexto").textContent = "A sua ideia chegou para a gente. Respondemos em até " + (P.resposta || "3 dias úteis")
        + " pelo contato que você deixou. Se for urgente, chame no WhatsApp ou escreva para " + (P.email || "jbconfeitariaparcerias@gmail.com") + ".";
      $("feitoWhats").textContent = "Chamar no WhatsApp";
    }
    $("feito").focus({ preventScroll: true });
    $("contar").scrollIntoView({ behavior: "smooth", block: "start" });
    ENVIANDO = false;
  });

  medirCliques({ btMidiaKit: "parceria_midiakit", btHeroiIdeia: "parceria_contar", lnkEmail: "parceria_email" });
  ligarMenu();
  ligarSurge();
})();
