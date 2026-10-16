export type LogFields = Record<string, unknown>;

type Level = "info" | "error";

export function createTraceId(): string {
  return crypto.randomUUID();
}

export function createLogger(scope: string) {
  function write(level: Level, message: string, fields?: LogFields) {
    const line = {
      time: new Date().toISOString(),
      level,
      scope,
      message,
      ...fields,
    };
    const stream = level === "error" ? console.error : console.info;
    stream(JSON.stringify(line));
  }

  return {
    info(message: string, fields?: LogFields) {
      write("info", message, fields);
    },
    error(message: string, fields?: LogFields) {
      write("error", message, fields);
    },
  };
}
