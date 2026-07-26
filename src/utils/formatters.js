export function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good morning';
  }

  if (hour < 18) {
    return 'Good afternoon';
  }

  return 'Good evening';
}
