import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import InventoryManagement from '../model/InventoryManagement.js';
import { getProductsData, getPromotionsData } from '../utils/getfileData.js';
import { parseProducts } from '../utils/parseProduct.js';

export default class Controller {
  async start() {
    const productsData = await getProductsData();
    const promotionsData = await getPromotionsData();
    const inventoryManagement = new InventoryManagement(productsData, promotionsData);
    const inventory = inventoryManagement.getInventoryInfo();
    OutputView.printGreetingAndInventory(inventory);
    const buyProducts = await this.getBuyProducts();
  }

  async getBuyProducts() {
    const input = await InputView.getInput(
      '\n구매하실 상품명과 수량을 입력해 주세요. (예: [사이다-2],[감자칩-1])',
    );
    return parseProducts(input);
  }
}
