/**
 * Servidor estático mínimo para desenvolvimento.
 *
 * Existe por um motivo só: os dados de lojas e catálogo são lidos com
 * fetch() a partir de data/*.json, e o navegador bloqueia fetch em
 * páginas abertas via file://. Sem servidor, os cards não carregam.
 *
 * Uso: npm run serve  →  http://localhost:4321
 * Não é para produção — em produção basta subir a pasta num host estático.
 */

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORTA = Number(process.env.PORTA || 4321);
const RAIZ = __dirname;

const TIPOS = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

const servidor = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  let relativo = url === "/" ? "index.html" : url.replace(/^\/+/, "");

  // Impede escapar da raiz do projeto (../../etc/passwd e afins)
  let destino = path.resolve(RAIZ, relativo);
  if (!destino.startsWith(RAIZ)) {
    res.writeHead(403).end("Fora da raiz do projeto.");
    return;
  }

  /* ─── Diretório → index.html ───────────────────────────────────
     As páginas de unidade moram em lojas/<id>/index.html e são
     servidas como /lojas/<id>/. Sem este trecho, fs.readFile num
     diretório devolve EISDIR e a página cai no 404 — que era
     exatamente o que acontecia antes de as unidades existirem, porque
     nenhuma URL do site apontava para uma pasta.

     A barra final não é detalhe: sem ela o navegador resolve os
     caminhos relativos a partir de /lojas/ em vez de /lojas/<id>/, e
     o ../../ das páginas de unidade aponta para o lugar errado. Por
     isso o redirect, e não só o fallback.

     Isto é ferramenta de desenvolvimento. Em produção quem resolve
     diretório é o host. */
  if (fs.existsSync(destino) && fs.statSync(destino).isDirectory()) {
    if (!url.endsWith("/")) {
      res.writeHead(301, { Location: url + "/" }).end();
      return;
    }
    destino = path.join(destino, "index.html");
  }

  fs.readFile(destino, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<h1>404</h1><p>Arquivo não encontrado: " + relativo + "</p>");
      return;
    }

    res.writeHead(200, {
      "Content-Type": TIPOS[path.extname(destino).toLowerCase()] || "application/octet-stream",
      // "no-store" e não "no-cache": o segundo ainda guarda a cópia e só pede
      // revalidação, e como este servidor não manda ETag nem Last-Modified,
      // dá para o navegador continuar exibindo uma versão antiga da página
      // depois de uma edição. Em desenvolvimento isso custa caro — a gente
      // olha a tela e acha que a mudança não funcionou. "no-store" proíbe
      // guardar, então toda visita busca o arquivo do disco.
      "Cache-Control": "no-store, must-revalidate",
    });
    res.end(conteudo);
  });
});

servidor.listen(PORTA, () => {
  console.log(`\n  Rede HG Smart — servidor de desenvolvimento`);
  console.log(`  http://localhost:${PORTA}\n`);
});
