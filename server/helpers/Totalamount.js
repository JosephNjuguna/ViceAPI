const interestRate = 15;
class totalamountCalculation {
  static totalAmountdata(amount) {
    let numberOfInstallments; let installmentAmount; let
      totalamounttoPay;
    const totalAmount = ((interestRate / 100) * amount) + amount;
    if (totalAmount <= 4000) {
      numberOfInstallments = 4;
    } else if (totalAmount > 4000 && totalAmount <= 9000) {
      numberOfInstallments = 6;
    } else if (totalAmount > 9000 && totalAmount <= 12000) {
      numberOfInstallments = 8;
    } else if (totalAmount > 12000 && totalAmount <= 15000) {
      numberOfInstallments = 10;
    } else if (totalAmount > 15000 && totalAmount <= 18000) {
      numberOfInstallments = 12;
    } else if (totalAmount > 18000 && totalAmount <= 20000) {
      numberOfInstallments = 14;
    } else if (totalAmount > 20000 && totalAmount <= 24000) {
      numberOfInstallments = 16;
    }
    if (totalAmount % numberOfInstallments !== 0) {
      const remainder = totalAmount % numberOfInstallments;
      const remaining = numberOfInstallments - remainder;
      totalamounttoPay = totalAmount + remaining;
    } else {
      totalamounttoPay = totalAmount;
    }
    installmentAmount = totalamounttoPay / numberOfInstallments;
    return {
      numberOfInstallments,
      installmentAmount,
      totalamounttoPay,
      interestRate,
    };
  }
}
export default totalamountCalculation;
