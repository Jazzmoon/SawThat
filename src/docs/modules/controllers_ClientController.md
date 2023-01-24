[backend](../README.md) / [Modules](../modules.md) / controllers/ClientController

# Module: controllers/ClientController

## Table of contents

### Functions

- [joinGame](controllers_ClientController.md#joingame)

## Functions

### joinGame

▸ **joinGame**(`req`, `res`): `Promise`<`unknown`\>

Allow user to join a game assuming they provide
their username and the game code.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `FastifyRequest`<{ `Body`: { `game_code`: `string` ; `username`: `string`  }  }, `RawServerDefault`, `IncomingMessage`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`, `FastifyBaseLogger`, `ResolveFastifyRequestType`<`FastifyTypeProviderDefault`, `FastifySchema`, { `Body`: { `game_code`: `string` ; `username`: `string`  }  }\>\> | The user request containing their username and the game id. |
| `res` | `FastifyReply`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `RouteGenericInterface`, `unknown`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`\> | The response to indicate to the user whether that their request succeeded. |

#### Returns

`Promise`<`unknown`\>

A resolution, or rejection, to indicate if the request was successful.

#### Defined in

[controllers/ClientController.ts:21](https://github.com/Jazzmoon/SawThat/blob/bd5fc3d/src/server/controllers/ClientController.ts#L21)
