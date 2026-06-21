/*
 * LoomLance splash <-> dashboard auth glue.
 *
 * Static site (no build step): include AFTER the supabase-js UMD (provides window.supabase).
 * Uses the SAME Supabase project as the dashboard, so accounts/sessions are shared. After
 * authenticating here we hand the session off to the dashboard via the URL token hash, which
 * the dashboard's supabase client (detectSessionInUrl) auto-consumes — no dashboard change.
 *
 *   <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
 *   <script src="auth-loomlance.js"></script>
 */
(function () {
  // --- Config (anon key is public by design; shared with the dashboard project) ---
  var SUPABASE_URL = 'https://zbipqfsqxnvrzhpdjvvy.supabase.co'
  var SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiaXBxZnNxeG52cnpocGRqdnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMjA4OTMsImV4cCI6MjA5NjU5Njg5M30.jcYv8brQ8PrkVP50lALjV-doptljLz2Y8-vtjjhtsF0'
  // Where to send the user after auth. Hostname-aware so the same static files work both
  // locally (dashboard preview on :4173) and in production (deployed dashboard subdomain).
  var host = window.location.hostname
  var isLocal = host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0'
  var DASHBOARD_URL = isLocal ? 'http://localhost:4173' : 'https://app.loomlance.com'

  if (!window.supabase || !window.supabase.createClient) {
    console.error('[LoomAuth] supabase-js must load before auth-loomlance.js')
    return
  }

  // Splash doesn't persist a session — it hands off to the dashboard, which owns the session.
  var client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  // Redirect to the dashboard with the implicit-flow token hash (same shape Supabase magic
  // links use); the dashboard's client picks it up and signs the user in.
  function handoff(session) {
    if (!session || !session.access_token) return false
    var p = new URLSearchParams({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
      expires_in: String(session.expires_in || 3600),
      token_type: session.token_type || 'bearer',
      type: 'magiclink',
    })
    window.location.href = DASHBOARD_URL + '/#' + p.toString()
    return true
  }

  // Friendlier messages for the common Supabase auth errors.
  function friendly(err) {
    var m = (err && (err.message || err.error_description)) || 'Something went wrong'
    if (/invalid login credentials/i.test(m)) return 'Wrong email or password.'
    if (/email not confirmed/i.test(m)) return 'Please confirm your email first — check your inbox.'
    if (/user already registered|already.*exists/i.test(m)) return 'An account with this email already exists. Try signing in.'
    if (/password/i.test(m) && /at least|weak|short/i.test(m)) return 'Password is too weak.'
    if (/rate limit|too many/i.test(m)) return 'Too many attempts — please wait a moment and try again.'
    return m
  }

  window.LoomAuth = {
    client: client,
    dashboardUrl: DASHBOARD_URL,
    handoff: handoff,
    friendly: friendly,

    // Returns { session } on success and redirects; throws on failure.
    signIn: async function (email, password) {
      var r = await client.auth.signInWithPassword({ email: email, password: password })
      if (r.error) throw r.error
      handoff(r.data.session)
      return r.data
    },

    // Returns { needsConfirmation: bool }. When confirmation is off, hands off immediately.
    signUp: async function (email, password, meta) {
      var r = await client.auth.signUp({
        email: email,
        password: password,
        options: { data: meta || {}, emailRedirectTo: DASHBOARD_URL },
      })
      if (r.error) throw r.error
      if (r.data.session) {
        handoff(r.data.session)
        return { needsConfirmation: false }
      }
      return { needsConfirmation: true }
    },
  }
})()
