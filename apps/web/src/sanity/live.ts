import { defineLive } from "next-sanity/live"
import { client } from "./client"
import { readToken } from "./env"

const token = readToken || false

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
