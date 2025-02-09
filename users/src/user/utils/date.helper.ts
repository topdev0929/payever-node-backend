export class DateHelper {

    public static hundredYearsAgo(): Date {
        const hundredYearsAgo = new Date();
        hundredYearsAgo.setFullYear(hundredYearsAgo.getFullYear()-100);
        hundredYearsAgo.setDate(hundredYearsAgo.getDate()-1);

        return hundredYearsAgo;
    }
}
