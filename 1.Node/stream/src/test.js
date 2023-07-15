var orders = ["C3", "C2", "C1"];
var ordersTarget = ["C1", "C2", "C3", "R", "BR"];

ordersTarget.sort((a, b) => {
  let aIndexOf = orders.indexOf(a);
  let bIndexOf = orders.indexOf(b);

  if (aIndexOf === -1) aIndexOf = orders.length;
  if (bIndexOf === -1) bIndexOf = orders.length;

  return aIndexOf < bIndexOf ? -1 : aIndexOf < bIndexOf ? 1 : 0;
});

console.log(ordersTarget);
