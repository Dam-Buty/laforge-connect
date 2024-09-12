# Literal Authorization Service

This service is used to authorize a given company to use our public Docker image.

## How it works

When a new Docker image is being built, this service will generate a version key for it. This version key is then used to encrypt the server bundle on the Docker image.

When a new client requests access to the Docker image, their company will be registered on this service and assigned an authorization token.

When the client boots up their Docker image with the right environment variables, the startup script will request the version key from this service, providing their client ID and authorization token. The version key will then be used to decrypt the server bundle.

## Get started

This service is based on a simple Express server that communicates with a Redis database.

```bash
# Install dependencies
pnpm install

# Run the Redis container
docker-compose up -d

# Run in production
pnpm start

# Run in development
pnpm dev
```

## Required environment variables

The defaults can be found in [src/config.ts](src/config.ts).

- `LITERAL_AUTH_SECRET_KEY`: This secret key is unique to Literal and should never be communicated to anyone. It allows both the Docker build script and the form on the Literal website to register versions and clients.
- `PORT`
- `DATABASE_URL` : `postgresql://xx:xx@xx:xx/xx`
- `SLACK_NOTIFICATION_CHANNEL` : This is the channel where the notifications are sent when a new client is registered.
- `SLACK_SIGNING_SECRET` : The signing secret of the Slack app. Get it [here](https://api.slack.com/apps/A076AQ1J24Q)
- `SLACK_BOT_TOKEN` : The bot token of the Slack app. Get it [here](https://api.slack.com/apps/A076AQ1J24Q/oauth)
- `SLACK_APP_TOKEN` : The app token of the Slack app. Get it [here](https://api.slack.com/apps/A076AQ1J24Q)
- `EMAIL_SERVER_HOST` : The SMTP server host
- `EMAIL_SERVER_PORT` : The SMTP server port
- `EMAIL_FROM` : The email address that will be used to send the emails

## Endpoints

You can test the endpoints on [Insomnia](https://insomnia.rest/) using [this collection](insomnia.json).

### POST /register-version

Registers a new version of the server bundle and assigns a version key to it.

HTTP Headers:

- `x-literal-auth-secret-key`: The secret key that allows the registration of new versions & clients. It will be checked against the `LITERAL_AUTH_SECRET_KEY` environment variable.

JSON Body:

```json
{
  "versionId": "x.y.z"
}
```

Response:

```json
{
  "versionId": "x.y.z",
  "versionKey": "abc123"
}
```

### POST /register-client

Registers a new client and assigns an authorization token to it. An email containing the client ID and authorization token will be sent to the provided email address.

⚠️ The email needs to be a company email and not a personal one (gmail, etc...).

JSON Body:

```json
{
  "userName": "Jean-Luc Yaourtaboire",
  "userPosition": "Chief Dairy Officer",
  "userCompany": "Yop Inc.",
  "userEmail": "jean-luc@yop.com"
}
```

Response:

```json
{
  "clientId": "yop-inc"
}
```

### POST /version-key

Authenticates a client with their ID and authorization token and returns the version key for the requested version.

HTTP Headers:

- `x-literal-client-id`: The client ID that was assigned when registering the client.
- `x-literal-auth-token`: The authorization token that was sent to the client's email.

Query parameters:

- `versionId`: The client ID that was assigned when registering the client.

Response:

```json
{
  "versionKey": "abc123"
}
```
