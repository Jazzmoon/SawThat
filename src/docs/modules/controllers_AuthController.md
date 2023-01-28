[server](../README.md) / [Modules](../modules.md) / controllers/AuthController

# Module: controllers/AuthController

## Table of contents

### Functions

- [generateJWT](controllers_AuthController.md#generatejwt)

## Functions

### generateJWT

▸ **generateJWT**(`requestData`): `Promise`<`string`\>

Generate the user access token that identifies each connected user, and create their user within the database.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `requestData` | `Object` | The username, game code, and type of user in which is generating their authentication token. |
| `requestData.color?` | `Color` | If the user is a client node user, they will provide the color for their player piece. |
| `requestData.gameCode` | `string` | The game code for the game that the user is going to be related to. |
| `requestData.userType` | ``"Game"`` \| ``"Client"`` | Whether the user being created is a game or client node user. |
| `requestData.username` | `string` | The username of the user sending te request to generate a JWT token. |

#### Returns

`Promise`<`string`\>

Resolution code with JWT embedded.

#### Defined in

[controllers/AuthController.ts:23](https://github.com/Jazzmoon/SawThat/blob/d5e47b5/src/server/controllers/AuthController.ts#L23)
