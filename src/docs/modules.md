## Server Node

### Module: controllers/AuthController

### Functions

#### generateJWT

▸ **generateJWT**(`requestData`): `Promise`<`string`\>

Generate the user access token that identifies each connected user, and create their user within the database.

##### Parameters

| Name                   | Type                       | Description                                                                                  |
| :--------------------- | :------------------------- | :------------------------------------------------------------------------------------------- |
| `requestData`          | `Object`                   | The username, game code, and type of user in which is generating their authentication token. |
| `requestData.color?`   | `Color`                    | If the user is a client node user, they will provide the color for their player piece.       |
| `requestData.gameCode` | `string`                   | The game code for the game that the user is going to be related to.                          |
| `requestData.userType` | ``"Game"`` \| ``"Client"`` | Whether the user being created is a game or client node user.                                |
| `requestData.username` | `string`                   | The username of the user sending te request to generate a JWT token.                         |

##### Returns

`Promise`<`string`\>

Resolution code with JWT embedded.

##### Defined in

[controllers/AuthController.ts:23](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/AuthController.ts#L23)


## Module: controllers/ClientController

### Functions

#### joinGame

▸ **joinGame**(`req`, `res`): `Promise`<`unknown`\>

Allow user to join a game assuming they provide
their username and the game code.

##### Parameters

| Name  | Type                                                                                                                                                                                                                                                                                                                                                 | Description                                                                |
| :---- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- |
| `req` | `FastifyRequest`<{ `Body`: { `game_code`: `string` ; `username`: `string`  }  }, `RawServerDefault`, `IncomingMessage`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`, `FastifyBaseLogger`, `ResolveFastifyRequestType`<`FastifyTypeProviderDefault`, `FastifySchema`, { `Body`: { `game_code`: `string` ; `username`: `string`  }  }\>\> | The user request containing their username and the game id.                |
| `res` | `FastifyReply`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `RouteGenericInterface`, `unknown`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`\>                                                                                                                                                           | The response to indicate to the user whether that their request succeeded. |

##### Returns

`Promise`<`unknown`\>

A resolution, or rejection, to indicate if the request was successful.

##### Defined in

[controllers/ClientController.ts:21](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/ClientController.ts#L21)

## Module: controllers/GameController

### Functions

#### checkWinner

▸ **checkWinner**(`gameID`): `Promise`<`string` \| `boolean`\>

Check if any players are in the winner state.

##### Parameters

| Name     | Type     | Description                                                        |
| :------- | :------- | :----------------------------------------------------------------- |
| `gameID` | `string` | The game code string for the game you want to check the winner of. |

##### Returns

`Promise`<`string` \| `boolean`\>

##### Defined in

[controllers/GameController.ts:693](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L693)

___

#### createGame

▸ **createGame**(`req`, `res`): `Promise`<`unknown`\>

Creates a game object from an incoming request.

##### Parameters

| Name  | Type                                                                                                                                                                                                                                                                                                     | Description                                 |
| :---- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------ |
| `req` | `FastifyRequest`<{ `Body`: { `theme_pack`: `string`  }  }, `RawServerDefault`, `IncomingMessage`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`, `FastifyBaseLogger`, `ResolveFastifyRequestType`<`FastifyTypeProviderDefault`, `FastifySchema`, { `Body`: { `theme_pack`: `string`  }  }\>\> | Incoming request object from the game node. |
| `res` | `FastifyReply`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `RouteGenericInterface`, `unknown`, `FastifySchema`, `FastifyTypeProviderDefault`, `unknown`\>                                                                                                               | Outgoing response handler.                  |

##### Returns

`Promise`<`unknown`\>

Returns a response wrapped in a promise to be handled by the Fastify router.

##### Defined in

[controllers/GameController.ts:99](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L99)

___

#### handleConsequence

▸ **handleConsequence**(`connections`, `game`, `data`, `early`): `Promise`<`void`\>

Handle consequence timeout or ending early.

##### Parameters

| Name                            | Type               | Description                                                                    |
| :------------------------------ | :----------------- | :----------------------------------------------------------------------------- |
| `connections`                   | `Object`           | The websocket information of all players connected to the specific game.       |
| `connections.clients`           | `ClientConn`[]     | -                                                                              |
| `connections.host`              | `ClientConn`       | -                                                                              |
| `connections.turn?`             | `Object`           | -                                                                              |
| `connections.turn.movement_die` | `number`           | -                                                                              |
| `connections.turn.timeout?`     | `Timeout`          | -                                                                              |
| `connections.turn.turn_start`   | `number`           | -                                                                              |
| `game`                          | `PopulatedGame`    | The populated game instance to fetch information about the current game state. |
| `data`                          | `WebsocketRequest` | Information related to the request, such as request id.                        |
| `early`                         | `boolean`          | Is this request ending the game before the timeout?                            |

##### Returns

`Promise`<`void`\>

This is a mutation function in which modifies the next game state and sends it to the players.

##### Defined in

[controllers/GameController.ts:630](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L630)

___

#### nextPlayer

▸ **nextPlayer**(`gameID`): `Promise`<`string`\>

Given a game id, prepare to start the game. To do so:
1. Randomize the player array to determine turn order.
2. Change the boolean in the game model to be True.
3. Return the username of the first player in the turn order.

##### Parameters

| Name     | Type     | Description                            |
| :------- | :------- | :------------------------------------- |
| `gameID` | `string` | The Model Game ID within the database. |

##### Returns

`Promise`<`string`\>

The username of the player next in the rotation.

##### Defined in

[controllers/GameController.ts:231](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L231)

___

#### questionAnswer

▸ **questionAnswer**(`connections`, `data`, `username`, `game`): `Promise`<`boolean`\>

Handle a user sending an answer request to the server

##### Parameters

| Name                            | Type               | Description                                                                     |
| :------------------------------ | :----------------- | :------------------------------------------------------------------------------ |
| `connections`                   | `Object`           | The websocket information of all players connected to the specific game.        |
| `connections.clients`           | `ClientConn`[]     | -                                                                               |
| `connections.host`              | `ClientConn`       | -                                                                               |
| `connections.turn?`             | `Object`           | -                                                                               |
| `connections.turn.movement_die` | `number`           | -                                                                               |
| `connections.turn.timeout?`     | `Timeout`          | -                                                                               |
| `connections.turn.turn_start`   | `number`           | -                                                                               |
| `data`                          | `WebsocketRequest` | Information related to the request, such as request id and the question answer. |
| `username`                      | `string`           | The username of the user who send the websocket request.                        |
| `game`                          | `PopulatedGame`    | The populated game instance to fetch information about the current game state.  |

##### Returns

`Promise`<`boolean`\>

Whether the answer submitted is, or is not, correct.

##### Defined in

[controllers/GameController.ts:496](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L496)

___

#### questionEnd

▸ **questionEnd**(`connections`, `game`, `data`, `early`): `Promise`<`void`\>

The question has ended, either by timeout or by answer. Handle accordingly.

##### Parameters

| Name                            | Type               | Description                                                                    |
| :------------------------------ | :----------------- | :----------------------------------------------------------------------------- |
| `connections`                   | `Object`           | The websocket information of all players connected to the specific game.       |
| `connections.clients`           | `ClientConn`[]     | -                                                                              |
| `connections.host`              | `ClientConn`       | -                                                                              |
| `connections.turn?`             | `Object`           | -                                                                              |
| `connections.turn.movement_die` | `number`           | -                                                                              |
| `connections.turn.timeout?`     | `Timeout`          | -                                                                              |
| `connections.turn.turn_start`   | `number`           | -                                                                              |
| `game`                          | `PopulatedGame`    | The populated game instance to fetch information about the current game state. |
| `data`                          | `WebsocketRequest` | Information related to the request, such as request id.                        |
| `early`                         | `boolean`          | Is this request ending the game before the timeout?                            |

##### Returns

`Promise`<`void`\>

This is a mutation function in which modifies the next game state and sends it to the players.

##### Defined in

[controllers/GameController.ts:561](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L561)

___

#### startGame

▸ **startGame**(`gameID`): `Promise`<`string`\>

Given a game id, prepare to start the game. To do so:
1. Randomize the player array to determine turn order.
2. Change the boolean in the game model to be True.
3. Return the username of the first player in the turn order.

##### Parameters

| Name     | Type     | Description                            |
| :------- | :------- | :------------------------------------- |
| `gameID` | `string` | The Model Game ID within the database. |

##### Returns

`Promise`<`string`\>

The username of the player first in the rotation.

##### Defined in

[controllers/GameController.ts:193](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L193)

___

#### turn

▸ **turn**(`connections`, `data`, `game`): `Promise`<`boolean`\>

Handle the turn logic for a single round of the game, triggered by the game node sending a message.

##### Parameters

| Name                            | Type               | Description                                                                 |
| :------------------------------ | :----------------- | :-------------------------------------------------------------------------- |
| `connections`                   | `Object`           | List of all Websockets relevant to the game that this turn is for.          |
| `connections.clients`           | `ClientConn`[]     | -                                                                           |
| `connections.host`              | `ClientConn`       | -                                                                           |
| `connections.turn?`             | `Object`           | -                                                                           |
| `connections.turn.movement_die` | `number`           | -                                                                           |
| `connections.turn.timeout?`     | `Timeout`          | -                                                                           |
| `connections.turn.turn_start`   | `number`           | -                                                                           |
| `data`                          | `WebsocketRequest` | Any relevant data that the game node sends across the websocket stream.     |
| `game`                          | `PopulatedGame`    | The game state. We know that the sender of these messages is the game node. |

##### Returns

`Promise`<`boolean`\>

##### Defined in

[controllers/GameController.ts:271](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/GameController.ts#L271)

## Module: controllers/QuizController

### Functions

#### formatConsequence

▸ **formatConsequence**(`theme_pack_name`, `used_consequences`): `Promise`<`Consequence`\>

Generate a consequence for the game.

##### Parameters

| Name                | Type       | Description                           |
| :------------------ | :--------- | :------------------------------------ |
| `theme_pack_name`   | `string`   | The name of the theme pack file.      |
| `used_consequences` | `number`[] | List of already used consequence ids. |

##### Returns

`Promise`<`Consequence`\>

The consequence fetched for the game.

##### Defined in

[controllers/QuizController.ts:169](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/QuizController.ts#L169)

___

#### formatQuestion

▸ **formatQuestion**(`theme_pack_name`, `category`, `question_type`, `used_questions`): `Promise`<{ `id`: `number` ; `media_type`: ``null`` \| ``"image"`` \| ``"video"`` ; `media_url`: ``null`` \| `string` ; `options`: `string`[] ; `question`: `string`  }\>

Fetches a random question from the given theme pack, formatted for display.

##### Parameters

| Name              | Type                                         | Description                                                             |
| :---------------- | :------------------------------------------- | :---------------------------------------------------------------------- |
| `theme_pack_name` | `string`                                     | Name of the Theme Pack file in which a question is being generated for. |
| `category`        | `string`                                     | The name of the category that the question must belong to.              |
| `question_type`   | ``"Multiple Choice"`` \| ``"Text Question"`` | Denotes whether the question is multiple choice or text.                |
| `used_questions`  | `number`[]                                   | A list of question ids in which have already been used by the game.     |

##### Returns

`Promise`<{ `id`: `number` ; `media_type`: ``null`` \| ``"image"`` \| ``"video"`` ; `media_url`: ``null`` \| `string` ; `options`: `string`[] ; `question`: `string`  }\>

Formatted question data, loaded from file.

##### Defined in

[controllers/QuizController.ts:70](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/QuizController.ts#L70)

___

#### validateAnswer

▸ **validateAnswer**(`themePackName`, `questionID`, `questionCategory`, `userAnswer`, `questionType?`): `Promise`<`boolean`\>

Returns whether or not a user's answer to a question is correct.

##### Parameters

| Name               | Type     | Description                                                                    |
| :----------------- | :------- | :----------------------------------------------------------------------------- |
| `themePackName`    | `string` | Name of the Theme Pack file in which a question needs to be validated against. |
| `questionID`       | `number` | The specific question id within that question file.                            |
| `questionCategory` | `string` | The category in which the question can be found in.                            |
| `userAnswer`       | `string` | The user answer to the question, in which needs to be validated.               |
| `questionType?`    | `string` | The specific type of question asked, if known.                                 |

##### Returns

`Promise`<`boolean`\>

##### Defined in

[controllers/QuizController.ts:25](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/QuizController.ts#L25)

## Module: models/Game

### Type Aliases

#### GameType

Ƭ **GameType**: `Object`

The definition of what a game looks like within the database.

##### Type declaration

| Name                | Type                        |
| :------------------ | :-------------------------- |
| `game_code`         | `string`                    |
| `hostId`            | `mongoose.Types.ObjectId`   |
| `players`           | `mongoose.Types.ObjectId`[] |
| `started`           | `boolean`                   |
| `theme_pack`        | `string`                    |
| `used_consequences` | `number`[]                  |
| `used_questions`    | `number`[]                  |

##### Defined in

[models/Game.ts:12](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/models/Game.ts#L12)

### Variables

#### default

• `Const` **default**: `Model`<[`GameType`](models_Game.md#gametype), {}, {}, {}, `any`\>

##### Defined in

[models/Game.ts:45](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/models/Game.ts#L45)

## Module: models/User

### Type Aliases

#### UserType

Ƭ **UserType**: `Object`

The definition of what a user looks like within the database.

##### Type declaration

| Name       | Type                      |
| :--------- | :------------------------ |
| `color`    | `string`                  |
| `game`     | `mongoose.Types.ObjectId` |
| `position` | `number`                  |
| `token`    | `string`                  |
| `userType` | `string`                  |
| `username` | `string`                  |

##### Defined in

[models/User.ts:12](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/models/User.ts#L12)

### Variables

#### default

• `Const` **default**: `Model`<[`UserType`](models_User.md#usertype), {}, {}, {}, `any`\>

##### Defined in

[models/User.ts:43](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/models/User.ts#L43)

## Module: routes/basic.router

### Functions

#### default

▸ **default**(`instance`, `opts`, `done`): `void`

A universal router meant for handling requests that are non-node specific.

##### Parameters

| Name       | Type                                                                                                                                               | Description                                                      |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `instance` | `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\> | -                                                                |
| `opts`     | `Record`<`never`, `never`\>                                                                                                                        | Configuration options relevant to only this specific sub-router. |
| `done`     | (`err?`: `Error`) => `void`                                                                                                                        | Function that indicates the end of definitions.                  |

##### Returns

`void`

##### Defined in

node_modules/fastify/types/plugin.d.ts:13

## Module: routes/client.router

### Functions

#### default

▸ **default**(`instance`, `opts`, `done`): `void`

The handling function for the client node router.
It receives a request and various parameters, and handles it appropriately.

##### Parameters

| Name       | Type                                                                                                                                               | Description                                                      |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `instance` | `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\> | -                                                                |
| `opts`     | `Record`<`never`, `never`\>                                                                                                                        | Configuration options relevant to only this specific sub-router. |
| `done`     | (`err?`: `Error`) => `void`                                                                                                                        | Function that indicates the end of definitions.                  |

##### Returns

`void`

##### Defined in

node_modules/fastify/types/plugin.d.ts:13

## Module: routes/game.router

### Functions

#### default

▸ **default**(`instance`, `opts`, `done`): `void`

The handling function for the game node router.
It receives a request and various parameters, and handles it appropriately.

##### Parameters

| Name       | Type                                                                                                                                               | Description                                                      |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `instance` | `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\> | -                                                                |
| `opts`     | `Record`<`never`, `never`\>                                                                                                                        | Configuration options relevant to only this specific sub-router. |
| `done`     | (`err?`: `Error`) => `void`                                                                                                                        | Function that indicates the end of definitions.                  |

##### Returns

`void`

##### Defined in

node_modules/fastify/types/plugin.d.ts:13

## Module: routes/ws.router

### Functions

#### default

▸ **default**(`instance`, `opts`, `done`): `void`

The handling function for the websocket router.
It receives a request and various parameters, and handles it appropriately.

##### Parameters

| Name       | Type                                                                                                                                               | Description                                                      |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------- |
| `instance` | `FastifyInstance`<`RawServerDefault`, `IncomingMessage`, `ServerResponse`<`IncomingMessage`\>, `FastifyBaseLogger`, `FastifyTypeProviderDefault`\> | -                                                                |
| `opts`     | `Record`<`never`, `never`\>                                                                                                                        | Configuration options relevant to only this specific sub-router. |
| `done`     | (`err?`: `Error`) => `void`                                                                                                                        | Function that indicates the end of definitions.                  |

##### Returns

`void`

##### Defined in

node_modules/fastify/types/plugin.d.ts:13
