export const associateBy = <T, K>(
  array: T[],
  keySelector: (element: T) => K,
) => {
  const map = new Map<K, T>();

  for (const element of array) {
    const key = keySelector(element);
    map.set(key, element);
  }

  return map;
};

export const random = <T>(array: T[]) => {
  const randomIndex = Math.random() * array.length;
  const index = Math.floor(randomIndex);
  return array[index];
};
