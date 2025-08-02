
import User from "../models/user.model.js";
import Pin from "../models/pin.model.js";
import Board from "../models/board.model.js";
import Comment from "../models/comment.model.js";
import Save from "../models/save.model.js";
import Like from "../models/like.model.js";
import Follow from "../models/follow.model.js";
import bcrypt from "bcryptjs";
import { faker } from '@faker-js/faker';  // Fixed import

import connectDB from "./connectDB.js";
import dotenv from "dotenv";
dotenv.config();

const seedDB = async () => {
  try {
    await connectDB();
    
    // Clear existing data.
    await User.deleteMany({});
    await Pin.deleteMany({});
    await Board.deleteMany({});
    await Comment.deleteMany({});
    await Save.deleteMany({});
    await Like.deleteMany({});
    await Follow.deleteMany({});

    console.log("Creating users...");
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash("password123", 10);
      const user = new User({
        displayName: faker.person.fullName(),
        userName: faker.internet.userName().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        email: faker.internet.email(),
        hashedPassword: hashedPassword,
        img: faker.image.avatar(),
      });
      users.push(await user.save());
    }

    console.log("Creating boards...");
    const boards = [];
    const boardTitles = [
      "Travel Inspiration", "Food & Recipes", "Art & Design", 
      "Home Decor", "Fashion Trends", "Photography", 
      "DIY Projects", "Fitness Motivation", "Tech Gadgets",
      "Book Recommendations"
    ];
    
    for (const user of users) {
      // Shuffle and pick 3-5 boards per user
      const shuffledTitles = [...boardTitles].sort(() => 0.5 - Math.random());
      const userBoardCount = Math.floor(Math.random() * 3) + 3; // 3-5 boards
      
      for (let i = 0; i < userBoardCount; i++) {
        const board = new Board({
          title: `${shuffledTitles[i]} - ${user.userName}`,
          user: user._id,
        });
        boards.push(await board.save());
      }
    }

    console.log("Creating pins...");
    const pins = [];
    const pinCategories = [
      "nature", "food", "architecture", "travel", "art", 
      "fashion", "technology", "people", "animals", "business"
    ];
    
    for (const user of users) {
      const userBoards = boards.filter(
        (board) => board.user.toString() === user._id.toString()
      );
      
      // Create 5-15 pins per user
      const pinCount = Math.floor(Math.random() * 10) + 5;
      
      for (let i = 1; i <= pinCount; i++) {
        const randomBoard = userBoards[Math.floor(Math.random() * userBoards.length)];
        const randomCategory = pinCategories[Math.floor(Math.random() * pinCategories.length)];
        
        const pin = new Pin({
          media: `https://source.unsplash.com/random/800x${Math.random() < 0.5 ? 1200 : 600}/?${randomCategory},${i}`,
          width: 800,
          height: Math.random() < 0.5 ? 1200 : 600,
          title: faker.lorem.words(3),
          description: faker.lorem.sentences(2),
          link: faker.internet.url(),
          board: randomBoard.title,
          tags: faker.lorem.words(3).split(' '),
          user: user._id,
        });
        pins.push(await pin.save());
      }
    }

    console.log("Creating comments...");
    for (const user of users) {
      // Each user comments on 3-8 random pins
      const commentCount = Math.floor(Math.random() * 5) + 3;
      const randomPins = [...pins].sort(() => 0.5 - Math.random()).slice(0, commentCount);
      
      for (const pin of randomPins) {
        const comment = new Comment({
          description: faker.lorem.sentences(1),
          pin: pin._id,
          user: user._id,
        });
        await comment.save();
      }
    }

    console.log("Creating saves...");
    for (const user of users) {
      // Each user saves 5-15 random pins
      const saveCount = Math.floor(Math.random() * 10) + 5;
      const randomPins = [...pins].sort(() => 0.5 - Math.random()).slice(0, saveCount);
      
      for (const pin of randomPins) {
        const save = new Save({
          pin: pin._id,
          user: user._id,
        });
        await save.save();
      }
    }

    console.log("Creating likes...");
    for (const user of users) {
      // Each user likes 10-20 random pins
      const likeCount = Math.floor(Math.random() * 10) + 10;
      const randomPins = [...pins].sort(() => 0.5 - Math.random()).slice(0, likeCount);
      
      for (const pin of randomPins) {
        const like = new Like({
          pin: pin._id,
          user: user._id,
        });
        await like.save();
      }
    }

    console.log("Creating follows...");
    for (const user of users) {
      // Each user follows 2-5 other users
      const followCount = Math.floor(Math.random() * 3) + 2;
      const otherUsers = users.filter(u => u._id.toString() !== user._id.toString());
      const randomUsers = [...otherUsers].sort(() => 0.5 - Math.random()).slice(0, followCount);
      
      for (const followedUser of randomUsers) {
        const follow = new Follow({
          follower: user._id,
          following: followedUser._id,
        });
        await follow.save();
      }
    }

    console.log("✅ Database seeded successfully!");
    console.log(`Created:
      - ${users.length} users
      - ${boards.length} boards
      - ${pins.length} pins
      - ${await Comment.countDocuments()} comments
      - ${await Save.countDocuments()} saves
      - ${await Like.countDocuments()} likes
      - ${await Follow.countDocuments()} follows`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();