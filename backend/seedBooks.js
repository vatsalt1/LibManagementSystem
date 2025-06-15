// backend/seedBooks.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Books from "./model/bookModel.js";
import { faker } from "@faker-js/faker";

dotenv.config();

// Match these exactly with frontend's expected genre names
const genres = [
  "Personal Growth",
  "History",
  "Leadership & Entrepreneurship",
  "Technology",
  "Health and Fitness",
];

const seedBooks = async (count = 50) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    await Books.deleteMany();
    console.log("🗑️ Existing books cleared");

    const books = [];

    for (let i = 0; i < count; i++) {
      books.push({
        bookname: faker.lorem.words({ min: 2, max: 5 }),
        authorname: faker.person.fullName(),
        type: faker.helpers.arrayElement(genres),
        rating: faker.number.float({ min: 1, max: 5, precision: 0.1 }),
        bookImage: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
        price: faker.number.int({ min: 200, max: 1000 }),
      });
    }

    await Books.insertMany(books);
    console.log(`📚 Successfully seeded ${books.length} books.`);
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding books:", err);
    process.exit(1);
  }
};

seedBooks();
