const dns = require('dns').promises;
const net = require('net');

// Converte um IPv4 (ex: "192.168.0.1") para número inteiro, para comparar faixas
function ipToLong(ip) {
  return ip.split('.').reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
}

// Verifica se um IPv4 pertence a uma faixa interna/privada
function isPrivateIPv4(ip) {
  const long = ipToLong(ip);
  const ranges = [
    ['0.0.0.0', 8], // "este" host
    ['10.0.0.0', 8], // privada
    ['100.64.0.0', 10], // CGNAT
    ['127.0.0.0', 8], // loopback (localhost)
    ['169.254.0.0', 16], // link-local (inclui metadados de cloud: 169.254.169.254)
    ['172.16.0.0', 12], // privada
    ['192.168.0.0', 16], // privada
  ];
  return ranges.some(([base, bits]) => {
    const mask = bits === 0 ? 0 : (~0 << (32 - bits)) >>> 0;
    return (long & mask) === (ipToLong(base) & mask);
  });
}

// Decide se um endereço IP (v4 ou v6) é interno e, portanto, deve ser bloqueado
function isPrivateIp(ip) {
  // Desembrulha IPv4 mapeado em IPv6 (ex: ::ffff:127.0.0.1)
  const mapped = ip.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i);
  if (mapped) ip = mapped[1];

  if (net.isIPv4(ip)) return isPrivateIPv4(ip);

  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === '::1' || lower === '::') return true; // loopback / indefinido
    // fe80::/10 link-local, fc00::/7 (fc/fd) unique local
    return lower.startsWith('fe80') || lower.startsWith('fc') || lower.startsWith('fd');
  }

  return true; // formato desconhecido → bloqueia por segurança
}

/**
 * Valida uma URL fornecida pelo usuário antes de o servidor acessá-la (proteção contra SSRF - OWASP A10).
 * Rejeita esquemas diferentes de http/https e destinos que resolvam para IPs internos/privados.
 * Retorna a URL validada (objeto URL) ou lança um erro com mensagem amigável.
 */
async function assertSafeUrl(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error('URL inválida.');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('Apenas URLs http/https são permitidas.');
  }

  // Resolve o hostname e checa TODOS os IPs retornados (evita bypass por DNS)
  const addresses = await dns.lookup(url.hostname, { all: true });
  for (const { address } of addresses) {
    if (isPrivateIp(address)) {
      throw new Error('Destino não permitido (endereço interno/privado).');
    }
  }

  return url;
}

module.exports = { assertSafeUrl, isPrivateIp };
