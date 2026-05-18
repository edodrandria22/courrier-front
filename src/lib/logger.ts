const isDev = process.env.NODE_ENV === 'development';

// ─── Type de la réponse d'erreur backend ─────────────────────────────────────

interface ApiErrorResponse {
  status: 'error';
  message: string;
}

// ─── Dev logger ───────────────────────────────────────────────────────────────

const dev = {
  /**
   * Log une erreur API avec le message backend et le contexte.
   * Usage : logger.error('courrierService.getCourriers', response)
   */
  error: async (context: string, response: Response): Promise<void> => {
    if (!isDev) return;

    let apiMessage = '(impossible de lire le corps de la réponse)';
    try {
      const body: ApiErrorResponse = await response.clone().json();
      apiMessage = body.message ?? JSON.stringify(body);
    } catch {
      // corps non JSON
    }

    const separator = '═'.repeat(60);
    console.log(`\n${separator}`);
    console.log(`🔴 [API ERROR] ${context}`);
    console.log(separator);
    console.log(`Status:  ${response.status} ${response.statusText}`);
    console.log(`Message: ${apiMessage}`);
    console.log(`URL:     ${response.url}`);
    console.log(`${separator}\n`);
  },

  /**
   * Log une erreur inattendue (réseau, exception JS, etc.)
   */
  exception: (context: string, err: unknown): void => {
    if (!isDev) return;

    const errorType = err instanceof Error ? err.constructor.name : typeof err;
    const errorMessage = err instanceof Error ? err.message : String(err);
    const separator = '═'.repeat(60);

    console.log(`\n${separator}`);
    console.log(`💥 [EXCEPTION] ${context}`);
    console.log(separator);
    console.log(`Type:    ${errorType}`);
    console.log(`Message: ${errorMessage}`);
    if (err instanceof Error && err.stack) {
      console.log(`Stack:\n${err.stack}`);
    }
    console.log(`${separator}\n`);
  },

  /**
   * Log informatif (succès, données reçues, etc.)
   */
  info: (context: string, data?: unknown): void => {
    if (!isDev) return;
    const separator = '═'.repeat(60);
    console.log(`\n${separator}`);
    console.log(`🟢 [INFO] ${context}`);
    if (data !== undefined) {
      console.log(`${separator}`);
      console.log(data);
    }
    console.log(`${separator}\n`);
  },
};

// ─── Prod logger ──────────────────────────────────────────────────────────────

const prod = {
  /**
   * En production : ne log rien côté console.
   * Branchable à un service externe (Sentry, Datadog, etc.) si besoin.
   */
  error: (_context: string, _err?: unknown): void => {
    // TODO: envoyer vers un service de monitoring (ex: Sentry)
  },

  exception: (_context: string, _err?: unknown): void => {
    // TODO: envoyer vers un service de monitoring (ex: Sentry)
  },
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const logger = isDev ? dev : prod;
