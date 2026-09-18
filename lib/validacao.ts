/** Validações e máscaras usadas nos formulários. */

export const soNumeros = (valor: string) => (valor || '').replace(/\D/g, '');

export function validarEmail(valor: string) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test((valor || '').trim());
}

export function validarCPF(valor: string) {
  const c = soNumeros(valor);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += Number(c[i]) * (10 - i);
  let digito = ((soma * 10) % 11) % 10;
  if (digito !== Number(c[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += Number(c[i]) * (11 - i);
  digito = ((soma * 10) % 11) % 10;
  return digito === Number(c[10]);
}

export function validarCNPJ(valor: string) {
  const c = soNumeros(valor);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;

  const calcular = (tamanho: number) => {
    const pesos =
      tamanho === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < tamanho; i++) soma += Number(c[i]) * pesos[i];
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  return calcular(12) === Number(c[12]) && calcular(13) === Number(c[13]);
}

export const validarDocumento = (valor: string) =>
  soNumeros(valor).length <= 11 ? validarCPF(valor) : validarCNPJ(valor);

export function mascaraDocumento(valor: string) {
  const n = soNumeros(valor).slice(0, 14);
  return n.length <= 11
    ? n
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    : n
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
}

/**
 * O campo de login aceita e-mail ou documento.
 * Se a pessoa começou a digitar números, aplicamos a máscara de CPF/CNPJ.
 */
export function formatarIdentificador(valor: string) {
  const limpo = (valor || '').trim();
  if (!limpo) return limpo;
  const pareceDocumento = /^[\d.\-/\s]+$/.test(limpo);
  return pareceDocumento ? mascaraDocumento(limpo) : limpo;
}

/** Devolve o valor pronto para mandar na API: e-mail em minúsculas ou documento só com números. */
export function normalizarIdentificador(valor: string) {
  const limpo = (valor || '').trim();
  return limpo.includes('@') ? limpo.toLowerCase() : soNumeros(limpo);
}

export function identificadorValido(valor: string) {
  const limpo = (valor || '').trim();
  if (!limpo) return false;
  return limpo.includes('@') ? validarEmail(limpo) : validarDocumento(limpo);
}
