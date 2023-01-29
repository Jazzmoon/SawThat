[Documentation](../README.md) / [Modules](../modules.md) / types/Websocket

# Module: types/Websocket

## Table of contents

### Type Aliases

- [WebsocketMessage](types_Websocket.md#websocketmessage)
- [WebsocketRequest](types_Websocket.md#websocketrequest)
- [WebsocketResponse](types_Websocket.md#websocketresponse)

## Type Aliases

### WebsocketMessage

Ƭ **WebsocketMessage**: `Object`

The generic interface of all messages sent across the websocket.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | `any` |
| `requestId?` | `string` |
| `type` | [`WebsocketType`](../enums/enums_WebsocketTypes.WebsocketType.md) |

#### Defined in

[types/Websocket.ts:12](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/types/Websocket.ts#L12)

___

### WebsocketRequest

Ƭ **WebsocketRequest**: [`WebsocketMessage`](types_Websocket.md#websocketmessage) & { `token`: `string` ; `type`: [`GameSetup`](../enums/enums_WebsocketTypes.WebsocketType.md#gamesetup) \| [`GameJoin`](../enums/enums_WebsocketTypes.WebsocketType.md#gamejoin) \| [`GameStart`](../enums/enums_WebsocketTypes.WebsocketType.md#gamestart) \| [`GameEnded`](../enums/enums_WebsocketTypes.WebsocketType.md#gameended) \| [`QuestionRequest`](../enums/enums_WebsocketTypes.WebsocketType.md#questionrequest) \| [`QuestionTimerTick`](../enums/enums_WebsocketTypes.WebsocketType.md#questiontimertick) \| [`QuestionEnded`](../enums/enums_WebsocketTypes.WebsocketType.md#questionended) \| [`QuestionAnswer`](../enums/enums_WebsocketTypes.WebsocketType.md#questionanswer) \| [`Consequence`](../enums/enums_WebsocketTypes.WebsocketType.md#consequence) \| [`ConsequenceEnded`](../enums/enums_WebsocketTypes.WebsocketType.md#consequenceended) \| [`NextPlayer`](../enums/enums_WebsocketTypes.WebsocketType.md#nextplayer) \| [`Ping`](../enums/enums_WebsocketTypes.WebsocketType.md#ping)  }

Extending WebsocketMessage, a websocket request limits the legal types and adds a token parameter.

#### Defined in

[types/Websocket.ts:21](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/types/Websocket.ts#L21)

___

### WebsocketResponse

Ƭ **WebsocketResponse**: [`WebsocketMessage`](types_Websocket.md#websocketmessage) & { `type`: [`Error`](../enums/enums_WebsocketTypes.WebsocketType.md#error) \| [`GameSetupAck`](../enums/enums_WebsocketTypes.WebsocketType.md#gamesetupack) \| [`GameJoinAck`](../enums/enums_WebsocketTypes.WebsocketType.md#gamejoinack) \| [`GameStartAck`](../enums/enums_WebsocketTypes.WebsocketType.md#gamestartack) \| [`GameEndedAck`](../enums/enums_WebsocketTypes.WebsocketType.md#gameendedack) \| [`QuestionAck`](../enums/enums_WebsocketTypes.WebsocketType.md#questionack) \| [`QuestionTimerTickAck`](../enums/enums_WebsocketTypes.WebsocketType.md#questiontimertickack) \| [`QuestionEndedAck`](../enums/enums_WebsocketTypes.WebsocketType.md#questionendedack) \| [`ConsequenceAck`](../enums/enums_WebsocketTypes.WebsocketType.md#consequenceack) \| [`ConsequenceEndedAck`](../enums/enums_WebsocketTypes.WebsocketType.md#consequenceendedack) \| [`PlayerDisconnectAck`](../enums/enums_WebsocketTypes.WebsocketType.md#playerdisconnectack) \| [`NextPlayerAck`](../enums/enums_WebsocketTypes.WebsocketType.md#nextplayerack) \| [`Pong`](../enums/enums_WebsocketTypes.WebsocketType.md#pong)  }

Extending WebsocketMessage, a websocket response limits the legal types.

#### Defined in

[types/Websocket.ts:41](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/types/Websocket.ts#L41)
