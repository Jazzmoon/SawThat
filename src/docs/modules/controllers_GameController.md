[backend](../README.md) / [Modules](../modules.md) / controllers/GameController

# Module: controllers/GameController

## Table of contents

### Functions

- [createGame](controllers_GameController.md#creategame)
- [nextPlayer](controllers_GameController.md#nextplayer)
- [startGame](controllers_GameController.md#startgame)

## Functions

### createGame

▸ **createGame**(`req`, `res`): `Promise`<`unknown`\>

Creates a game object from an incoming request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `FastifyRequest`<{ `Body`: { `themePack`: `string`  }  }, `RawServerDefault`, `IncomingMessage`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`, `FastifyBaseLogger`, `ResolveFastifyRequestType`<`FastifyTypeProviderDefault`, `FastifySchema`, { `Body`: { `themePack`: `string`  }  }\>\> | Incoming request object from the game node. |
| `res` | `FastifyReply`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `RouteGenericInterface`, `unknown`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`\> | Outgoing response handler. |

#### Returns

`Promise`<`unknown`\>

Returns a response wrapped in a promise to be handled by the Fastify router.

#### Defined in

[controllers/GameController.ts:58](https://github.com/Jazzmoon/SawThat/blob/bd5fc3d/src/server/controllers/GameController.ts#L58)

___

### nextPlayer

▸ **nextPlayer**(`gameID`, `currentPlayer`): `Promise`<`string`\>

Given a game id, prepare to start the game. To do so:
1. Randomize the player array to determine turn order.
2. Change the boolean in the game model to be True.
3. Return the username of the first player in the turn order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `gameID` | `string` | The Model Game ID within the database. |
| `currentPlayer` | `string` | The username of the player who's turn it just was. |

#### Returns

`Promise`<`string`\>

The username of the player next in the rotation.

#### Defined in

[controllers/GameController.ts:179](https://github.com/Jazzmoon/SawThat/blob/bd5fc3d/src/server/controllers/GameController.ts#L179)

___

### startGame

▸ **startGame**(`gameID`): `Promise`<`string`\>

Given a game id, prepare to start the game. To do so:
1. Randomize the player array to determine turn order.
2. Change the boolean in the game model to be True.
3. Return the username of the first player in the turn order.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `gameID` | `string` | The Model Game ID within the database. |

#### Returns

`Promise`<`string`\>

The username of the player first in the rotation.

#### Defined in

[controllers/GameController.ts:138](https://github.com/Jazzmoon/SawThat/blob/bd5fc3d/src/server/controllers/GameController.ts#L138)
