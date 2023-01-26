# frontend API (contained in Middleware folder) docs

## HTTP_API.ts
This class is used throughout the project to send HTTP requests (ex: the initial request to join a game).

This class is static and cannot be manually instantiated. This ensures consistency with the `WS_API` (discussed later) and avoids potential confusion with multiple sources of transmitting HTTP requests and responses.

This class extends from the `Base_HTTP_API.ts` class which is located in the `src/shared/` folder. This base class defines all the underlying framework for HTTP communication for both the client and game nodes. The `HTTP_API.ts` file that is then stored in the individual nodes implements the actual requests that are relevant to each node.

For a detailed explanation of each function, please see the inline JSDoc-formatted comments that are placed before each method.

## WS_API.ts
This class is used throughout the project to manage the WebSocket connection that is maintained with the server as well as transmit and receive game state data. WebSockets are the primary method of bidirectional communication in this project, so each client node maintains a persistent connection with the server.

This class is static and cannot be manually instantiated. This ensures that there is never more than one WebSocket connection with the server at any time.

This class extends from the `Base_WS_API.ts` class which is located in the `src/shared/` folder. This base class defines all the underlying framework for setting up, maintaining, using, and destroying the WebSocket connection for both the client and game nodes. The `WS_API.ts` file that is then stored in the individual nodes implements the actual requests that are relevant to each node.

### Some important notes about using this class
- Although the WebSocket API does not support async/await calling paradigm, we have retrofitted it and so all the methods in the class can be used with `await` to await completion before continuing.
- Before you can send or receive data, you must call the `setupWebSocketConnection` method to establish a connection to the server. After the returned promise completes, the connection will be ready for data transmission.
- You can register a listener that will be called when a message is received from the server via the `addIncomingMessageCallback` method.
    - The system allows for multiple callbacks and thus allows us to split the handling of messages to their respective views. Thereby preserving Separation of Concerns.
    - It is important to unregister the callbacks via the `removeIncomingMessageCallback` method before closing the view though to avoid sending data to non-existant places.
- Each request originating from the client or game nodes will have a `requestId` this is used to associate requests with their responses. Therefore, we can handle out of order messages as well as many duplicate requests without issue.

For a detailed explanation of each function, please see the inline JSDoc-formatted comments that are placed before each method.

# File Structure of frontend nodes
## Views
The views folder contains individual "screens" that are displayed throughout the webapp. For example, the game join screen or the answer a multiple-choice question screen.

Each view is composed of:
- A script - used for handling the logic (in TypeScript)
- A template - HTML that does the layout of the view
- A style - CSS that does micro-adjustments to the layout to make a more visually appealing view.

Each view is self-contained inside a single `.vue` file although it can reference components, middleware, and assets.

## Components
The components folder contains views that are used in several places as part of a larger view. For example, a timer UI adornment.

Components follow the exact same pattern as views and have all the same limitations and flexibilities as regular views. Components also have the `.vue` file extension.

## Assets
The assets folder contains images and other resource files that are used throughout the webapp.

## Middleware
The middleware folder contains all the API-related typescript logic that is references throughout the webapp. The files in this section act as an abstraction layer to abstract the requests and make them all as easy to use as possible. See the frontend API section of this file for specifics about how the files in this folder function.

## App.vue
Both the game and client nodes have an `App.vue` file. This is the main view file that selects which sub-view to show. The `App.vue` file runs throughout the entire execution of the webapp and handles the following items:
- View selection and navigation
- Some incoming WebSocket message handling (this is split between the sub-views as well as `App.vue` handles the navigation related ones).
- game state storage and manipulation (since `App.vue` is always executing, it is a good place to store all the game state)

## Main.ts
Both the client and game nodes have this file. It is used as an entry point to load the `App.vue` file at runtime. It can also be used to register listeners and other long-running processes that should not be linked to any particular view.

## ../src/shared
This folder contains any files that are shared between nodes (client, server. or game). Most of the subfolders contains typing information (since TypeScript separates types from the data) but there is also the `Base_WS_APi.ts` and `Base_HTTP_API.ts` files which handle the communication between frontend nodes and the server (See the frontend API section for more information).

# Client Node
Each run of the game will consist of 2 or more client nodes. Each client node corresponds to one player.

## Views
### HomeView.vue
This view is responsible for collecting user input (in the form of a game code and username) and then transmitting it to the server to join a game. Once a game is joined, this view changes to the `MainView`.

### MainView.vue
This view is responsible for showing the current leaderboard standings to the user as well as who is the next player. This view is displayed while it is not the player's turn to answer a question or acknowledge a consequence after they have joined a game.

### MultipleChoiceQuestion.vue
This view is shown to the player once it is their turn to answer a question. Upon answering a question, the player's response is captured and sent to the server. Then the client node returns to the `MainView`.

# Game node
## Components

### Board
Displays the positional of each player as a coloured circle on a virtual board. Once the players reach the last position, they win. Each player's circle color is randomly assigned but is consistent through all the nodes.

### Consequence Modal
This component pops-up when a player must face a consequence. It displays the consequence in textual form and shows a timer. After the timer expires, the component disappears and the game continues.

## PlayersList
This view lists all the players that are currently in the game as well as highlights the player who is currently answering a question.

## Views

### HomeView.vue
This view is responsible for creating and then starting a game, displaying the game code (once a game is created) so that the players can enter the code on the client nodes, listing the already joined players, and configuring the game. After all that is completed, the game node switches to the `MainView`.

### MainView.vue
This is the main view that is displayed throughout the game. It consists of the board (which shows the current location of each player) as well as a player list (which shows the current players and highlights the player whose turn is next).

### MultipleChoiceQuestion.vue
This view appears when a client node needs to answer a question. This view shows the question as well as a related or decorational background image as well as a timer while the player is answering. After the player answer, or the timer runs out, the gam enode transitions back to the `MainView`.

[server](README.md) / Modules

# Server Node

### Modules

- [controllers/AuthController](modules/controllers_AuthController.md)
- [controllers/ClientController](modules/controllers_ClientController.md)
- [controllers/GameController](modules/controllers_GameController.md)
- [controllers/QuizController](modules/controllers_QuizController.md)
- [index](modules/index.md)
- [models/Game](modules/models_Game.md)
- [models/User](modules/models_User.md)
- [routes/basic.router](modules/routes_basic_router.md)
- [routes/client.router](modules/routes_client_router.md)
- [routes/game.router](modules/routes_game_router.md)
- [routes/ws.router](modules/routes_ws_router.md)


# Setup and running

Please see section 7.1 Building and launching the project of our Software Design Document for details. This node will not function independently, so it is important to setup all the nodes before interacting with any them independently.

