/**
 * Sincroniza o menu das 5 páginas escritas à mão com o MENU de layout.js.
 *
 * POR QUE UM SCRIPT
 * Mesma história do rodapé, um andar acima. As 18 páginas geradas recebem
 * o menu de `cabecalho()`; as 5 originais (index, quem-somos, catalogo,
 * servicos, lojas/index) têm o header digitado no HTML. Enquanto foram
 * editadas em separado, os dois grupos divergiram de verdade:
 *
 *     5 antigas   → Início · Quem Somos · Marcas · Serviços · Lojas
 *     18 geradas  → Início · Quem Somos · Marcas · Como comprar · Lojas
 *
 * Quem entrava por uma página de unidade não encontrava Serviços; quem
 * entrava pela home não encontrava Como comprar. Metade do site escondia
 * a outra metade, e nada disso dava erro em lugar nenhum — só sumia.
 *
 * ─── POR QUE SÓ OS <nav>, E NÃO O HEADER INTEIRO ───
 * As 5 páginas têm o header formatado à mão, em várias linhas, com
 * comentários próprios. Reescrever o bloco todo (como o aplicar-rodape.js
 * faz) apagaria isso e produziria um diff enorme por uma mudança de cinco
 * linhas. Aqui a troca é cirúrgica: só o miolo dos dois <nav>, que é o
 * único trecho que o MENU manda. O resto do header fica intocado.
 *
 * Isto é um paliativo consciente, não a cura: a dívida real é migrar as 5
 * para o gerador (README, "Duas dívidas técnicas conhecidas"). Enquanto
 * isso não acontece, é este script que impede a divergência de voltar.
 *
 * Uso: npm run menu   (depois `npm run build`, porque classe nova de
 *                      Tailwind só existe no CSS depois de compilar)
 */

const fs = require('node:fs');
const path = require('node:path');

const { itensMenuDesktop, itensMenuMobile } = require('./layout');

const RAIZ = path.join(__dirname, '..');

/* `atual` é a URL do MENU que corresponde à página, para o destaque e o
   aria-current. `prefixo` é a profundidade, igual ao resto do projeto. */
const PAGINAS = [
  { arquivo: 'index.html', atual: 'index.html', prefixo: '' },
  { arquivo: 'quem-somos.html', atual: 'quem-somos.html', prefixo: '' },
  { arquivo: 'catalogo.html', atual: 'catalogo.html', prefixo: '' },
  { arquivo: 'servicos.html', atual: 'servicos.html', prefixo: '' },
  { arquivo: path.join('lojas', 'index.html'), atual: 'lojas/', prefixo: '../' },
];

/* Casa o miolo de <nav aria-label="..."> até </nav>, devolvendo a tag de
   abertura intacta. O `[\s\S]*?` é preguiçoso: para no primeiro </nav>,
   sem atravessar para o próximo bloco.

   A indentação da linha de abertura é capturada e reaplicada no
   fechamento. Sem isso o `</nav>` sai colado na margem: o `[\s\S]*?`
   engole também os espaços que vinham antes dele, e o HTML das 5 páginas
   — que é lido e editado à mão — ganha um degrau torto a cada rodada. */
function trocarNav(html, rotuloAria, itens) {
  const re = new RegExp(`^([ \\t]*)(<nav aria-label="${rotuloAria}"[^>]*>)[\\s\\S]*?</nav>`, 'm');
  if (!re.test(html)) return null;
  return html.replace(re, (_, recuo, abertura) => `${recuo}${abertura}\n${itens}\n${recuo}</nav>`);
}

let trocadas = 0;

for (const { arquivo, atual, prefixo } of PAGINAS) {
  const caminho = path.join(RAIZ, arquivo);

  if (!fs.existsSync(caminho)) {
    console.log(`  ${arquivo.padEnd(24)} não existe — pulado`);
    continue;
  }

  const original = fs.readFileSync(caminho, 'utf8');

  const comDesktop = trocarNav(original, 'Navegação principal', itensMenuDesktop(atual, prefixo));
  if (!comDesktop) {
    console.log(`  ${arquivo.padEnd(24)} sem <nav> principal — pulado`);
    continue;
  }

  /* O menu mobile é opcional de propósito: se uma página não tiver o
     bloco, o desktop já foi sincronizado e o script segue. Falhar aqui
     deixaria a página com os dois menus divergindo entre si — pior que
     um aviso. */
  const comMobile = trocarNav(comDesktop, 'Navegação mobile', itensMenuMobile(atual, prefixo));
  const houveMobile = comMobile !== null;
  const final = houveMobile ? comMobile : comDesktop;

  if (final === original) {
    console.log(`  ${arquivo.padEnd(24)} já estava em dia`);
    continue;
  }

  fs.writeFileSync(caminho, final, 'utf8');
  trocadas++;
  console.log(`  ${arquivo.padEnd(24)} menu atualizado${houveMobile ? ' (desktop + mobile)' : ' (só desktop)'}`);
}

console.log(`\n  ${trocadas} de ${PAGINAS.length} páginas\n`);
