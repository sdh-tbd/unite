import { defineCliConfig } from "sanity/cli"
import { appId, dataset, projectId } from "./src/env"

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    autoUpdates: true,
    ...(appId ? { appId } : {}),
  },
  typegen: {
    enabled: true,
    path: "../web/src/**/*.{ts,tsx}",
    schema: "schema.json",
    generates: "../web/sanity.types.ts",
    overloadClientMethods: true,
  },
})
