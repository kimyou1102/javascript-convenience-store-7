import { Console } from '@woowacourse/mission-utils';

export default class OutputView {
  static printGreetingAndInventory(inventory) {
    Console.print('안녕하세요. W편의점입니다.');
    Console.print('현재 보유하고 있는 상품입니다.\n');
    this.printInventoryList(inventory);
  }
}
