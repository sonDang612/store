export const totalCalculatePrice = (
  totalPrice: number,
  discount: number,
  fee: number,
) => {
  const subtotal = totalPrice - discount;
  return (subtotal > 0 ? subtotal + fee : fee).toFixed(2);
};
