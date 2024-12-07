import fs from 'fs';
import path from 'path';
import dirname from './dirname.cjs';

const { __dirname } = dirname;

export const readMarkdownFile = async (filename) => {
  const filePath = path.join(__dirname, '../../public', filename);
  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    return data;
  } catch (err) {
    console.error('Error reading file:', err);
  }
};

export const getProductsData = async () => {
  const productsData = await parseMarkdownFile('products.md');
  return parseProductsData(productsData);
};

const parseProductsData = (productsData) => {
  return productsData.map((promotion) => {
    return {
      ...promotion,
      price: Number(promotion.price),
      quantity: Number(promotion.quantity),
    };
  });
};

export const getPromotionsData = async () => {
  const promotionsData = await parseMarkdownFile('promotions.md');
  return parsePromotionsData(promotionsData);
};

const parsePromotionsData = (promotionsData) => {
  return promotionsData.map((promotion) => {
    return {
      ...promotion,
      buy: Number(promotion.buy),
      get: Number(promotion.get),
    };
  });
};

const parseMarkdownFile = async (fileName) => {
  const fileContent = await readMarkdownFile(fileName);
  const lines = fileContent.split('\n').map((x) => x.trim());
  const category = lines.shift().split(',');

  lines.pop();
  return arrangeData(lines, category);
};

const arrangeData = (lines, category) => {
  return lines.map((text) => {
    const values = text.split(',');
    return createObjectFromHeaders(values, category);
  });
};

const createObjectFromHeaders = (values, category) => {
  const itemObject = {};
  for (let i = 0; i < category.length; i++) {
    itemObject[category[i]] = values[i];
  }
  return itemObject;
};
