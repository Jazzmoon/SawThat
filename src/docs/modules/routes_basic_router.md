[backend](../README.md) / [Modules](../modules.md) / routes/basic.router

# Module: routes/basic.router

## Table of contents

### Functions

- [default](routes_basic_router.md#default)

## Functions

### default

▸ **default**(`instance`, `opts`, `done`): `void`

A universal router meant for handling requests that are non-node specific.

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
