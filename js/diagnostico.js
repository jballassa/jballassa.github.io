/* Diagnóstico de crescimento (página da oferta). O pagamento vem antes de tudo:
   com o link do checkout em JB.diagnostico.pagamentoUrl o botão vai direto para ele;
   sem link, abre o WhatsApp da loja com a mensagem pronta e a equipe manda o pagamento. */
(function(){
  const J = window.JB, D = J.diagnostico || {}, P = J.parcerias || {};
  const preco = Number(D.preco || 497);
  const precoTx = "R$ " + preco.toLocaleString("pt-BR");

  $("precoMini").textContent = precoTx + " · pagamento único · até " + (D.vagasMes || 4) + " vagas por mês";
  $("precoGrande").textContent = precoTx;
  $("txPrazo").textContent = "Em até " + (D.prazoAnalise || "7 dias úteis") + " depois de receber tudo.";
  $("txPergPrazo").textContent = "Depois que você manda os dados completos, a análise leva até " + (D.prazoAnalise || "7 dias úteis") + ". Em seguida vêm o plano e a chamada.";
  $("txChamada").textContent = "Chamada de vídeo de " + (D.chamadaMin || "40 minutos") + " com a Jessica";
  $("incChamada").textContent = "Chamada de vídeo de " + (D.chamadaMin || "40 minutos") + " com a Jessica";
  $("txDuvidas").textContent = "Uma rodada de dúvidas por escrito, em até " + (D.duvidasDias || 15) + " dias";
  $("incDuvidas").textContent = "Uma rodada de dúvidas por escrito, em até " + (D.duvidasDias || 15) + " dias";

  const bt = $("btGarantir");
  if(D.pagamentoUrl){
    bt.href = D.pagamentoUrl; bt.target = "_blank";
    $("txGarantir").textContent = "Depois do pagamento você recebe o link do formulário para mandar os seus dados.";
  } else {
    bt.href = linkWhats("Oi! Quero o Diagnóstico de crescimento da Jessica (" + precoTx + ").\nMinha loja: \nInstagram: \nVendo em: ");
    bt.textContent = "Quero garantir minha vaga";
    $("txGarantir").textContent = "Abre o WhatsApp da JB com a mensagem pronta. A gente te manda o pagamento e, depois dele, o link para mandar os seus dados.";
  }

  /* números da JB (os mesmos da página de parcerias) */
  const ul = $("numerosLista");
  (P.numeros || []).forEach(n => {
    const li = document.createElement("li"); li.className = "surge";
    const b = document.createElement("b"); b.textContent = n.valor;
    const s = document.createElement("span"); s.textContent = n.texto;
    li.append(b, s); ul.appendChild(li);
  });
  if(!(P.numeros || []).length) ul.classList.add("hide");

  $("rodInsta").href = J.instagram;
  $("rodEnd").textContent = J.endereco + " · " + J.bairro;
  $("rodCnpj").textContent = J.cnpj;

  medirCliques({ btHeroiQuero: "diag_heroi_quero", btHeroiPlano: "diag_heroi_plano", btGarantir: "diag_garantir" });
  ligarMenu();
  ligarSurge();
})();
