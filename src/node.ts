import {DynaJobQueue} from "dyna-job-queue/node";
import {DynaDiskMemory} from "dyna-disk-memory/node";
import {exportNode} from "../dyna/universalImport";

exportNode({
  DynaJobQueue,
  DynaDiskMemory,
});

export {
  DynaQueueHandler,
  IDynaQueueHandlerConfig,
} from "./DynaQueueHandler";

