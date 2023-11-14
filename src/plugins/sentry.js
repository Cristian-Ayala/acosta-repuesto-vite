import * as Sentry from "@sentry/vue";

export default ({ app, router }) => {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [
          "localhost",
          import.meta.env.VITE_SENTRY_TRACE_PROPAGATION_TARGET,
        ],
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay(),
    ],
    tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE,
    replaysSessionSampleRate: import.meta.env
      .VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: import.meta.env
      .VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE,
    ignoreErrors: ["Login required", "(DO NOT REPORT THIS ERROR)"],
  });
};
