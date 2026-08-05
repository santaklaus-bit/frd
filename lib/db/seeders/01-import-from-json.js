'use strict';
const path = require('path');
const fs = require('fs/promises');
const matter = require('gray-matter');

const BLOG_PATH = path.join(process.cwd(), "blog/content");
const DICT_PATH = path.join(process.cwd(), "dictionaries");
const DATA_PATH = path.join(process.cwd(), "lib/data");

async function safelyReadJson(filePath) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch (e) {
    console.warn(`Could not read ${filePath}, skipping...`);
    return null;
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Dictionaries
    const frDict = await safelyReadJson(path.join(DICT_PATH, "fr.json"));
    const enDict = await safelyReadJson(path.join(DICT_PATH, "en.json"));
    
    if (frDict) {
      await queryInterface.bulkInsert('Dictionaries', [{
        lang: 'fr',
        content: JSON.stringify(frDict),
        createdAt: now,
        updatedAt: now
      }], { ignoreDuplicates: true });
    }
    
    if (enDict) {
      await queryInterface.bulkInsert('Dictionaries', [{
        lang: 'en',
        content: JSON.stringify(enDict),
        createdAt: now,
        updatedAt: now
      }], { ignoreDuplicates: true });
    }

    // 2. Newsletter Subscribers
    const subscribers = await safelyReadJson(path.join(DATA_PATH, "newsletter-subscribers.json"));
    if (subscribers && subscribers.length > 0) {
      const records = subscribers.map(s => ({
        email: s.email,
        subscribedAt: new Date(s.subscribedAt),
        createdAt: now,
        updatedAt: now
      }));
      await queryInterface.bulkInsert('Subscribers', records, { ignoreDuplicates: true });
    }

    // 3. Contact Messages
    const messages = await safelyReadJson(path.join(DATA_PATH, "contact-messages.json"));
    if (messages && messages.length > 0) {
      const records = messages.map(m => ({
        fullName: m.fullName,
        email: m.email,
        requestType: m.requestType,
        message: m.message,
        isRead: m.isRead || false,
        createdAt: new Date(m.createdAt),
        updatedAt: now
      }));
      await queryInterface.bulkInsert('ContactMessages', records);
    }

    // 4. Expertise (formerly Initiatives)
    const expertise = await safelyReadJson(path.join(DATA_PATH, "expertise.json"));
    if (expertise && expertise.length > 0) {
      const records = expertise
        .filter(i => i.slug)
        .map((i, index) => ({
          slug: i.slug,
          icon: i.icon || 'Target',
          titleFr: i.title?.fr || i.title || '',
          titleEn: i.title?.en || i.title || '',
          descriptionFr: i.description?.fr || i.description || '',
          descriptionEn: i.description?.en || i.description || '',
          categoryFr: i.category?.fr || i.category || '',
          categoryEn: i.category?.en || i.category || '',
          link: i.link || null,
          order: index,
          createdAt: now,
          updatedAt: now
        }));
      if (records.length > 0) {
        await queryInterface.bulkInsert('Initiatives', records, { ignoreDuplicates: true });
      }
    }

    // 5. Projects (formerly Production)
    const projects = await safelyReadJson(path.join(DATA_PATH, "projects.json"));
    if (projects && projects.length > 0) {
      const records = projects
        .filter(p => p.slug)
        .map((p, index) => ({
          slug: p.slug,
          icon: p.icon || 'Video',
          titleFr: p.title?.fr || p.title || '',
          titleEn: p.title?.en || p.title || '',
          descriptionFr: p.description?.fr || p.description || '',
          descriptionEn: p.description?.en || p.description || '',
          detailsFr: p.details?.fr || p.details || '',
          detailsEn: p.details?.en || p.details || '',
          href: p.href || '',
          order: index,
          createdAt: now,
          updatedAt: now
        }));
      if (records.length > 0) {
        await queryInterface.bulkInsert('Productions', records, { ignoreDuplicates: true });
      }
    }

    // 6. Blog Posts
    try {
      const files = await fs.readdir(BLOG_PATH);
      const mdxFiles = files.filter(f => f.endsWith('.mdx'));
      const records = [];
      
      for (const file of mdxFiles) {
        const filePath = path.join(BLOG_PATH, file);
        const content = await fs.readFile(filePath, "utf-8");
        const parsed = matter(content);
        
        records.push({
          slug: file.replace('.mdx', ''),
          title: parsed.data.title || 'Untitled',
          description: parsed.data.description || null,
          date: parsed.data.date ? new Date(parsed.data.date) : now,
          thumbnail: parsed.data.thumbnail || null,
          content: parsed.content || '',
          createdAt: now,
          updatedAt: now
        });
      }

      if (records.length > 0) {
        await queryInterface.bulkInsert('BlogPosts', records, { ignoreDuplicates: true });
      }
    } catch (e) {
      console.warn("Could not read blog posts, skipping...");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Dictionaries', null, {});
    await queryInterface.bulkDelete('Subscribers', null, {});
    await queryInterface.bulkDelete('ContactMessages', null, {});
    await queryInterface.bulkDelete('Initiatives', null, {});
    await queryInterface.bulkDelete('Productions', null, {});
    await queryInterface.bulkDelete('BlogPosts', null, {});
  }
};
