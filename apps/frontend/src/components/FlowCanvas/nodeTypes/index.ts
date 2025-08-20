import { ActionNode } from "./ActionNode";
import { ConditionNode } from "./ConditionNode";
import { InputNode } from "./InputNode";
import { MessageNode } from "./MessageNode";
import { SplitNode } from "./SplitNode";

export const nodeTypes = {
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  input: InputNode,
  split: SplitNode,
};