[server](../README.md) / [Modules](../modules.md) / controllers/GameController

# Module: controllers/GameController

## Table of contents

### Functions

- [checkWinner](controllers_GameController.md#checkwinner)
- [createGame](controllers_GameController.md#creategame)
- [handleConsequence](controllers_GameController.md#handleconsequence)
- [nextPlayer](controllers_GameController.md#nextplayer)
- [questionAnswer](controllers_GameController.md#questionanswer)
- [questionEnd](controllers_GameController.md#questionend)
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

[controllers/GameController.ts:693](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L693)

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

[controllers/GameController.ts:99](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L99)

___

### handleConsequence

▸ **handleConsequence**(`connections`, `game`, `data`, `early`): `Promise`<`void`\>

Handle consequence timeout or ending early.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connections` | `Object` | The websocket information of all players connected to the specific game. |
| `connections.clients` | `ClientConn`[] | - |
| `connections.host` | `ClientConn` | - |
| `connections.turn?` | `Object` | - |
| `connections.turn.movement_die` | `number` | - |
| `connections.turn.timeout?` | `Timeout` | - |
| `connections.turn.turn_start` | `number` | - |
| `game` | `PopulatedGame` | The populated game instance to fetch information about the current game state. |
| `data` | `WebsocketRequest` | Information related to the request, such as request id. |
| `early` | `boolean` | Is this request ending the game before the timeout? |

#### Returns

`Promise`<`void`\>

This is a mutation function in which modifies the next game state and sends it to the players.

#### Defined in

[controllers/GameController.ts:630](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L630)

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

[controllers/GameController.ts:231](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L231)

___

### questionAnswer

▸ **questionAnswer**(`connections`, `data`, `username`, `game`): `Promise`<`boolean`\>

Handle a user sending an answer request to the server

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connections` | `Object` | The websocket information of all players connected to the specific game. |
| `connections.clients` | `ClientConn`[] | - |
| `connections.host` | `ClientConn` | - |
| `connections.turn?` | `Object` | - |
| `connections.turn.movement_die` | `number` | - |
| `connections.turn.timeout?` | `Timeout` | - |
| `connections.turn.turn_start` | `number` | - |
| `data` | `WebsocketRequest` | Information related to the request, such as request id and the question answer. |
| `username` | `string` | The username of the user who send the websocket request. |
| `game` | `PopulatedGame` | The populated game instance to fetch information about the current game state. |

#### Returns

`Promise`<`boolean`\>

Whether the answer submitted is, or is not, correct.

#### Defined in

[controllers/GameController.ts:496](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L496)

___

### questionEnd

▸ **questionEnd**(`connections`, `game`, `data`, `early`): `Promise`<`void`\>

The question has ended, either by timeout or by answer. Handle accordingly.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `connections` | `Object` | The websocket information of all players connected to the specific game. |
| `connections.clients` | `ClientConn`[] | - |
| `connections.host` | `ClientConn` | - |
| `connections.turn?` | `Object` | - |
| `connections.turn.movement_die` | `number` | - |
| `connections.turn.timeout?` | `Timeout` | - |
| `connections.turn.turn_start` | `number` | - |
| `game` | `PopulatedGame` | The populated game instance to fetch information about the current game state. |
| `data` | `WebsocketRequest` | Information related to the request, such as request id. |
| `early` | `boolean` | Is this request ending the game before the timeout? |

#### Returns

`Promise`<`void`\>

This is a mutation function in which modifies the next game state and sends it to the players.

#### Defined in

[controllers/GameController.ts:561](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L561)

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

[controllers/GameController.ts:193](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L193)

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
| `connections.turn.timeout?` | `Timeout` | - |
| `connections.turn.turn_start` | `number` | - |
| `data` | `WebsocketRequest` | Any relevant data that the game node sends across the websocket stream. |
| `game` | `PopulatedGame` | The game state. We know that the sender of these messages is the game node. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[controllers/GameController.ts:271](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L271)
