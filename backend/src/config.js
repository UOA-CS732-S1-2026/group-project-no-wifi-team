function requireEnv(name, devFallback) {
  const value = process.env[name]
  if (value) return value
  if (process.env.NODE_ENV === 'production') {
    throw new Error(`${name} environment variable is required in production`)
  }
  console.warn(`${name} is not set — using dev fallback. Do NOT use in production.`)
  return devFallback
}

export const JWT_SECRET = requireEnv('JWT_SECRET', 'no-wifi-team-jwt-secret-dev')
export const GOOGLE_CLIENT_ID = requireEnv('GOOGLE_CLIENT_ID', '')
