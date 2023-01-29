[Documentation](../README.md) / [Modules](../modules.md) / [util/MathUtil](../modules/util_MathUtil.md) / default

# Class: default

[util/MathUtil](../modules/util_MathUtil.md).default

Class containing math utility functions.

## Table of contents

### Constructors

- [constructor](util_MathUtil.default.md#constructor)

### Methods

- [bound](util_MathUtil.default.md#bound)
- [choice](util_MathUtil.default.md#choice)
- [randInt](util_MathUtil.default.md#randint)
- [shuffle](util_MathUtil.default.md#shuffle)

## Constructors

### constructor

• **new default**()

## Methods

### bound

▸ `Static` **bound**(`bound_a`, `bound_b`, `value`): `number`

Ensure a number remains within a minimum and maximum bound range.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `bound_a` | `number` | One of two bounds for the value. |
| `bound_b` | `number` | One of two bounds for the value. |
| `value` | `number` | The value in which potentially could fall outside the bounds. |

#### Returns

`number`

A value constrained within the bounds provided.

#### Defined in

[util/MathUtil.ts:24](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/util/MathUtil.ts#L24)

___

### choice

▸ `Static` **choice**<`T`\>(`choices`, `amount?`): `T` \| `T`[]

Return random entity from an array of choices.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `choices` | `T`[] | `undefined` | Options to choose from. |
| `amount` | `number` | `1` | - |

#### Returns

`T` \| `T`[]

The randomly selected option from the array.

#### Defined in

[util/MathUtil.ts:50](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/util/MathUtil.ts#L50)

___

### randInt

▸ `Static` **randInt**(`a`, `b`): `number`

Generate a random integer between 2 integral bounds, inclusive.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `a` | `number` | Lower bound, rounded down if not integral. |
| `b` | `number` | Upper bound, rounded down if not integral. |

#### Returns

`number`

A random integer between a and b, inclusive.

#### Defined in

[util/MathUtil.ts:11](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/util/MathUtil.ts#L11)

___

### shuffle

▸ `Static` **shuffle**<`T`\>(`arr`): `T`[]

Shuffle an array of values.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | `T`[] | The original array. |

#### Returns

`T`[]

The shuffled array.

#### Defined in

[util/MathUtil.ts:35](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/util/MathUtil.ts#L35)
