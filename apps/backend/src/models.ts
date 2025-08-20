import mongoose, {Schema} from "mongoose";

const NodeSchema = new Schema({
  flowId: { type: Schema.Types.ObjectId, ref: "Flow", index: true, required: true },
  type: { type: String, enum: ["message","condition","action","input","split"], required: true },
  name: { type: String, required: true },
  config: { type: Schema.Types.Mixed, default: {} } // текст, regex, httpPayload и т.п.
}, { timestamps: true });

const EdgeSchema = new Schema({
  flowId: { type: Schema.Types.ObjectId, ref: "Flow", index: true, required: true },
  from: { type: Schema.Types.ObjectId, ref: "Node", required: true },
  to: { type: Schema.Types.ObjectId, ref: "Node", required: true },
  condition: { type: Schema.Types.Mixed, default: {} } // { equals: "привет" }
}, { timestamps: true });

const FlowSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  version: { type: Number, default: 1 }
}, { timestamps: true });

const ActionTemplateSchema = new Schema({
  key: { type: String, unique: true, required: true }, // "httpRequest", "searchApartments"
  displayName: String,
  schema: Schema.Types.Mixed // Zod-подобное описание 
}, { timestamps: true });

const SessionSchema = new Schema({
  flowId: { type: Schema.Types.ObjectId, ref: "Flow", index: true },
  externalUserId: String, // chat id
  cursorNodeId: { type: Schema.Types.ObjectId, ref: "Node" },
  context: { type: Schema.Types.Mixed, default: {} }
}, { timestamps: true });

export const NodeModel = mongoose.model("Node", NodeSchema);
export const EdgeModel = mongoose.model("Edge", EdgeSchema);
export const FlowModel = mongoose.model("Flow", FlowSchema);
export const ActionTemplateModel = mongoose.model("ActionTemplate", ActionTemplateSchema);
export const SessionModel = mongoose.model("Session", SessionSchema);
