# MixMonster

MixMonster is a small web tool for designing creative teaching and learning
settings. Teachers build a *collection*: a set of categories, each with a
list of criteria.
When the collection is used, the tool draws one criterion per category at
random and combines them into a "MixMonster", an unexpected scenario that a
group then works with.

The tool was built in 2021–2022 as a prototype in the HybridLR project at
TH Köln. The user interface is in German.

<p align="center">
  <img src="docs/screenshots/use.jpg" alt="Using a collection: one criterion drawn per category" width="760">
</p>

## Features

- Create, edit, preview and delete collections with categories and criteria
  (text and/or image per criterion, reorderable)
- Use a collection by reference number or link: random draw per category,
  optionally several criteria per category, re-roll single categories, and let
  participants narrow down a category's criteria before drawing
- Share a collection by link, reference number or QR code
- Export a collection as an Excel file and a drawn result as an image
- Login via Keycloak (OpenID Connect) for managing collections; using a
  shared collection needs no account

## Screenshots

The screenshots show the app with demo data.

| Start page | Your collections | Share by link or QR code |
|:-:|:-:|:-:|
| <img src="docs/screenshots/home.jpg" alt="Start page" width="280"> | <img src="docs/screenshots/collections.jpg" alt="List of collections" width="280"> | <img src="docs/screenshots/share.jpg" alt="Share dialog with QR code" width="280"> |

| Editing a collection | On a phone |
|:-:|:-:|
| <img src="docs/screenshots/edit.jpg" alt="Collection editor" width="420"> | <img src="docs/screenshots/mobile-use.jpg" alt="Drawing a MixMonster on a phone" width="200"> |

## The monsters

Each visit shows one of six MixMonster illustrations, picked at random. The
question-mark monster is the placeholder shown before the first draw.

| | | |
|:-:|:-:|:-:|
| <img src="docs/monsters/1-dice.png" alt="Monster with dice" width="220"> | <img src="docs/monsters/2-lab.png" alt="Monster in the lab" width="220"> | <img src="docs/monsters/3-slot-machine.png" alt="Monster at the Mix-it slot machine" width="220"> |
| Rolling the dice | In the lab | At the slot machine |
| <img src="docs/monsters/4-flipchart.png" alt="Monster at the flipchart" width="220"> | <img src="docs/monsters/5-wheel.png" alt="Monster with a wheel of fortune" width="220"> | <img src="docs/monsters/6-magic-hat.png" alt="Monster with a magic hat" width="220"> |
| At the flipchart | Wheel of fortune | Magic hat |

<p align="center"><img src="docs/monsters/question.png" alt="Question-mark monster" width="100"></p>

Illustrations by Sandy Linh Deimel, created for this project.

## Architecture

| Part | Stack |
|---|---|
| `mixmonster_frontend/` | Vue 2, TypeScript, Vuetify, Apollo Client, keycloak-js |
| `mixmonster_backend/` | Node.js, TypeScript, Fastify, GraphQL (graphql-helix, envelop auth), Mongoose |
| Database | MongoDB |
| Deployment | Docker Compose (frontend served by nginx) |

The GraphQL schema lives in `mixmonster_backend/src/schemas/schema.ts`;
TypeScript types are generated with GraphQL Code Generator (`npm run generate`).

## Running it locally

1. Copy `.env.example` to `.env` and fill in host, port and database values.
2. Copy `mixmonster_backend/keycloak.example.json` to `keycloak.json` and point
   it, and `mixmonster_frontend/public/keycloak.json`, to a Keycloak realm of
   your own. The original TH Köln realm is no longer active.
3. `docker compose up --build`

The frontend is then available on `MIXMONSTER_PORT`, the GraphQL API on port 4000.

## Status

Prototype, no longer maintained. Dependencies date from 2021 and have not
been updated.

## Credits

- Concept and development: Dennis Dubbert
- Illustrations (the monster images): Sandy Linh Deimel, created for this project

## Licence

Code: [MIT](LICENSE). The illustrations were created for MixMonster and are
not covered by the MIT licence; please ask before reusing them.
