import { startOpenServRuntime } from "./openserv/start.mjs";

startOpenServRuntime()
  .then(({ role }) => {
    console.log(`OpenServ War Room started in ${role} mode`);
  })
  .catch((error) => {
    console.error("Failed to start OpenServ War Room:", error);
    process.exitCode = 1;
  });
