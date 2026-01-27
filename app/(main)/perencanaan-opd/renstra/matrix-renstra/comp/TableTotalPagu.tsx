import { Pagu } from "../type";
import { formatRupiah } from "@/lib/FormatRupiah";

interface TablePagu {
    tahun_list: string[];
    pagu_total: Pagu[];
}

export const TableTotalPagu: React.FC<TablePagu> = ({ tahun_list, pagu_total }) => {
    return (
        <table className="w-full">
            <tbody>
                <tr>
                    <td rowSpan={2} className={`border-r px-6 py-4 font-semibold`}>Total Pagu OPD</td>
                    {tahun_list.map((item: string) => (
                        <td key={item} className="border-r border-b px-6 py-4 font-semibold text-center">{item}</td>
                    ))}
                </tr>
                <tr>
                    {pagu_total.map((item: Pagu, index: number) => (
                        <td key={index} className="border-r px-6 py-4 font-semibold text-center">Rp.{formatRupiah(item.pagu_indikatif)}</td>
                    ))}
                </tr>
            </tbody>
        </table>
    )
}