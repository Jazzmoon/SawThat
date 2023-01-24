[backend](../README.md) / [Modules](../modules.md) / routes/game.router

# Module: routes/game.router

## Table of contents

### Functions

- [default](routes_game_router.md#default)

## Functions

### default

▸ **default**(`instance`, `opts`, `done`): `void`

The handling function for the game node router.
It receives a request and various parameters, and handles it appropriately.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `instance` | `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\> | - |
| `opts` | `Record`<`never`, `never`\> | Configuration options relevant to only this specific sub-router. |
| `done` | (`err?`: `Error`) => `void` | Function that indicates the end of definitions. |

#### Returns

`void`

#### Defined in

node_modules/fastify/types/plugin.d.ts:13
