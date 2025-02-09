export class IndicatorHelper {
  public static processingIndicator(i: number): void {
    const P: string[] = ['\\', '|', '/', '-'];
    const x: number = i % 4;
    process.stdout.write('\r' + P[x]);
  }
}
