export default class Membership {
  #remainingAmount;

  constructor(membershipAmount) {
    this.#remainingAmount = membershipAmount;
  }

  discountMembership(money) {
    if (!this.#checkRemainingAmount()) return 0;
    const membershipAmount = this.#calculateMembership(money);
    const gap = this.#remainingAmount - membershipAmount;

    return this.#getResultMembershipAmount(gap, membershipAmount);
  }

  #getResultMembershipAmount(gap, membershipAmount) {
    if (gap < 0) {
      const rest = this.#remainingAmount;
      this.#remainingAmount = 0;
      return rest;
    }

    this.#remainingAmount -= membershipAmount;
    return membershipAmount;
  }

  #calculateMembership(money) {
    const DISCOUNT_RATE = 0.3;

    return money * DISCOUNT_RATE;
  }

  #checkRemainingAmount() {
    if (this.#remainingAmount <= 0) {
      return false;
    }
    return true;
  }
}
