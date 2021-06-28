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

The database I am interested in using will be a GraphDB known as [Neo4J][Neo4J] and its querying language called Cypher. Graph databases solve the issue of `PRIMARY` and `FOREIGN` key relations that SQL databases so commonly cause. Since the nodes all store their links, we don't have to worry about it.

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

The HTML5, CSS, and JS are all going to be templates stored on the server-side of the project. When a page loads, the template will be filled with content using GoLang Templates and then served to the Frontend. This way, all users get the same information loaded the same way, and the questions from the Database are all loaded appropriately into the game template.

[Disney]: <https://www.disney.com/> "Disney - Official Website"

[JPP]: <https://www.jackboxgames.com/> "Jackbox Party Games - Official Website"

[Neo4J]: <https://neo4j.com/> "Neo4J - Official Website"

[SceneIt]: <https://www.wikiwand.com/en/Scene_It%3F/> "Scene It? - Wikipedia"
