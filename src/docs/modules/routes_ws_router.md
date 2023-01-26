[server](../README.md) / [Modules](../modules.md) / routes/ws.router

# Module: routes/ws.router

## Table of contents

### Functions

- [default](routes_ws_router.md#default)

## Functions

### default

▸ **default**(`instance`, `opts`, `done`): `void`

The handling function for the websocket router.
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
