[server](../README.md) / [Modules](../modules.md) / controllers/QuizController

# Module: controllers/QuizController

## Table of contents

### Functions

- [formatConsequence](controllers_QuizController.md#formatconsequence)
- [formatQuestion](controllers_QuizController.md#formatquestion)
- [validateAnswer](controllers_QuizController.md#validateanswer)

## Functions

### formatConsequence

▸ **formatConsequence**(`theme_pack_name`, `used_consequences`): `Promise`<`Consequence`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `theme_pack_name` | `string` |
| `used_consequences` | `number`[] |

#### Returns

`Promise`<`Consequence`\>

#### Defined in

[controllers/QuizController.ts:169](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/QuizController.ts#L169)

___

### formatQuestion

▸ **formatQuestion**(`theme_pack_name`, `category`, `question_type`, `used_questions`): `Promise`<{ `id`: `number` ; `media_type`: ``null`` \| ``"image"`` \| ``"video"`` ; `media_url`: ``null`` \| `string` ; `options`: `string`[] ; `question`: `string`  }\>

Fetches a random question from the given theme pack, formatted for display.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `theme_pack_name` | `string` | Name of the Theme Pack file in which a question is being generated for. |
| `category` | `string` | The name of the category that the question must belong to. |
| `question_type` | ``"Multiple Choice"`` \| ``"Text Question"`` | Denotes whether the question is multiple choice or text. |
| `used_questions` | `number`[] | A list of question ids in which have already been used by the game. |

#### Returns

`Promise`<{ `id`: `number` ; `media_type`: ``null`` \| ``"image"`` \| ``"video"`` ; `media_url`: ``null`` \| `string` ; `options`: `string`[] ; `question`: `string`  }\>

Formatted question data, loaded from file.

#### Defined in

[controllers/QuizController.ts:70](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/QuizController.ts#L70)

___

### validateAnswer

▸ **validateAnswer**(`themePackName`, `questionID`, `questionCategory`, `userAnswer`, `questionType?`): `Promise`<`boolean`\>

Returns whether or not a user's answer to a question is correct.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `themePackName` | `string` | Name of the Theme Pack file in which a question needs to be validated against. |
| `questionID` | `number` | The specific question id within that question file. |
| `questionCategory` | `string` | The category in which the question can be found in. |
| `userAnswer` | `string` | The user answer to the question, in which needs to be validated. |
| `questionType?` | `string` | The specific type of question asked, if known. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[controllers/QuizController.ts:25](https://github.com/Jazzmoon/SawThat/blob/c2c2bae/src/server/controllers/QuizController.ts#L25)
