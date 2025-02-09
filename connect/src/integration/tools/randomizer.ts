export class Randomizer {
  public static shuffleArray<T>(array: T[]): T[] {
    if (array.length <= 1) {
      return array;
    }

    for (let i: number = 0; i < array.length; i++) {
      const randomChoiceIndex: number = this.randomInt(i, array.length - 1);
      [array[i], array[randomChoiceIndex]] = [array[randomChoiceIndex], array[i]];
    }

    return array;
  }

  public static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
