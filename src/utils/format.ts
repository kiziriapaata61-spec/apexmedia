export function formatUsdt(value: number, decimals = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatUsdtLabel(value: number, suffix = 'USDT'): string {
  return `${formatUsdt(value)} ${suffix}`
}
