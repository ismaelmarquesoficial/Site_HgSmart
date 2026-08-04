/**
 * Normaliza e otimiza os banners do slider.
 *
 * Contexto: os originais baixados do site antigo já vêm com altura
 * uniforme (desktop 1920x740, mobile 900x900) — isto NÃO conserta
 * altura, ele garante que continue uniforme e corta o peso, que era
 * o problema real: 573KB por banner desktop, 6,6MB no total.
 *
 * O que faz:
 *   - reamostra para larguras fixas (1920 e 1280 no desktop, 900 no mobile)
 *   - força a proporção-alvo com cover + corte centralizado, então mesmo
 *     que alguém troque um arquivo por outro de proporção diferente, o
 *     slider nunca muda de altura
 *   - gera WebP (principal) e JPEG (fallback)
 *   - imprime o antes/depois
 *
 * Uso: npm run banners
 */

const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const RAIZ = path.join(__dirname, '..', 'assets', 'img', 'banners');
const ORIGEM = path.join(RAIZ, 'original');
const QUANTOS = 7;

/* Proporções-alvo. Mexer aqui muda a altura do slider em todo o site. */
const PERFIS = [
  { nome: 'desktop', prefixo: 'desktop', largura: 1920, proporcao: 1920 / 740 },
  { nome: 'desktop-medio', prefixo: 'desktop', largura: 1280, proporcao: 1920 / 740, sufixo: '-1280' },
  { nome: 'mobile', prefixo: 'mobile', largura: 900, proporcao: 1 },
];

const kb = (bytes) => Math.round(bytes / 1024);

async function processar() {
  if (!fs.existsSync(ORIGEM)) {
    console.error(`\n  Pasta de origem não encontrada: ${ORIGEM}`);
    console.error('  Coloque os arquivos originais ali (desktop-1.jpg … mobile-7.jpg).\n');
    process.exit(1);
  }

  let pesoAntes = 0;
  let pesoDepois = 0;
  const linhas = [];

  for (const perfil of PERFIS) {
    const altura = Math.round(perfil.largura / perfil.proporcao);

    for (let n = 1; n <= QUANTOS; n++) {
      const entrada = path.join(ORIGEM, `${perfil.prefixo}-${n}.jpg`);
      if (!fs.existsSync(entrada)) {
        console.warn(`  faltando: ${path.basename(entrada)} — pulando`);
        continue;
      }

      const base = `banner-${n}-${perfil.prefixo}${perfil.sufixo || ''}`;
      const saidaWebp = path.join(RAIZ, `${base}.webp`);
      const saidaJpg = path.join(RAIZ, `${base}.jpg`);

      // Só conta o peso original uma vez por arquivo (no perfil de largura cheia)
      if (!perfil.sufixo) pesoAntes += fs.statSync(entrada).size;

      const redimensionado = sharp(entrada).resize(perfil.largura, altura, {
        fit: 'cover',
        position: 'center',
      });

      await redimensionado.clone().webp({ quality: 78, effort: 5 }).toFile(saidaWebp);
      await redimensionado.clone().jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(saidaJpg);

      const bWebp = fs.statSync(saidaWebp).size;
      const bJpg = fs.statSync(saidaJpg).size;
      pesoDepois += bWebp; // o WebP é o que o navegador moderno baixa

      linhas.push(
        `  ${base.padEnd(26)} ${perfil.largura}x${altura}`.padEnd(48) +
          `webp ${String(kb(bWebp)).padStart(4)}KB   jpg ${String(kb(bJpg)).padStart(4)}KB`
      );
    }
  }

  console.log(`\n  Banners processados — ${RAIZ}\n`);
  console.log(linhas.join('\n'));
  console.log(
    `\n  originais: ${kb(pesoAntes)}KB  →  webp servido: ${kb(pesoDepois)}KB  ` +
      `(${Math.round((1 - pesoDepois / pesoAntes) * 100)}% menor)\n`
  );
}

processar().catch((erro) => {
  console.error('\n  Falhou ao processar banners:', erro.message, '\n');
  process.exit(1);
});
