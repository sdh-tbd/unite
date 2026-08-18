function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

export const projectId = required("SANITY_STUDIO_PROJECT_ID", process.env.SANITY_STUDIO_PROJECT_ID)

export const dataset = required("SANITY_STUDIO_DATASET", process.env.SANITY_STUDIO_DATASET)

export const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL ?? "http://localhost:3000"

export const apiVersion = process.env.SANITY_STUDIO_API_VERSION ?? "2026-08-11"
