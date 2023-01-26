[server](../README.md) / [Modules](../modules.md) / models/Game

# Module: models/Game

## Table of contents

### Type Aliases

- [GameType](models_Game.md#gametype)

### Variables

- [default](models_Game.md#default)

## Type Aliases

### GameType

Ƭ **GameType**: `Object`

The definition of what a game looks like within the database.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `game_code` | `string` |
| `hostId` | `mongoose.Types.ObjectId` |
| `players` | `mongoose.Types.ObjectId`[] |
| `started` | `boolean` |
| `theme_pack` | `string` |
| `used_consequences` | `number`[] |
| `used_questions` | `number`[] |

#### Defined in

[models/Game.ts:12](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/models/Game.ts#L12)

## Variables

### default

• `Const` **default**: `Model`<[`GameType`](models_Game.md#gametype), {}, {}, {}, `any`\>

#### Defined in

[models/Game.ts:45](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/models/Game.ts#L45)
