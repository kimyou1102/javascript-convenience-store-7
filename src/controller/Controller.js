import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import InventoryManagement from '../model/InventoryManagement.js';
import { getProductsData, getPromotionsData } from '../utils/getfileData.js';
import { parseProducts } from '../utils/parseProduct.js';
import Membership from '../model/Membership.js';
import { DateTimes } from '@woowacourse/mission-utils';
import { validateBuyProducts, validateResponse } from '../utils/validation.js';
//[물-3],[사이다-5],[감자칩-3]

export default class Controller {
  constructor() {
    this.inventoryManagement;
    this.productToBuy = [];
    this.membership = new Membership(8000);
  }

  // eslint-disable-next-line max-lines-per-function
  async start() {
    const productsData = await getProductsData();
    const promotionsData = await getPromotionsData();
    this.inventoryManagement = new InventoryManagement(productsData, promotionsData);
    const inventory = this.inventoryManagement.getInventoryInfo();
    OutputView.printGreetingAndInventory(inventory);
    this.productToBuy = await this.getBuyProducts();
    await this.checkApplicablePromotion(this.productToBuy);
    await this.checkPromotionStock();
    this.buyProducts();
    const money = this.sumPrice();
    const membershipAmount = await this.getMembershipAmount(money);
    const applicableProducts = this.productToBuy.filter((product) => product.promotionName);
    OutputView.printReceipt(this.productToBuy, applicableProducts, membershipAmount);
    const response = await this.getResponseToAddPurchase();
    if (response === 'Y') await this.start();
  }

  sumPrice() {
    return this.productToBuy.reduce((acc, value) => acc + value.price * value.quantity, 0);
  }

  async getMembershipAmount(money) {
    if (money === 0) return 0;
    const response = await this.getResponseToMembership();

    if (response === 'Y') {
      return this.membership.discountMembership(money);
    }
    return 0;
  }

  buyProducts() {
    this.productToBuy.forEach((product) => {
      this.inventoryManagement.buyProduct(product);
    });
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

  // eslint-disable-next-line max-lines-per-function
  async checkApplicablePromotion(productToBuy) {
    for (let product of productToBuy) {
      const promotionName = this.inventoryManagement.getPromotionByProductName(product.name);
      const isApplicableDate = this.inventoryManagement.isPromotionApplicableDate(
        promotionName,
        DateTimes.now(),
      );
      console.log('isApplicableDate:', isApplicableDate);
      if (promotionName !== null && isApplicableDate) {
        await this.checkAddStock(product);
        this.addPromotionValue(product.name, promotionName);
      }
      this.addPriceValue(product.name);
    }
  }

  addPriceValue(productName) {
    const index = this.productToBuy.findIndex(({ name }) => name === productName);
    const product = this.productToBuy[index];
    const price = this.inventoryManagement.getPriceByProductName(productName);
    this.productToBuy[index] = { ...product, price };
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

  async getResponseToAddPurchase() {
    const input = await this.getValidatedInputWithRetry(
      '감사합니다. 구매하고 싶은 다른 상품이 있나요? (Y/N)',
      validateResponse,
    );
    return input;
  }

  async getResponseToMembership() {
    const input = await this.getValidatedInputWithRetry(
      '멤버십 할인을 받으시겠습니까? (Y/N)',
      validateResponse,
    );
    return input;
  }

  async getResponseToNotApplied(name, count) {
    const input = await this.getValidatedInputWithRetry(
      `\n현재 ${name} ${count}개는 프로모션 할인이 적용되지 않습니다. 그래도 구매하시겠습니까? (Y/N)`,
      validateResponse,
    );
    return input;
  }

  async getResponseToAdd(name, count) {
    const input = await this.getValidatedInputWithRetry(
      `\n현재 ${name}은(는) ${count}개를 무료로 더 받을 수 있습니다. 추가하시겠습니까? (Y/N)`,
      validateResponse,
    );
    return input;
  }

  async getBuyProducts() {
    const input = await this.getValidatedInputWithRetry(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
      validateBuyProducts,
    );
    return parseProducts(input);
  }

  async getBuyProducts() {
    const input = await this.getValidatedInputWithRetry(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
      this.validateProductToBuy,
    );
    return parseProducts(input);
  }

  validateProductToBuy = (input) => {
    validateBuyProducts(input);
    const productsToBuy = parseProducts(input);
    this.validateExistProduct(productsToBuy);
    this.validateProductStock(productsToBuy);
    this.validateDuplication(productsToBuy);
  };

  // eslint-disable-next-line max-lines-per-function
  validateProductStock(productsToBuy) {
    productsToBuy.forEach((product) => {
      const promotionName = this.inventoryManagement.getPromotionByProductName(product.name);
      const isCheck = this.inventoryManagement.getTotalInSufficientCount(
        product.name,
        promotionName,
        product.quantity,
      );
      if (!isCheck)
        throw new Error('[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.');
    });
  }

  validateDuplication(productsToBuy) {
    const products = productsToBuy.map((product) => product.name);
    const unique = new Set(products);
    if (products.length !== unique.size) {
      throw new Error('[ERROR] 같은 상품을 여러번 작성할 수 없습니다.');
    }
  }

  validateExistProduct = (productsToBuy) => {
    productsToBuy.forEach(({ name }) => {
      const product = this.inventoryManagement.getProductByProductName(name);
      if (!product) throw new Error('[ERROR] 존재하지 않는 상품입니다. 다시 입력해 주세요.');
    });
  };

  async getValidatedInputWithRetry(message, validate) {
    try {
      const input = await InputView.getInput(message);
      validate(input);
      return input;
    } catch (error) {
      OutputView.printError(error.message);
      return await this.getValidatedInputWithRetry(message, validate);
    }
  }
}
