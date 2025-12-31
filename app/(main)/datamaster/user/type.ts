import { OptionTypeString, OptionTypeBoolean, OptionType } from "@/types";

export interface GetResponseMasterUser {
    id: number;
    nip: string;
    email: string;
    nama_pegawai: string;
    is_active: boolean;
    role: Role[];
}
export interface Role {
    id: number;
    role: string;
}

export interface FormValue {
    nip?: OptionTypeString;
    email: string;
    password: string;
    is_active: OptionTypeBoolean;
    role: OptionType;
}