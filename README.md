# Jessica Ballassa Confeitaria · site

Página da bio do Instagram e cardápio de bolos por encomenda.

- `index.html`: link na bio. Delivery próprio primeiro, depois encomenda, contato, horário e os apps.
- `bolos.html`: sabores da casa e o monte seu bolo. Grava pelo banco e abre o WhatsApp da loja.
- `js/config.js`: links, horários, cupons e WhatsApp. Tudo que muda com frequência.
- `sql/`: a função do banco que recebe a encomenda.

Os preços moram no banco (`jb_bolo_opcao`) e se editam pelo JB OS, em Encomendas de bolo.

Testes: `node --test tests/site.test.js`
