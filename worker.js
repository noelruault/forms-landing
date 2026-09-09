// Runs in front of the static assets to canonicalise the URL: plain HTTP and the www host both 301 to https://educacionabordo.com.
// Kept here instead of the zone's "Always Use HTTPS" toggle so the behaviour ships with the repo.
const CANONICAL_HOST = 'educacionabordo.com'

export default {
  fetch(request, env) {
    let url = new URL(request.url)
    if (url.protocol !== 'https:' || url.hostname !== CANONICAL_HOST) {
      url.protocol = 'https:'
      url.hostname = CANONICAL_HOST
      return Response.redirect(url.toString(), 301)
    }
    return env.ASSETS.fetch(request)
  },
}
