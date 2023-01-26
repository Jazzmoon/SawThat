[server](../README.md) / [Modules](../modules.md) / controllers/GameController

# Module: controllers/GameController

## Table of contents

### Functions

- [checkWinner](controllers_GameController.md#checkwinner)
- [createGame](controllers_GameController.md#creategame)
- [nextPlayer](controllers_GameController.md#nextplayer)
- [questionAnswer](controllers_GameController.md#questionanswer)
- [startGame](controllers_GameController.md#startgame)
- [turn](controllers_GameController.md#turn)

## Functions

### checkWinner

▸ **checkWinner**(`gameID`): `Promise`<`string` \| `boolean`\>

Check if any players are in the winner state.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `gameID` | `string` | The game code string for the game you want to check the winner of. |

#### Returns

`Promise`<`string` \| `boolean`\>

#### Defined in

[controllers/GameController.ts:596](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/GameController.ts#L596)

___

### createGame

▸ **createGame**(`req`, `res`): `Promise`<`unknown`\>

Creates a game object from an incoming request.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `req` | `FastifyRequest`<{ `Body`: { `theme_pack`: `string`  }  }, `RawServerDefault`, `IncomingMessage`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`, `FastifyBaseLogger`, `ResolveFastifyRequestType`<`FastifyTypeProviderDefault`, `FastifySchema`, { `Body`: { `theme_pack`: `string`  }  }\>\> | Incoming request object from the game node. |
| `res` | `FastifyReply`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `RouteGenericInterface`, `unknown`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`\> | Outgoing response handler. |

#### Returns

`Promise`<`unknown`\>

Returns a response wrapped in a promise to be handled by the Fastify router.

#### Defined in

[controllers/GameController.ts:98](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/GameController.ts#L98)

___

### nextPlayer

▸ **nextPlayer**(`gameID`): `Promise`<`string`\>

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

The username of the player next in the rotation.

#### Defined in

[controllers/GameController.ts:230](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/GameController.ts#L230)

___

### questionAnswer

▸ **questionAnswer**(`connections`, `data`, `username`, `game`): `Promise`<`boolean`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `connections` | `Object` |
| `connections.clients` | `ClientConn`[] |
| `connections.host` | `ClientConn` |
| `connections.turn?` | `Object` |
| `connections.turn.movement_die` | `number` |
| `connections.turn.turn_end` | `number` |
| `data` | `WebsocketRequest` |
| `username` | `string` |
| `game` | `PopulatedGame` |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[controllers/GameController.ts:497](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/GameController.ts#L497)

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

[controllers/GameController.ts:192](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/GameController.ts#L192)

___

### turn

▸ **turn**(`connections`, `data`, `game`): `Promise`<`boolean`\>

Handle the turn logic for a single round of the game, triggered by the game node sending a message.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connections` | `Object` | List of all Websockets relevant to the game that this turn is for. |
| `connections.clients` | `ClientConn`[] | - |
| `connections.host` | `ClientConn` | - |
| `connections.turn?` | `Object` | - |
| `connections.turn.movement_die` | `number` | - |
| `connections.turn.turn_end` | `number` | - |
| `data` | `WebsocketRequest` | Any relevant data that the game node sends across the websocket stream. |
| `game` | `PopulatedGame` | The game state. We know that the sender of these messages is the game node. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[controllers/GameController.ts:270](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/GameController.ts#L270)
