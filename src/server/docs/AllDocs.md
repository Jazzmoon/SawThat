[Documentation](README.md) / Modules

# Documentation

## Table of contents

### Modules

- [apis/WebSocketAPIType](modules/apis_WebSocketAPIType.md)
- [enums/Color](modules/enums_Color.md)
- [enums/ConsequenceType](modules/enums_ConsequenceType.md)
- [enums/QuestionCategory](modules/enums_QuestionCategory.md)
- [enums/TurnModifier](modules/enums_TurnModifier.md)
- [enums/WebsocketTypes](modules/enums_WebsocketTypes.md)
- [types/Consequence](modules/types_Consequence.md)
- [types/Player](modules/types_Player.md)
- [types/Question](modules/types_Question.md)
- [types/Websocket](modules/types_Websocket.md)
- [util/MathUtil](modules/util_MathUtil.md)
Documentation / [Modules](modules.md)

# Saw That?

As a kid, Mark and his sister were obsessed with Screenlife's DVD Trivia game called [**Scene It?**][SceneIt]. Sadly, those games are no longer being produced anymore, as the medium of DVD game isn't very popular anymore. However, especially due to the recent pandemic, remote games, such as those featured in [Jackbox Party Packs][JPP], that you can play with friends have become more and more valued.

**Saw That?** is intended to bring the DVD trivia game genre that **Scene It?** revolutionized into a more modernized medium, in the hopes that it will become a popular game if the rights can be obtained to the different themes you want to make.

If you wanted to play a [**Disney**][Disney] themed **Saw That?** game, all you would need to do is download the source code, make an asset pack, and make the questions for it.

Because we don't own the rights to any media snippets, we can't release a version of the game that is already populated with Trivia questions. The most we can do is make the infrastructure in the hopes that you guys will make fun content packs and maybe find a way of sharing those.

## Plans

### The Game

**Scene It?** consists of a series of player pieces, a board (start, 34/46 spaces, and a stop), a deck of trivia cards, consequence cards, and the game disc with mini-games that have been sorted into 2 categories (all-play and my-play). For the sake of this project, all components would need to be digitalized and controlled by the master node. Below is a detailed description of what each component does within **SceneIt?**

#### Game Play

The basic premise of the game is that 2-8 players are attempting to race around the board, answering trivia questions to ensure they move forward. 2 dice are rolled at the beginning of each turn:

- The movement die, a D6, and
- The challenge die, a D8

The value of the movement die determines how many spaces you move forward IF you manage to complete the challenge chosen by the value of the challenge die. If you fail the challenge, you do not move forward, and your turn is forfeit.

#### The Game Board

The game board comes with 2 primary play options:

- Short Game, which consists of 34 spaces, with a "x2" space at the halfway point,
- And Long Game, which consists of 46 spaces, with a "x2" space at the quarter, halfway, and three-quarter points.

The times two space doubles the die value in which determines movement score.

#### Trivia Cards

Trivia cards are divided into 3 categories:

- Take Three, which consists of 3 clues being given that hint to the final answer,
- Songs, Slogans, and Taglines, which consists of a single clue that hints to the final answer which is related to a song, slogan, or tagline of a film,
- and Miscellaneous, which consists of a single clue that hints to the final answer which is related to a topic unrelated to the previous categories.

#### Consequence Cards

Consequence cards are a fun way to add a bit of spice to the game. They are always a "successful" role, meaning you are guaranteed to move forward the value of your movement die. However, you must also face the consequences of the card. Consequences are not always negative however... Some cards move you forward another few spaces, or even give you a free turn. However, the opposite can also occur, such as moving you back a few spaces, or even losing a turn. Exacts can be discussed by group members, as you are free to assign whatever consequences you want to the cards.

#### Mini-Games

A full list of the individual mini-games, with video clips, can be found [at the following Google Drive][MG]. The list below is merely a text based list and explanation of each mini-game.

##### All-Play

- **Anagrams/Riddle Letters**
  - Time: 15 Seconds
  - Description: Presented with a prompt of what you are trying to guess, you have 15 seconds to unscramble the letters to guess the answer. Every 5 seconds, you are presented with a new anagram, which may or may not make it clearer to you.
- **Close-Ups/Feature Attraction**
  - Time: 10 Seconds
  - Description: Presented with an extremely zoomed in image, simply give the answer requested by the proceeding prompt (i.e. Character, movie, place, etc...)
- **Colin's Camera**
  - Time: 15 Seconds
  - Description: An image has been turned into a negative, and a black SVG is placed over it. The svg slowly moves out of the way, revealing the image. Be the first to guess the prompt under the image.
- **Cutouts**
  - Time: 10 Seconds
  - Description: Something has been cut out of the image provided, leaving a hole in its place. Be the first to identify what has been cut out.
- **Did you Hear That/Soundclips**
  - Time: Soundclip + 2-5 Seconds
  - Description: Presented with an audio clip, identify the relevant information asked for by the prompt.
- **Distorted Reality/Divination**
  - Time: 15 Seconds
  - Description: Various filters have been applied to an image and are slowly being removed. Be the first to guess the image's contents.
- **Furious Firsts**
  - Time: 15 Seconds
  - Description: Presented with a prompt, be the first to guess the first thing that comes to mind. Some suggestions need to be presented to determine a clear winner.
- **Grosser than Gross/Definitions**
  - Time: 15 Seconds
  - Description: Presented with a word with a difficult to guess definition, be the first to guess the definition. You are provided with images that describe the word's definition.
- **Misfits**
  - Time: 15-30 seconds
  - Description: Presented with a prompt and a series of options, be the first to identify the odd one out.
- **Polyjuice Potion**
  - Time: 15 Seconds
  - Description: Presented with a prompt, be the first to guess the answer that is related to the prompt. You are provided with a series of images that, when combined, will reveal the answer.
- **Silhouettes/Slime Bucket**
  - Time: 10-15 Seconds
  - Description: Presented with a silhouette, be the first to guess the prompt given prior to the question. In regards to slime bucket, the silhouette is simply revealed in pieces and thus has more time.
- **Sorting Hat/Find the Object**
  - Time: 15 Seconds
  - Description: An item is placed under a hat and jumbled around. Be the first to select the number associated with the item. Works well as a my-play as well, but is a chaotic all-play.
- **Spellbinder**
  - Time: 10-15 Seconds
  - Description: Presented with a prompt, be the first to guess the answer that is related to the prompt. You are provided with a series blank spaces that are filled by various letters of the answer. Letters are assigned a rank value that determine when they appear in the time limit, revealing the entire final answer as the clock hits 0.
- **What's Missing?**
  - Time: 15 Seconds
  - Description: Abusing some Photoshop magic, an item is removed from a scene. Guess what it is before the time runs out.
- **Where in the World/Visual Puzzlers**
  - Time: 20 Seconds
  - Description: You are given 4 images, each making it more obvious what the answer is. Simply be the first to give the answer before the time runs out.
- **Who am I?**
  - Time: 15 Seconds
  - Description: You are given a series of clues that hint to the identity of a character. Be the first to guess the character before the time runs out.

##### My-Play

- **Charms and Spells/Multiple Choice**
  - Time: Scene + 10 seconds
  - Description: Presented with a scene from a piece of media, you have 10 seconds to guess the answer from the provided multiple choice. The scene is played in full, but usually with a pause somewhere or with no audio, and you are given 10 seconds to guess the answer from the provided multiple choice.
- **Cover to Cover/Memory Lane**
  - Time: 10-15 Seconds
  - Description: This is a memory challenge. Rapidly flash a selection of 8-12 items across the screen, then ask a question about what the player saw at the end.
- **Traditional**
  - Time: Scene + 10 seconds
  - Description: Presented with a scene from a piece of media, you have 10 seconds to guess the answer to a question that follows, usually related to the scene that just played.

### Development and Design

#### Frontend Serving

After getting aquatinted with [**ReactJS**][ReactJS] over the summer, we plan on using a version of that to host the front-end. Either using [ReactJS][ReactJS] itself, or a minified version of it called [**NextJS**][NextJS]. Communication to the backend API would likely then be done using [Axios][Axios], and a websocket would be established allowing the game to be played synchronously with other players across various devices.

If **ReactJS** is not used, the back-up framework of choice would be [**VueJS**][VueJS], which is a similar framework to **ReactJS** but with a different syntax.

#### Backend API

Due to choice of Typescript supported front-end frameworks, it only makes sense to maintain the TypeScript language base across the entire project. Therefore, the plan is to use NodeJS's [ExpressJS][ExpressJS] framework to create the API. The API would be responsible for handling the game logic, and communicating with the database to store and retrieve data.

#### Database

The database design will require a lot of planning from the development group, but we know that each game will be assigned a unique join code and store a timeout value in the event of the game becoming fully idle. Players would not be required to make accounts, and thus won't need to be stored in the database. However, the game will need to store the player's name, and the player's score. The game will also need to store the questions and answers for each game, and the game's theme.

We will also need to record the Game's state in memory, so that way everyone in the game is seeing the correct game board.

[Axios]: <https://www.npmjs.com/package/axios> "Axios NPM Package"

[Disney]: <https://www.disney.com/> "Disney - Official Website"

[ExpressJS]: <https://expressjs.com/> "ExpressJS - Official Website"

[JPP]: <https://www.jackboxgames.com/> "Jackbox Party Games - Official Website"

[MG]: <https://drive.google.com/drive/folders/18l2RTZJJPfHBrCZAbdQvA0HxGPU8TmUn> "Mini-Game Drive"

[NextJS]: <https://nextjs.org/> "NextJS - Official Website"

[ReactJS]: <https://reactjs.org/> "ReactJS - Official Website"

[SceneIt]: <https://www.wikiwand.com/en/Scene_It%3F/> "Scene It? - Wikipedia"

[VueJS]: <https://vuejs.org/> "VueJS - Official Website"
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
[Documentation](../README.md) / [Modules](../modules.md) / [enums/Color](../modules/enums_Color.md) / Color

# Enumeration: Color

[enums/Color](../modules/enums_Color.md).Color

An enum detailing the exact color codes that the server is allowed to choose from.

## Table of contents

### Enumeration Members

- [BLUE](enums_Color.Color.md#blue)
- [BROWN](enums_Color.Color.md#brown)
- [GREEN](enums_Color.Color.md#green)
- [ORANGE](enums_Color.Color.md#orange)
- [PINK](enums_Color.Color.md#pink)
- [PURPLE](enums_Color.Color.md#purple)
- [RED](enums_Color.Color.md#red)
- [YELLOW](enums_Color.Color.md#yellow)

## Enumeration Members

### BLUE

• **BLUE** = ``"#0000FF"``

#### Defined in

[enums/Color.ts:15](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L15)

___

### BROWN

• **BROWN** = ``"#A52A2A"``

#### Defined in

[enums/Color.ts:18](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L18)

___

### GREEN

• **GREEN** = ``"#008000"``

#### Defined in

[enums/Color.ts:14](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L14)

___

### ORANGE

• **ORANGE** = ``"#FFA500"``

#### Defined in

[enums/Color.ts:12](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L12)

___

### PINK

• **PINK** = ``"#FFC0CB"``

#### Defined in

[enums/Color.ts:17](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L17)

___

### PURPLE

• **PURPLE** = ``"#800080"``

#### Defined in

[enums/Color.ts:16](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L16)

___

### RED

• **RED** = ``"#FF0000"``

#### Defined in

[enums/Color.ts:11](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L11)

___

### YELLOW

• **YELLOW** = ``"#FFFF00"``

#### Defined in

[enums/Color.ts:13](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/Color.ts#L13)
[Documentation](../README.md) / [Modules](../modules.md) / [enums/ConsequenceType](../modules/enums_ConsequenceType.md) / ConsequenceType

# Enumeration: ConsequenceType

[enums/ConsequenceType](../modules/enums_ConsequenceType.md).ConsequenceType

An enum detailing the exact options for consequence card types.

## Table of contents

### Enumeration Members

- [LoseATurn](enums_ConsequenceType.ConsequenceType.md#loseaturn)
- [MoveBackward](enums_ConsequenceType.ConsequenceType.md#movebackward)
- [MoveForward](enums_ConsequenceType.ConsequenceType.md#moveforward)
- [SkipATurn](enums_ConsequenceType.ConsequenceType.md#skipaturn)

## Enumeration Members

### LoseATurn

• **LoseATurn** = ``2``

#### Defined in

[enums/ConsequenceType.ts:13](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/ConsequenceType.ts#L13)

___

### MoveBackward

• **MoveBackward** = ``1``

#### Defined in

[enums/ConsequenceType.ts:12](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/ConsequenceType.ts#L12)

___

### MoveForward

• **MoveForward** = ``0``

#### Defined in

[enums/ConsequenceType.ts:11](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/ConsequenceType.ts#L11)

___

### SkipATurn

• **SkipATurn** = ``3``

#### Defined in

[enums/ConsequenceType.ts:14](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/ConsequenceType.ts#L14)
[Documentation](../README.md) / [Modules](../modules.md) / [enums/QuestionCategory](../modules/enums_QuestionCategory.md) / QuestionCategory

# Enumeration: QuestionCategory

[enums/QuestionCategory](../modules/enums_QuestionCategory.md).QuestionCategory

An enum detailing the exact question categories for the challenge die.

## Table of contents

### Enumeration Members

- [Consequence](enums_QuestionCategory.QuestionCategory.md#consequence)
- [ConsequenceB](enums_QuestionCategory.QuestionCategory.md#consequenceb)
- [MiscellaneousAllPlay](enums_QuestionCategory.QuestionCategory.md#miscellaneousallplay)
- [MiscellaneousMyPlay](enums_QuestionCategory.QuestionCategory.md#miscellaneousmyplay)
- [MusicalAllPlay](enums_QuestionCategory.QuestionCategory.md#musicalallplay)
- [MusicalMyPlay](enums_QuestionCategory.QuestionCategory.md#musicalmyplay)
- [TakeThreeAllPlay](enums_QuestionCategory.QuestionCategory.md#takethreeallplay)
- [TakeThreeMyPlay](enums_QuestionCategory.QuestionCategory.md#takethreemyplay)

## Enumeration Members

### Consequence

• **Consequence** = ``3``

#### Defined in

[enums/QuestionCategory.ts:14](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L14)

___

### ConsequenceB

• **ConsequenceB** = ``7``

#### Defined in

[enums/QuestionCategory.ts:18](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L18)

___

### MiscellaneousAllPlay

• **MiscellaneousAllPlay** = ``2``

#### Defined in

[enums/QuestionCategory.ts:13](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L13)

___

### MiscellaneousMyPlay

• **MiscellaneousMyPlay** = ``6``

#### Defined in

[enums/QuestionCategory.ts:17](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L17)

___

### MusicalAllPlay

• **MusicalAllPlay** = ``1``

#### Defined in

[enums/QuestionCategory.ts:12](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L12)

___

### MusicalMyPlay

• **MusicalMyPlay** = ``5``

#### Defined in

[enums/QuestionCategory.ts:16](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L16)

___

### TakeThreeAllPlay

• **TakeThreeAllPlay** = ``0``

#### Defined in

[enums/QuestionCategory.ts:11](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L11)

___

### TakeThreeMyPlay

• **TakeThreeMyPlay** = ``4``

#### Defined in

[enums/QuestionCategory.ts:15](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/QuestionCategory.ts#L15)
[Documentation](../README.md) / [Modules](../modules.md) / [enums/TurnModifier](../modules/enums_TurnModifier.md) / TurnModifier

# Enumeration: TurnModifier

[enums/TurnModifier](../modules/enums_TurnModifier.md).TurnModifier

An enum detailing the exact options for position modifiers.

## Table of contents

### Enumeration Members

- [AllPlayToWin](enums_TurnModifier.TurnModifier.md#allplaytowin)
- [DoubleFeature](enums_TurnModifier.TurnModifier.md#doublefeature)
- [FinalCut1](enums_TurnModifier.TurnModifier.md#finalcut1)
- [FinalCut2](enums_TurnModifier.TurnModifier.md#finalcut2)
- [FinalCut3](enums_TurnModifier.TurnModifier.md#finalcut3)
- [Normal](enums_TurnModifier.TurnModifier.md#normal)
- [Winner](enums_TurnModifier.TurnModifier.md#winner)

## Enumeration Members

### AllPlayToWin

• **AllPlayToWin** = ``2``

#### Defined in

[enums/TurnModifier.ts:13](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L13)

___

### DoubleFeature

• **DoubleFeature** = ``1``

#### Defined in

[enums/TurnModifier.ts:12](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L12)

___

### FinalCut1

• **FinalCut1** = ``5``

#### Defined in

[enums/TurnModifier.ts:16](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L16)

___

### FinalCut2

• **FinalCut2** = ``4``

#### Defined in

[enums/TurnModifier.ts:15](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L15)

___

### FinalCut3

• **FinalCut3** = ``3``

#### Defined in

[enums/TurnModifier.ts:14](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L14)

___

### Normal

• **Normal** = ``0``

#### Defined in

[enums/TurnModifier.ts:11](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L11)

___

### Winner

• **Winner** = ``6``

#### Defined in

[enums/TurnModifier.ts:17](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/TurnModifier.ts#L17)
[Documentation](../README.md) / [Modules](../modules.md) / [enums/WebsocketTypes](../modules/enums_WebsocketTypes.md) / WebsocketType

# Enumeration: WebsocketType

[enums/WebsocketTypes](../modules/enums_WebsocketTypes.md).WebsocketType

An enum detailing the exact options for websocket message types.

## Table of contents

### Enumeration Members

- [Consequence](enums_WebsocketTypes.WebsocketType.md#consequence)
- [ConsequenceAck](enums_WebsocketTypes.WebsocketType.md#consequenceack)
- [ConsequenceEnded](enums_WebsocketTypes.WebsocketType.md#consequenceended)
- [ConsequenceEndedAck](enums_WebsocketTypes.WebsocketType.md#consequenceendedack)
- [Error](enums_WebsocketTypes.WebsocketType.md#error)
- [GameEnded](enums_WebsocketTypes.WebsocketType.md#gameended)
- [GameEndedAck](enums_WebsocketTypes.WebsocketType.md#gameendedack)
- [GameJoin](enums_WebsocketTypes.WebsocketType.md#gamejoin)
- [GameJoinAck](enums_WebsocketTypes.WebsocketType.md#gamejoinack)
- [GameSetup](enums_WebsocketTypes.WebsocketType.md#gamesetup)
- [GameSetupAck](enums_WebsocketTypes.WebsocketType.md#gamesetupack)
- [GameStart](enums_WebsocketTypes.WebsocketType.md#gamestart)
- [GameStartAck](enums_WebsocketTypes.WebsocketType.md#gamestartack)
- [NextPlayer](enums_WebsocketTypes.WebsocketType.md#nextplayer)
- [NextPlayerAck](enums_WebsocketTypes.WebsocketType.md#nextplayerack)
- [Ping](enums_WebsocketTypes.WebsocketType.md#ping)
- [PlayerDisconnectAck](enums_WebsocketTypes.WebsocketType.md#playerdisconnectack)
- [Pong](enums_WebsocketTypes.WebsocketType.md#pong)
- [QuestionAck](enums_WebsocketTypes.WebsocketType.md#questionack)
- [QuestionAnswer](enums_WebsocketTypes.WebsocketType.md#questionanswer)
- [QuestionEnded](enums_WebsocketTypes.WebsocketType.md#questionended)
- [QuestionEndedAck](enums_WebsocketTypes.WebsocketType.md#questionendedack)
- [QuestionRequest](enums_WebsocketTypes.WebsocketType.md#questionrequest)
- [QuestionTimeOut](enums_WebsocketTypes.WebsocketType.md#questiontimeout)
- [QuestionTimerTick](enums_WebsocketTypes.WebsocketType.md#questiontimertick)
- [QuestionTimerTickAck](enums_WebsocketTypes.WebsocketType.md#questiontimertickack)

## Enumeration Members

### Consequence

• **Consequence** = ``15``

#### Defined in

[enums/WebsocketTypes.ts:19](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L19)

___

### ConsequenceAck

• **ConsequenceAck** = ``16``

#### Defined in

[enums/WebsocketTypes.ts:34](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L34)

___

### ConsequenceEnded

• **ConsequenceEnded** = ``17``

#### Defined in

[enums/WebsocketTypes.ts:20](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L20)

___

### ConsequenceEndedAck

• **ConsequenceEndedAck** = ``18``

#### Defined in

[enums/WebsocketTypes.ts:35](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L35)

___

### Error

• **Error** = ``0``

#### Defined in

[enums/WebsocketTypes.ts:26](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L26)

___

### GameEnded

• **GameEnded** = ``5``

#### Defined in

[enums/WebsocketTypes.ts:14](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L14)

___

### GameEndedAck

• **GameEndedAck** = ``6``

#### Defined in

[enums/WebsocketTypes.ts:30](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L30)

___

### GameJoin

• **GameJoin** = ``3``

#### Defined in

[enums/WebsocketTypes.ts:13](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L13)

___

### GameJoinAck

• **GameJoinAck** = ``4``

#### Defined in

[enums/WebsocketTypes.ts:28](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L28)

___

### GameSetup

• **GameSetup** = ``1``

#### Defined in

[enums/WebsocketTypes.ts:12](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L12)

___

### GameSetupAck

• **GameSetupAck** = ``2``

#### Defined in

[enums/WebsocketTypes.ts:27](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L27)

___

### GameStart

• **GameStart** = ``23``

#### Defined in

[enums/WebsocketTypes.ts:22](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L22)

___

### GameStartAck

• **GameStartAck** = ``24``

#### Defined in

[enums/WebsocketTypes.ts:29](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L29)

___

### NextPlayer

• **NextPlayer** = ``22``

#### Defined in

[enums/WebsocketTypes.ts:23](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L23)

___

### NextPlayerAck

• **NextPlayerAck** = ``7``

#### Defined in

[enums/WebsocketTypes.ts:38](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L38)

___

### Ping

• **Ping** = ``20``

#### Defined in

[enums/WebsocketTypes.ts:21](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L21)

___

### PlayerDisconnectAck

• **PlayerDisconnectAck** = ``22``

#### Defined in

[enums/WebsocketTypes.ts:37](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L37)

___

### Pong

• **Pong** = ``21``

#### Defined in

[enums/WebsocketTypes.ts:39](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L39)

___

### QuestionAck

• **QuestionAck** = ``9``

#### Defined in

[enums/WebsocketTypes.ts:31](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L31)

___

### QuestionAnswer

• **QuestionAnswer** = ``14``

#### Defined in

[enums/WebsocketTypes.ts:18](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L18)

___

### QuestionEnded

• **QuestionEnded** = ``12``

#### Defined in

[enums/WebsocketTypes.ts:17](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L17)

___

### QuestionEndedAck

• **QuestionEndedAck** = ``13``

#### Defined in

[enums/WebsocketTypes.ts:33](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L33)

___

### QuestionRequest

• **QuestionRequest** = ``8``

#### Defined in

[enums/WebsocketTypes.ts:15](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L15)

___

### QuestionTimeOut

• **QuestionTimeOut** = ``19``

#### Defined in

[enums/WebsocketTypes.ts:36](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L36)

___

### QuestionTimerTick

• **QuestionTimerTick** = ``10``

#### Defined in

[enums/WebsocketTypes.ts:16](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L16)

___

### QuestionTimerTickAck

• **QuestionTimerTickAck** = ``11``

#### Defined in

[enums/WebsocketTypes.ts:32](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/enums/WebsocketTypes.ts#L32)
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
[Documentation](../README.md) / [Modules](../modules.md) / enums/Color

# Module: enums/Color

## Table of contents

### Enumerations

- [Color](../enums/enums_Color.Color.md)
[Documentation](../README.md) / [Modules](../modules.md) / enums/ConsequenceType

# Module: enums/ConsequenceType

## Table of contents

### Enumerations

- [ConsequenceType](../enums/enums_ConsequenceType.ConsequenceType.md)
[Documentation](../README.md) / [Modules](../modules.md) / enums/QuestionCategory

# Module: enums/QuestionCategory

## Table of contents

### Enumerations

- [QuestionCategory](../enums/enums_QuestionCategory.QuestionCategory.md)
[Documentation](../README.md) / [Modules](../modules.md) / enums/TurnModifier

# Module: enums/TurnModifier

## Table of contents

### Enumerations

- [TurnModifier](../enums/enums_TurnModifier.TurnModifier.md)
[Documentation](../README.md) / [Modules](../modules.md) / enums/WebsocketTypes

# Module: enums/WebsocketTypes

## Table of contents

### Enumerations

- [WebsocketType](../enums/enums_WebsocketTypes.WebsocketType.md)
[Documentation](../README.md) / [Modules](../modules.md) / types/Consequence

# Module: types/Consequence

## Table of contents

### Type Aliases

- [Consequence](types_Consequence.md#consequence)

## Type Aliases

### Consequence

Ƭ **Consequence**: `Object`

The format of a consequence card as data in the system.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `consequenceType` | [`ConsequenceType`](../enums/enums_ConsequenceType.ConsequenceType.md) |
| `id` | `number` |
| `story` | `string` |
| `timerLength?` | `number` |

#### Defined in

[types/Consequence.ts:6](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/types/Consequence.ts#L6)
[Documentation](../README.md) / [Modules](../modules.md) / types/Player

# Module: types/Player

## Table of contents

### Type Aliases

- [Player](types_Player.md#player)

## Type Aliases

### Player

Ƭ **Player**: `Object`

The format of a player as data in the system.
This is what the game and client would see, but may not be all relevant information about them.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color` | `string` |
| `position` | `number` |
| `username` | `string` |

#### Defined in

[types/Player.ts:5](https://github.com/Jazzmoon/SawThat/blob/9bc7485/src/shared/types/Player.ts#L5)
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
[Documentation](../README.md) / [Modules](../modules.md) / util/MathUtil

# Module: util/MathUtil

## Table of contents

### Classes

- [default](../classes/util_MathUtil.default.md)
