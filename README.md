# Saw That?

As a kid, my sister and I were obsessed with Screenlife's DVD Trivia game called [**Scene It?**][SceneIt]. Sadly, those games are no longer being produced anymore, as the medium of DVD game isn't very popular anymore. However, especially due to the recent pandemic, remote games, such as those featured in [Jackbox Party Packs][JPP], that you can play with friends have become more and more valued.

**Saw That?** is intended to bring the DVD trivia game genre that **Scene It?** revolutionized into a more modernized medium, in the hopes that it will become a popular game if the rights can be obtained to the different themes you want to make.

If you wanted to play a [**Disney**][Disney] themed **Saw That?** game, all you would need to do is download the source code, make an asset pack, and make the questions for it.

Because we don't own the rights to any media snippets, we can't release a version of the game that is already populated with Trivia questions. The most we can do is make the infrastructure in the hopes that you guys will make fun content packs and maybe find a way of sharing those.

## Plans

### Backend API

GoLang has been growing quite steadily over the last few years, and after using it for a co-op position, it seemed like the natural first choice for the backend.

The backend will include an API that acts as a middle ground between the Server entry point and the Databases, a web socket handler to allow multiple user accounts to play the game simultaneously with each other while also being remote, and a Template renderer that will serve files to the front end for display.

### Database

The database design will require a lot of care and initial planning before we mindlessly go into coding it, but the general idea will be like so:

- `type User`: Represent the different user accounts
  - `UUID: string`: `User` Universally Unique ID in a Cypher transaction.
  - `username: string`: Username
  - `password: string`: Sha256 encoded password
  - `roles: [string]`: Permissions or Roles assigned to the user
  - `suspended: bool`: Determines if an admin account has suspended the `User`'s login
- `type Game`: Represent the different Game instances
  - `UUID: string`: Universally Unique ID in a Cypher transaction.
  - `gamename: string`: Custom game lobby name
  - `password: string`: Sha256 encoded password for the game
  - `players: [User][4]`: List of players currently in the game
- `type Theme`: Represent the different Game theme packs
  - `UUID: string`: Universally Unique ID in a Cypher transaction.
  - `name: string`: Theme Name
- `type Minigame`: **Enum** - Represent the different Theme minigames
  - All Play
  - My Play
  - Challenges
  - Buzz
  - Trivia
  - Tiebreaker
- `type Question`

We will also need to record the Game's state in memory, so that way everyone in the game is seeing the correct game board.

### Frontend Serving

After getting aquainted with [**ReactJS**][ReactJS] over the summer, we plan on using a version of that to host the front-end. Either using [ReactJS][ReactJS] itself, or a minified version of it called [**NextJS**][NextJS]. Communication to the backend API would likely then be done using [Axios][Axios], and a websocket would be established allowing the game to be played Async.

[Axios]: <https://www.npmjs.com/package/axios> "Axios NPM Package"

[Disney]: <https://www.disney.com/> "Disney - Official Website"

[JPP]: <https://www.jackboxgames.com/> "Jackbox Party Games - Official Website"

[NextJS]: <https://nextjs.org/> "NextJS - Official Website"

[ReactJS]: <https://reactjs.org/> "ReactJS - Official Website"

[SceneIt]: <https://www.wikiwand.com/en/Scene_It%3F/> "Scene It? - Wikipedia"
