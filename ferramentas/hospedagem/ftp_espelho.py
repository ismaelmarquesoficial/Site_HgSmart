#!/usr/bin/env python3
"""Espelho por FTP (TLS explícito) entre a hospedagem cPanel e esta máquina.

    python3 ferramentas/hospedagem/ftp_espelho.py baixar <pasta remota> <pasta local> [--excluir nome ...]
    python3 ferramentas/hospedagem/ftp_espelho.py enviar <pasta local>  <pasta remota>

Credenciais: arquivo .env com FTP_HOST, FTP_USER e FTP_PASS, passado por --credenciais (padrão: variável
HG_FTP_ENV). O arquivo fica no Cofre e nunca é impresso. Só a biblioteca padrão do Python.

- baixar: copia o que falta ou mudou de tamanho (arquivo igual em tamanho é pulado); não apaga nada local.
- enviar: cria as pastas e sobe todos os arquivos; não apaga nada remoto.
"""
import argparse, os, sys, time
from ftplib import FTP_TLS, error_perm


def credenciais(caminho):
    env = {}
    for linha in open(caminho, encoding='utf-8'):
        if '=' in linha and not linha.startswith('#'):
            k, v = linha.rstrip('\n').split('=', 1); env[k.strip()] = v.strip()
    return env['FTP_HOST'], env['FTP_USER'], env['FTP_PASS']


def conectar(caminho):
    host, user, senha = credenciais(caminho)
    ftp = FTP_TLS(host, timeout=120); ftp.login(user, senha); ftp.prot_p()
    ftp.encoding = 'utf-8'
    return ftp


def listar(ftp, remoto):
    """[(nome, tipo, tamanho)] via MLSD; cai para NLST quando o servidor não tem MLSD."""
    itens = []
    try:
        for nome, f in ftp.mlsd(remoto, facts=['type', 'size']):
            if nome in ('.', '..'): continue
            itens.append((nome, f.get('type'), int(f.get('size', 0) or 0)))
    except error_perm:
        for nome in ftp.nlst(remoto):
            nome = nome.rsplit('/', 1)[-1]
            try: ftp.cwd(remoto + '/' + nome); ftp.cwd(remoto); itens.append((nome, 'dir', 0))
            except error_perm: itens.append((nome, 'file', ftp.size(remoto + '/' + nome) or 0))
    return itens


def baixar(ftp, remoto, local, excluir, est):
    os.makedirs(local, exist_ok=True)
    for nome, tipo, tam in listar(ftp, remoto):
        if nome in excluir: est['pulados'] += 1; continue
        r, l = remoto + '/' + nome, os.path.join(local, nome)
        if tipo == 'dir':
            baixar(ftp, r, l, excluir, est); continue
        if os.path.exists(l) and os.path.getsize(l) == tam: est['iguais'] += 1; continue
        for tent in range(3):
            try:
                with open(l, 'wb') as fh: ftp.retrbinary('RETR ' + r, fh.write)
                est['baixados'] += 1; est['bytes'] += tam; break
            except Exception as e:
                if tent == 2: est['erros'].append((r, str(e)[:80]))
                else: time.sleep(2)
        if (est['baixados'] + est['iguais']) % 200 == 0: print(f"  … {est['baixados']} baixados, {est['iguais']} iguais, {est['bytes']/1048576:.0f} MB", flush=True)


def mkd_p(ftp, remoto):
    atual = ''
    for parte in remoto.strip('/').split('/'):
        atual += '/' + parte
        try: ftp.mkd(atual)
        except error_perm: pass


def enviar(ftp, local, remoto, est):
    mkd_p(ftp, remoto)
    for nome in sorted(os.listdir(local)):
        l, r = os.path.join(local, nome), remoto + '/' + nome
        if os.path.isdir(l): enviar(ftp, l, r, est); continue
        with open(l, 'rb') as fh: ftp.storbinary('STOR ' + r, fh)
        est['enviados'] += 1; est['bytes'] += os.path.getsize(l)
        if est['enviados'] % 100 == 0: print(f"  … {est['enviados']} enviados, {est['bytes']/1048576:.1f} MB", flush=True)


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument('modo', choices=['baixar', 'enviar']); p.add_argument('origem'); p.add_argument('destino')
    p.add_argument('--credenciais', default=os.environ.get('HG_FTP_ENV'), help='arquivo .env no Cofre')
    p.add_argument('--excluir', nargs='*', default=[], help='nomes de arquivo ou pasta a pular (só em baixar)')
    a = p.parse_args()
    if not a.credenciais: sys.exit('faltou --credenciais (ou HG_FTP_ENV)')
    ftp = conectar(a.credenciais); t0 = time.time()
    if a.modo == 'baixar':
        est = {'baixados': 0, 'iguais': 0, 'pulados': 0, 'bytes': 0, 'erros': []}
        baixar(ftp, a.origem.rstrip('/'), a.destino, set(a.excluir), est)
    else:
        est = {'enviados': 0, 'bytes': 0, 'erros': []}
        enviar(ftp, a.origem.rstrip('/'), a.destino.rstrip('/'), est)
    ftp.quit()
    print({k: v for k, v in est.items() if k != 'erros'}, f"| {time.time()-t0:.0f}s | erros: {len(est['erros'])}")
    for e in est['erros'][:20]: print('  ERRO', e)
    sys.exit(1 if est['erros'] else 0)


if __name__ == '__main__':
    main()
