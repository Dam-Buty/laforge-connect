# La Forge Connect

This service provides a bi-lateral pipe between WhatsApp / SMS conversations and a Slack bot connected to a channel.

The scenario works as follows :

- A user sends a message to the La Forge Connect phone number
  - In this POC this is simulated by a request to the `/incoming` [endpoint](#Endpoints)
- The message is relayed on Slack in the dedicated channel
  - If it is the first message from this user a thread is created and associated to their phone number
  - If they already have a thread open the message is posted in this thread
- A Forgeron responds in the Slack thread
- The response message is sent to the user
  - In this POC it is simply [logged](<(src/services/send-response.ts)>) to the console

## Stack

The following tools are used in this project :

- [Express](https://expressjs.com/) (frugal HTTP server)
- [Bolt for JS](https://api.slack.com/tools/bolt-js) (Slack SDK)
- [Prisma](https://www.prisma.io/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (Database)

## Get started

### Requirements

To run this project locally you need the following installed :

- Node.js
- Docker

### Installing

```bash
# Install Node.js dependencies
npm install

# Run the PostgreSQL container
docker-compose up -d
```

### Setting up your Slack application

- Get the ID of the channel you want to work with
  - In the Slack client, right-click the name of the channel
  - Click "View channel details"
  - Copy the Channel ID (it's in tiny print at the bottom of the modal)
- Create a Slack application application [here](https://api.slack.com/apps?new_app=1&ref=bolt_start_hub)
- In the **Basic Information** tab : take note of the _Signing Secret_
- In the **Socket Mode** tab : click _Enable Socket Mode_
  - This will guide you to create an app-level token with the `connections:write` scope
  - take note of the token (it should start with `xapp-1`)
- In the **OAuth & Permissions** tab :
  - Add the following _Bot Token Scopes_ : `chat:write`, `channels:history`
  - Click on "Install to `workspace`"
  - Click "Allow" in the OAuth authorization page
  - Copy the _Bot User OAuth Token_ that was created (it should start with `xoxb`)
- In the **Event Subscriptions** tab :
  - Toggle _Enable Events_
  - In the _Subscribe to bot events_ section, add the following Event : `message.channels`
  - Click _Save Changes_

### Setting your environment variables

You can copy the `.env.example` file as `.env` and fill in the following values :

| Environment variable           | Value                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------- |
| **PORT**                       | This is the port on which the Express server will listen                              |
| **DATABASE_URL**               | In `postgresql://xx:xx@xx:xx/xx` format                                               |
| **SLACK_NOTIFICATION_CHANNEL** | This is the channel where the notifications are sent when a new client is registered. |
| **SLACK_SIGNING_SECRET**       | The signing secret of the Slack app. Get it in the **Basic Information** tab          |
| **SLACK_BOT_TOKEN**            | The bot token of the Slack app. Get it in the **OAuth & Permissions** tab             |
| **SLACK_APP_TOKEN**            | The app token of the Slack app. Get it in the **Basic Information** tab               |

### Running the project

```bash
# Run in dev mode with live-reload
npm run dev

# Run in production
npm start
```

If everything is well configured you should see the following logs, confirming that the connection to the Slack app is functioning :

```
[INFO]  socket-mode:SocketModeClient:0 Going to establish a new connection to Slack ...
⚡️ Slack app is listening!
[INFO]  socket-mode:SocketModeClient:0 Now connected to Slack
```

## Simulating a message

To simulate receiving a message from a user, you just need to make an HTTP request using curl :

```sh
curl --request POST \
  --url http://localhost:3005/incoming \
  --header 'Content-Type: application/json' \
  --header 'User-Agent: insomnia/2023.5.8' \
  --data '{
	"payload": {
		"phoneNumber": "+33651425444",
		"message": "Comment faire une billion dollar company ?"
	}
}'
```

Or [Insomnia](https://insomnia.rest/) / [Postman](https://www.postman.com/) with the following parameters :

- **Method** : POST
- **Endpoint** : `/incoming`
- **Content-Type** : `application/json`
- **Body**

```json
{
  "payload": {
    "phoneNumber": "+33651425444",
    "message": "Comment faire une billion dollar company ?"
  }
}
```

HTTP Response:

- **200** : Message was received
- **400** : The JSON body is not valid
- **500** : An unknown error happened (see logs)
