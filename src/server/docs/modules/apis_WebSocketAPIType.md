[Documentation](../README.md) / [Modules](../modules.md) / apis/WebSocketAPIType

# Module: apis/WebSocketAPIType

## Table of contents

### Type Aliases

- [ConnectionEstablished](apis_WebSocketAPIType.md#connectionestablished)
- [ConsequenceData](apis_WebSocketAPIType.md#consequencedata)
- [ErrorData](apis_WebSocketAPIType.md#errordata)
- [GameEndAckData](apis_WebSocketAPIType.md#gameendackdata)
- [GameJoinAckData](apis_WebSocketAPIType.md#gamejoinackdata)
- [NextPlayerData](apis_WebSocketAPIType.md#nextplayerdata)
- [QuestionAnswerData](apis_WebSocketAPIType.md#questionanswerdata)
- [QuestionData](apis_WebSocketAPIType.md#questiondata)
- [QuestionEndedData](apis_WebSocketAPIType.md#questionendeddata)
- [TimedData](apis_WebSocketAPIType.md#timeddata)

## Type Aliases

### ConnectionEstablished

Ƭ **ConnectionEstablished**: `Object`

This data structure is to act as a confirmation that the user has connected to the websocket with the correct information.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `JWT` | `string` |
| `gameCode` | `string` |
| `message` | `string` |
| `userType` | `string` |
| `username` | `string` |

#### Defined in

[apis/WebSocketAPIType.ts:73](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L73)

___

### ConsequenceData

Ƭ **ConsequenceData**: { `consequence_type`: [`ConsequenceType`](../enums/enums_ConsequenceType.ConsequenceType.md) ; `id`: `number` ; `movement_die`: `number` ; `story`: `string`  } & [`TimedData`](apis_WebSocketAPIType.md#timeddata)

Detailing the consequence data that the server sends to the game and client nodes.

#### Defined in

[apis/WebSocketAPIType.ts:38](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L38)

___

### ErrorData

Ƭ **ErrorData**: `Object`

If an error occurs, send back data of this format to ensure it can be handled.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | `string` \| `Error` |
| `fatal` | `boolean` |
| `message?` | `string` |
| `token` | `string` |

#### Defined in

[apis/WebSocketAPIType.ts:98](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L98)

___

### GameEndAckData

Ƭ **GameEndAckData**: `Object`

When a game has ended, the final rankings of the players is sent.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ranking` | [`Player`](types_Player.md#player)[] |

#### Defined in

[apis/WebSocketAPIType.ts:49](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L49)

___

### GameJoinAckData

Ƭ **GameJoinAckData**: `Object`

When a player connects to the websocket, send a player list to everyone to notify them.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `players` | [`Player`](types_Player.md#player)[] |

#### Defined in

[apis/WebSocketAPIType.ts:84](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L84)

___

### NextPlayerData

Ƭ **NextPlayerData**: `Object`

When the game progresses to the next turn, the game node must know whose turn it is next.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `player` | [`Player`](types_Player.md#player) |

#### Defined in

[apis/WebSocketAPIType.ts:91](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L91)

___

### QuestionAnswerData

Ƭ **QuestionAnswerData**: `Object`

When a client sends their answer to the server via a request, this is how that answer is formatted.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `answer` | `string` |
| `category` | `string` |
| `id` | `number` |
| `question_type?` | `string` |

#### Defined in

[apis/WebSocketAPIType.ts:63](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L63)

___

### QuestionData

Ƭ **QuestionData**: { `all_play?`: `boolean` ; `category`: `string` ; `challenge_die`: [`QuestionCategory`](../enums/enums_QuestionCategory.QuestionCategory.md) ; `id`: `number` ; `media_type?`: ``"image"`` \| ``"video"`` \| ``null`` ; `media_url?`: `string` \| ``null`` ; `movement_die`: `number` ; `options`: `string`[] ; `question`: `string` ; `question_type`: ``"Multiple Choice"``  } & [`TimedData`](apis_WebSocketAPIType.md#timeddata)

Detailing the question data that the server sends to the game and client nodes.

#### Defined in

[apis/WebSocketAPIType.ts:22](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L22)

___

### QuestionEndedData

Ƭ **QuestionEndedData**: `Object`

Upon each question ending, send an array detailing where each player is located.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `players` | [`Player`](types_Player.md#player)[] |

#### Defined in

[apis/WebSocketAPIType.ts:56](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L56)

___

### TimedData

Ƭ **TimedData**: `Object`

Any response from the server that involves the server starting a timer will include the following information.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `timer_length` | `number` |
| `timer_start?` | `Date` \| `number` |

#### Defined in

[apis/WebSocketAPIType.ts:14](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/apis/WebSocketAPIType.ts#L14)
