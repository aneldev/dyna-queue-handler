export {
  DynaQueueHandler,
  IDynaQueueHandlerConfig,
} from "./DynaQueueHandler";

console.error(`
dyna-queue-handler: Import error
    You should import "dyna-queue-handler/web" or "dyna-queue-handler/node" (with lazy  or not) according the runtime environment.
    For typescript, you should import the types from "dyna-queue-handler" but functional code from web or node versions.
    More for how to import with conditional lazy load: https://github.com/aneldev/dyna-ts-module-boilerplate#how-to-import
`);
