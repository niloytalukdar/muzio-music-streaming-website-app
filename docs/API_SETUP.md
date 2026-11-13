# Music Provider Setup

## Audius

Trending and track search use the official Audius API from the backend. The
adapter sends the configured `Audius:AppName` as the required `app_name`
parameter; no secret is exposed to the browser. The default application name
is `Muzio`.

The API marks tracks playable only when Audius reports them both streamable
and available. Downloads are marked available only when both the track and
its access metadata permit downloading. MUZIO does not download tracks
reported as restricted.

## Jamendo

Jamendo search and trending require a Jamendo API client ID. Set it with the
`Jamendo__ClientId` environment variable or an equivalent secret store. The
client ID is never embedded in source code. Without it, the provider is
disabled and logged; Audius continues to serve results.

If every configured provider fails and there are no local results, the API
returns an error and the dashboard shows an unavailable state. If at least one
provider succeeds, results from the working providers are returned. The app
does not substitute fabricated tracks.

## API configuration

The API listens on `http://localhost:5253` in the supplied launch profile. The
frontend's default API URL and the API's default allowed origin match this
setup; configure `NEXT_PUBLIC_API_BASE_URL` and `Frontend__AllowedOrigins` for
other environments.

In development, a random JWT signing key is generated for the lifetime of the
API process when `Jwt__Secret` is not set. Configure a secret of at least 32
bytes through a secret store for deployments; never commit it.
