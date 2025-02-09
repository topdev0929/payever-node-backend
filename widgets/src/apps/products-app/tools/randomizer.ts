export class Randomizer {
  public static shuffleArray<T>(array: T[]): T[] {
    if (array.length <= 1) {
      return array;
    }

    const dataArray: T[] = [...array];
    for (let i: number = 0; i < dataArray.length; i++) {
      const randomChoiceIndex: number = this.randomInt(i, dataArray.length - 1);
      [dataArray[i], dataArray[randomChoiceIndex]] = [dataArray[randomChoiceIndex], dataArray[i]];
    }

    return dataArray;
  }

  public static randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
