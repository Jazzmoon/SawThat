[Documentation](../README.md) / [Modules](../modules.md) / types/Question

# Module: types/Question

## Table of contents

### Type Aliases

- [Question](types_Question.md#question)

## Type Aliases

### Question

Ƭ **Question**: `Object`

The format of a question as data in the system.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `answer` | `string` |
| `clue_list` | `string`[] |
| `fake_answers` | [] |
| `id` | `number` |
| `media_type` | ``"image"`` \| ``"video"`` \| ``null`` |
| `media_url` | `string` \| ``null`` |
| `question` | `string` |
| `question_type` | ``"Multiple Choice"`` \| ``"Text Question"`` |

#### Defined in

[types/Question.ts:10](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/types/Question.ts#L10)
