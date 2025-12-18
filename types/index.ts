export interface OptionTypeString {
    value: string;
    label: string;
}
export interface OptionType {
    value: number;
    label: string;
}
export interface OptionTypeBoolean {
    value: boolean;
    label: string;
}

export interface GetResponseGlobal<T> {
    data: T
    status: string;
    code: number;
}