/**
 * Rasteriza o mapa SVG num PNG para conferência visual.
 *
 * Existe porque SVG com <style> interno não dá para inspecionar lendo o
 * arquivo: precisa ver o desenho. O PNG sai com fundo escuro, como no
 * site, e é descartável — não faz parte do site publicado.
 *
 * Uso: node ferramentas/previa-mapa.js
 */
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.join(__dirname, '..');
const entrada = path.join(RAIZ, 'assets', 'img', 'mapa-rs.svg');
const saida = path.join(RAIZ, 'previa-mapa.png');

sharp(Buffer.from(fs.readFileSync(entrada, 'utf8')), { density: 200 })
  .resize(760)
  .flatten({ background: '#0a0d12' })
  .png()
  .toFile(saida)
  .then((i) => console.log(`  previa-mapa.png ${i.width}x${i.height} (arquivo descartavel)`))
  .catch((e) => {
    console.error('  erro:', e.message);
    process.exit(1);
  });
