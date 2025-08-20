import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { z } from "zod";
import { FlowModel, NodeModel, EdgeModel, SessionModel } from "./models.js";
import { actionsQueue, actionsWorker } from "./queues.js";

dotenv.config();
const app = Fastify({ logger: true });

await app.register(cors, { origin: true });

await mongoose.connect(process.env.MONGODB_URI!);

// health
app.get("/health", async () => ({ status: "ok" }));

// CRUD: Flows
app.get("/flows", async () => FlowModel.find().lean());
app.post("/flows", async (req, reply) => {
  const body = z.object({
    name: z.string().min(1),
    description: z.string().optional()
  }).parse(req.body);
  const created = await FlowModel.create(body);
  reply.code(201).send(created);
});

// Nodes
app.get("/flows/:id/nodes", async (req:any) => NodeModel.find({ flowId: req.params.id }).lean());
app.post("/flows/:id/nodes", async (req:any, reply) => {
  const body = z.object({
    type: z.enum(["message","condition","action","input","split"]),
    name: z.string(),
    config: z.any().optional()
  }).parse(req.body);
  const created = await NodeModel.create({ ...body, flowId: req.params.id });
  reply.code(201).send(created);
});

// Edges
app.get("/flows/:id/edges", async (req:any) => EdgeModel.find({ flowId: req.params.id }).lean());
app.post("/flows/:id/edges", async (req:any, reply) => {
  const body = z.object({
    from: z.string(),
    to: z.string(),
    condition: z.any().optional()
  }).parse(req.body);
  const created = await EdgeModel.create({ ...body, flowId: req.params.id });
  reply.code(201).send(created);
});

// Вебхук адаптера (telegram)
app.post("/webhook/incoming", async (req:any) => {
  // { externalUserId, text }
  const payload = z.object({ externalUserId: z.string(), text: z.string().default("") }).parse(req.body);

  // одна flow сессия на всех
  const flow = await FlowModel.findOne().lean();
  const session = await SessionModel.findOneAndUpdate(
    { externalUserId: payload.externalUserId, flowId: flow?._id },
    { $setOnInsert: { flowId: flow?._id } },
    { upsert: true, new: true }
  );

  // ищем ребро по условию text.equals
  const nodes = await NodeModel.find({ flowId: flow!._id }).lean();
  const edges = await EdgeModel.find({ flowId: flow!._id }).lean();

  const currentNodeId = session.cursorNodeId ?? nodes.find(n => n.type === "input")?._id;

  // ищем подходящее ребро
  const outgoing = edges.filter(e => String(e.from) === String(currentNodeId));
  const matched = outgoing.find(e => e.condition?.equals?.toLowerCase?.() === payload.text.toLowerCase());

  let nextNode = nodes.find(n => String(n._id) === String(matched?.to));
  if (!nextNode) {
    // не понял
    nextNode = nodes.find(n => n.type === "message" && n.name === "fallback");
  }

  await SessionModel.updateOne({ _id: session._id }, { cursorNodeId: nextNode?._id });

  // если действие — в очередь
  if (nextNode?.type === "action") {
    await actionsQueue.add("run", { actionKey: nextNode.config?.actionKey, payload: nextNode.config?.payload });
    return { reply: "Выполняю действие…" };
  }

  // если сообщение
  if (nextNode?.type === "message") {
    return { reply: nextNode.config?.text ?? "…" };
  }

  return { reply: "Ок" };
});

const port = Number(process.env.PORT || 4000);
app.listen({ port, host: "0.0.0.0" }).catch((e) => {
  app.log.error(e);
  process.exit(1);
});
