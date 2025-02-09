export interface PopulateInterface {
    path: string;
    match?: object;
    populate?: PopulateInterface[] | PopulateInterface;
}
