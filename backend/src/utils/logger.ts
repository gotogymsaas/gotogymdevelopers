export function log(message: string, ...args: any[]) {
  // Mejorable con winston/pino en el futuro
  console.log(`[${new Date().toISOString()}] ${message}`, ...args);
}
