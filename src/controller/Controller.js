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
    }
  }

  async getBuyProducts() {
    const input = await InputView.getInput(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    return parseProducts(input);
  }
}
