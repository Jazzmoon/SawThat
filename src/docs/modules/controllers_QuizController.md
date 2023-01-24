[backend](../README.md) / [Modules](../modules.md) / controllers/QuizController

# Module: controllers/QuizController

## Table of contents

### Functions

- [formatQuestion](controllers_QuizController.md#formatquestion)
- [validateAnswer](controllers_QuizController.md#validateanswer)

## Functions

### formatQuestion

▸ **formatQuestion**(`themePackName`, `questionType`): `Promise`<{ `media_type`: `any` = questionData.media\_type; `media_url`: `any` = questionData.media\_url; `prompt`: `string`[] = clues; `question`: `string` = prompt }\>

Fetches a random question from the given theme pack, formatted for display.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `themePackName` | `string` | Name of the Theme Pack file in which a question is being generated for. |
| `questionType` | `string` | The name of the category that the question must belong to. |

#### Returns

`Promise`<{ `media_type`: `any` = questionData.media\_type; `media_url`: `any` = questionData.media\_url; `prompt`: `string`[] = clues; `question`: `string` = prompt }\>

Formatted question data, loaded from file.

#### Defined in

[controllers/QuizController.ts:52](https://github.com/Jazzmoon/SawThat/blob/bd5fc3d/src/server/controllers/QuizController.ts#L52)

___

### validateAnswer

▸ **validateAnswer**(`themePackName`, `questionID`, `userAnswer`): `Promise`<`boolean`\>

Returns whether or not a user's answer to a question is correct.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `themePackName` | `string` | Name of the Theme Pack file in which a question needs to be validated against. |
| `questionID` | `number` | The specific question id within that question file. |
| `userAnswer` | `string` | The user answer to the question, in which needs to be validated. |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[controllers/QuizController.ts:20](https://github.com/Jazzmoon/SawThat/blob/bd5fc3d/src/server/controllers/QuizController.ts#L20)
