import {DynaJobQueue} from "dyna-job-queue/web";
import {DynaDiskMemory} from "dyna-disk-memory/web";
import {exportWeb} from "../dyna/universalImport";

exportWeb({
  DynaJobQueue,
  DynaDiskMemory,
});

export {
  DynaQueueHandler,
  IDynaQueueHandlerConfig,
} from "./DynaQueueHandler";

