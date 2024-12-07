import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import InventoryManagement from '../model/InventoryManagement.js';
import { getProductsData, getPromotionsData } from '../utils/getfileData.js';
import { parseProducts } from '../utils/parseProduct.js';

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
    this.checkApplicablePromotion(this.productToBuy);
  }

  async checkApplicablePromotion(productToBuy) {
    for (let product of productToBuy) {
      const isPromotion = this.inventoryManagement.canApplyPromotion(product);
      if (isPromotion) {
        await this.checkStock(product);
      }
    }
  }

  async checkStock(product) {
    const count = this.inventoryManagement.getInsufficientStockCount(product);
    const response = await this.getResponseToAdd(product.name, count);
    if (response === 'Y') {
      this.addProduct(product.name, count);
    }
  }

  addProduct(name, count) {
    const index = this.productToBuy.findIndex((product) => product.name === name);
    const product = this.productToBuy[index];
    this.productToBuy[index].quantity = product.quantity + count;
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
