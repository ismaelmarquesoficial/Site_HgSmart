/**
 * Insere o botão fixo de WhatsApp em todas as páginas, antes de </body>.
 *
 * O número é o da matriz (Santa Cruz do Sul), que é o endereço do rodapé
 * e o primeiro telefone institucional. A rede tem 7 WhatsApps diferentes;
 * um botão global tem que apontar para um só, e a matriz é a escolha
 * defensável. Para trocar, é este arquivo e um `npm run zap`.
 */
const fs = require('fs');

const NUMERO = '5551998575806'; // matriz — Santa Cruz do Sul
const TEXTO = encodeURIComponent(
  'Olá! Vim pelo site da HG Smart e gostaria de saber mais sobre as condições de pagamento.'
);

const bloco = `
    <!-- Botão fixo de WhatsApp (requisito do SEO TECNICO).
         Aponta para a MATRIZ. A rede tem 7 números diferentes; um botão
         global precisa escolher um. Quem quer a loja da sua cidade tem a
         página /lojas com o WhatsApp de cada unidade. -->
    <a
      class="zap-fixo"
      href="https://wa.me/${NUMERO}?text=${TEXTO}"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com a HG Smart no WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path
          d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.79-1.68-2.09-.17-.3-.02-.46.13-.61.15-.15.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.62-.93-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.06 4.37.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z"
        />
        <path
          d="M12.02 2C6.5 2 2.02 6.48 2.02 12c0 1.77.46 3.43 1.27 4.87L2 22l5.28-1.26A9.94 9.94 0 0 0 12.02 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.2c-1.6 0-3.1-.44-4.38-1.2l-.31-.19-3.2.77.79-3.12-.2-.32A8.16 8.16 0 0 1 3.82 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2Z"
        />
      </svg>
      <span>Falar no WhatsApp</span>
    </a>
`;

const arquivos = process.argv.slice(2);

for (const arquivo of arquivos) {
  let html = fs.readFileSync(arquivo, 'utf8');

  if (html.includes('class="zap-fixo"')) {
    // já existe: substitui para manter número/texto em sincronia
    html = html.replace(/\n\s*<!-- Botão fixo de WhatsApp[\s\S]*?<\/a>\n/, bloco);
    fs.writeFileSync(arquivo, html, 'utf8');
    console.log(`  ${arquivo.padEnd(20)} atualizado`);
    continue;
  }

  // insere antes dos scripts, que ficam no fim do body
  html = html.replace(
    /(\n\s*<script src="assets\/vendor\/lenis)/,
    `${bloco}$1`
  );
  fs.writeFileSync(arquivo, html, 'utf8');
  console.log(`  ${arquivo.padEnd(20)} inserido`);
}
