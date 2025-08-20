import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";

const redisOpts = {
  maxRetriesPerRequest: null as any, // критично
  enableReadyCheck: false,
};

const redisUrl = process.env.REDIS_URL ?? "redis://127.0.0.1:6379";

// передать прямо строку + opts
export const actionsQueue = new Queue("actions", {
  connection: { ...redisOpts, url: redisUrl },
});

// сам создаёт соединение с теми же опциями
export const actionsWorker = new Worker(
  "actions",
  async (job) => {
    const { actionKey, payload } = job.data as { actionKey: string; payload: any };

    if (actionKey === "httpRequest") {
      const { url, method, body, headers } = payload;
      const res = await fetch(url, { method, body: body && JSON.stringify(body), headers });
      const json = await res.json();
      return { ok: true, json };
    }

    return { ok: false, reason: "Unknown actionKey" };
  },
  { connection: { ...redisOpts, url: redisUrl } }
);

// чтобы воркер корректно закрывался в dev
process.on("SIGINT", async () => {
  await actionsWorker.close();
  await actionsQueue.close();
  process.exit(0);
});
