// import mongoose from "mongoose";

const Game = require("../models/Game");

export async function basicGet() {
  return {
    hello: "world",
  };
}

const generateGameID = async (): Promise<string> => {
  // Generate 7 digit alphanumeric game code
  let gameID = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < 7; i++)
    gameID += characters.charAt(Math.floor(Math.random() * characters.length));

  // Check if Game object can be found by Mongoose using this id
  try {
    let game = await Game.findByID(gameID);
    return game === null ? gameID : generateGameID();
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const createGame = async (req, res) => {};
