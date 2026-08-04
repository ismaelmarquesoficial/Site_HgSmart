"""
Reduz a Bebas Neue apenas aos caracteres usados nos rótulos do mapa e
grava o resultado em base64, pronto para ser embutido no SVG.

POR QUE ISSO EXISTE
Um SVG carregado como imagem (a tag img) não busca recurso externo
nenhum — arquivo de fonte incluído. Sem embutir, os rótulos do mapa
cairiam numa fonte do sistema e a tipografia não bateria com o resto do
site. Um data URI não é recurso externo, então passa.

Só entram os glifos que os nomes das cidades realmente usam: a fonte
inteira tem 13KB, o recorte fica em torno de 2KB.

Uso: npm run fonte-mapa
"""

import base64
import json
import pathlib
import sys

from fontTools import subset

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "assets" / "fontes" / "BebasNeue-400.woff2"
DESTINO = RAIZ / "ferramentas" / "dados-mapa" / "bebas-subset.txt"


def texto_dos_rotulos() -> str:
    """Junta tudo que vai ser escrito no mapa, para o subset cobrir exatamente isso."""
    dados = json.loads((RAIZ / "data" / "lojas.json").read_text(encoding="utf-8"))
    partes = [loja["cidade"] for loja in dados["lojas"]]
    partes.append(" · em breve")  # sufixo das unidades ainda não abertas
    return "".join(partes)


def main() -> int:
    if not ORIGEM.exists():
        print(f"  fonte de origem nao encontrada: {ORIGEM}")
        return 1

    texto = texto_dos_rotulos()
    # Bebas Neue é caixa-alta por desenho, mas o subset trabalha por
    # caractere: sem incluir as duas caixas, o mapeamento falha.
    caracteres = sorted(set(texto + texto.upper() + texto.lower()))

    saida = DESTINO.with_suffix(".woff2")

    subset.main(
        [
            str(ORIGEM),
            f"--text={''.join(caracteres)}",
            "--flavor=woff2",
            "--layout-features=",  # nenhum recurso tipográfico extra
            "--no-hinting",
            "--desubroutinize",
            f"--output-file={saida}",
        ]
    )

    bruto = saida.read_bytes()
    DESTINO.write_text(base64.b64encode(bruto).decode("ascii"), encoding="ascii")
    saida.unlink()  # só o base64 interessa daqui para frente

    original = ORIGEM.stat().st_size
    print(f"\n  Bebas Neue reduzida para os rotulos do mapa")
    print(f"  {len(caracteres)} caracteres: {''.join(c for c in caracteres if c.strip())}")
    print(f"  {original} bytes  ->  {len(bruto)} bytes  ({len(bruto) * 100 // original}% do original)")
    print(f"  base64: {len(DESTINO.read_text())} bytes -> {DESTINO.name}\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
