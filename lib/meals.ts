'use server';
import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';
import { Meal } from '../types/meals';

const db = sql('meals.db');

export async function getMeals() {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a delay
  const stmt = db.prepare('SELECT * FROM meals');
  return stmt.all() as Meal[];
}

export async function getMealBySlug(slug: string) {
  const stmt = db.prepare('SELECT * FROM meals WHERE slug = ?');
  const meal = stmt.get(slug) as Meal | undefined;

  return meal;
}

export async function addMeal(meal: Meal & { image: File }) {
  const slug = slugify(meal.title, {
    lower: true,
  });
  const instructions = xss(meal.instructions);

  const imageExtension = meal.image.name.split('.').pop();
  const fileName = `${slug}.${imageExtension}`;
  const bufferedImage = await meal.image.arrayBuffer();

  fs.createWriteStream(`public/images/${fileName}`).write(
    Buffer.from(bufferedImage),
    (error) => {
      if (error) {
        console.error(`Error saving image ${fileName}:`, error);
      } else {
        console.log(`Image saved as ${fileName}`);
      }
    }
  );

  const stmt = db.prepare(
    'INSERT INTO meals (title, slug, image, summary, creator, creator_email, instructions) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  stmt.run(
    meal.title,
    slug,
    `/images/${fileName}`,
    meal.summary,
    meal.creator,
    meal.creator_email,
    instructions
  );
}
