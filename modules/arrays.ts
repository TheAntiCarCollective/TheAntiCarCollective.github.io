export const random = <T>(array: T[]) => {
  const randomIndex = Math.random() * array.length;
  const index = Math.floor(randomIndex);
  return array[index];
};
