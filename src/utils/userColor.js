const PALETTE = [
  '#f47b67', '#f5a623', '#f8d347', '#7ed957',
  '#4fd1c5', '#4a9eff', '#8c7ae6', '#e056a0',
  '#ff6b9d', '#54c8ff'
];

export function colorForUser(id) {
  if (!id) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function initialsForName(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}