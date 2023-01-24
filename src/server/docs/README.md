backend / [Modules](modules.md)

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
