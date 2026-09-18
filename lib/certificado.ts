/**
 * Regra do nome do certificado: uma alteração a cada 6 meses.
 * A trava também existe no servidor; aqui é só para a tela avisar antes.
 */

const SEIS_MESES_MS = 1000 * 60 * 60 * 24 * 182;

export function podeTrocarNomeCertificado(alteradoEm?: string | null) {
  if (!alteradoEm) return true;
  const quando = new Date(alteradoEm).getTime();
  if (Number.isNaN(quando)) return true;
  return Date.now() - quando > SEIS_MESES_MS;
}

export function proximaTrocaCertificado(alteradoEm?: string | null) {
  if (!alteradoEm) return null;
  const quando = new Date(alteradoEm).getTime();
  if (Number.isNaN(quando)) return null;
  return new Date(quando + SEIS_MESES_MS);
}

/** dd/mm/aaaa sem depender de Intl. */
export function formatarData(data: Date | string | null | undefined) {
  if (!data) return '';
  const d = typeof data === 'string' ? new Date(data) : data;
  if (Number.isNaN(d.getTime())) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${d.getFullYear()}`;
}
