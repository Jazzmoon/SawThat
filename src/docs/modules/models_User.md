[server](../README.md) / [Modules](../modules.md) / models/User

# Module: models/User

## Table of contents

### Type Aliases

- [UserType](models_User.md#usertype)

### Variables

- [default](models_User.md#default)

## Type Aliases

### UserType

Ƭ **UserType**: `Object`

The definition of what a user looks like within the database.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color` | `string` |
| `game` | `mongoose.Types.ObjectId` |
| `position` | `number` |
| `token` | `string` |
| `userType` | `string` |
| `username` | `string` |

#### Defined in

[models/User.ts:12](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/models/User.ts#L12)

## Variables

### default

• `Const` **default**: `Model`<[`UserType`](models_User.md#usertype), {}, {}, {}, `any`\>

#### Defined in

[models/User.ts:43](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/models/User.ts#L43)
