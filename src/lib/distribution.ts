export function distributionTotal(items: readonly { percentage: number }[]) {
  return Math.round(items.reduce((sum, item) => sum + item.percentage, 0) * 1e10) / 1e10;
}

export function canAddDistribution(items: readonly { percentage: number }[]) {
  return distributionTotal(items) < 100;
}