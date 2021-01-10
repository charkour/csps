/**
 * Return a random element from an array.
 *
 * @param  {T[]} arr
 * @returns T
 * Ref: https://stackoverflow.com/a/4550514/9931154
 */
export const random_choice = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffle the values of an array using Durstenfeld shuffle
 * Returns a copy of the array.
 *
 * @param  {any[]} arr
 * @returns any
 * Ref: https://stackoverflow.com/a/12646864/9931154
 */
export const shuffle_array = (arr: any[]): any[] => {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Returns the paramter
 *
 * @param  {any} val
 * @returns any
 */
export const identity = (val: any): any => val;

/**
 * Return a minimum element of seq; break ties at random.
 *
 * @param  {any[]} seq
 * @param  {(val:any)=>number=identity} key
 * @returns any
 * Ref for reduce(): https://stackoverflow.com/a/31844649/9931154
 */
export const argmin_random_tie = (
  seq: any[],
  // seq: T[][], // TODO: Is this better?
  key: (val: any) => number = identity,
): any => {
  return shuffle_array(seq).reduce((prev, curr) => {
    return key(prev) < key(curr) ? prev : curr;
  });
};
