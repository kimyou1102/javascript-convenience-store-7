import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import InventoryManagement from '../model/InventoryManagement.js';
import { getProductsData, getPromotionsData } from '../utils/getfileData.js';
import { parseProducts } from '../utils/parseProduct.js';

//[물-3],[사이다-5],[감자칩-3]

export default class Controller {
  constructor() {
    this.inventoryManagement;
    this.productToBuy;
  }

  async start() {
    const productsData = await getProductsData();
    const promotionsData = await getPromotionsData();
    this.inventoryManagement = new InventoryManagement(productsData, promotionsData);
    const inventory = this.inventoryManagement.getInventoryInfo();
    OutputView.printGreetingAndInventory(inventory);
    this.productToBuy = await this.getBuyProducts();
    await this.checkApplicablePromotion(this.productToBuy);
    await this.checkPromotionStock();
  }

  async checkPromotionStock() {
    const applicableProducts = this.productToBuy.filter((product) => product.promotionName);
    for (let product of applicableProducts) {
      const count = this.inventoryManagement.getInsufficientPromotionStock(product);
      if (count > 0) {
        await this.checkStock(product, count);
      }
    }
  }

  async checkStock(product, count) {
    let quantity = product.quantity;
    const response = await this.getResponseToNotApplied(product.name, count);
    if (response === 'N') {
      this.updateProductQuantity(product.name, count * -1);
      quantity = product.quantity;
    }
    if (response === 'Y') quantity = product.quantity - count;
    this.updatePromomtionQuantity(product.name, quantity, product.promotionName);
  }

  async checkApplicablePromotion(productToBuy) {
    for (let product of productToBuy) {
      const isPromotion = this.inventoryManagement.canApplyPromotion(product);
      const promotionName = this.inventoryManagement.getPromotionByProductName(product.name);
      if (isPromotion) {
        await this.checkAddStock(product);
        this.addPromotionValue(product.name, promotionName);
      }
    }
  }

  addPromotionValue(productName, promotionName) {
    const index = this.productToBuy.findIndex(({ name }) => name === productName);
    const product = this.productToBuy[index];
    const promomtionQuantity = this.inventoryManagement.getPromomtionQuantity(
      product.quantity,
      promotionName,
    );
    this.productToBuy[index] = { ...product, promotionName, promomtionQuantity };
  }

  async checkAddStock(product) {
    const count = this.inventoryManagement.getInsufficientStockCount(product);
    if (count > 0) {
      const response = await this.getResponseToAdd(product.name, count);
      if (response === 'Y') {
        this.updateProductQuantity(product.name, count);
      }
    }
  }

  updatePromomtionQuantity(productName, quantity, promotionName) {
    const index = this.productToBuy.findIndex(({ name }) => name === productName);
    const product = this.productToBuy[index];
    const promomtionQuantity = this.inventoryManagement.getPromomtionQuantity(
      quantity,
      promotionName,
    );
    this.productToBuy[index] = { ...product, promomtionQuantity };
  }

  updateProductQuantity(name, count) {
    const index = this.productToBuy.findIndex((product) => product.name === name);
    const product = this.productToBuy[index];
    this.productToBuy[index].quantity = product.quantity + count;
  }

  async getResponseToNotApplied(name, count) {
    const input = await InputView.getInput(
      `\n현재 ${name} ${count}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
    );
    return input;
  }

  async getResponseToAdd(name, count) {
    const input = await InputView.getInput(
      `\n현재 ${name}은(는) ${count}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
    );
    return input;
  }

  async getBuyProducts() {
    const input = await InputView.getInput(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    return parseProducts(input);
  }
}
