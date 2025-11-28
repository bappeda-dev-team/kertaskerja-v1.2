import React from 'react';
import { TbCheck, TbCircleLetterXFilled, TbHourglass, TbCircleCheckFilled } from 'react-icons/tb';
import { pohon, Tagging } from "../type/rekin";

export const TablePohon = ({item} : {item: pohon}) => {
    const id = item.id;
    const tema = item.nama_pohon;
    const tagging = item.tagging;
    const keterangan = item.keterangan;
    const opd = item.kode_opd;
    const nama_opd = item.nama_opd;
    const jenis = item.jenis_pohon;
    const indikator = item.indikator;
    const status = item.status;

    return (
        <div className="flex flex-col w-full">
            {/* TAGGING */}
            {tagging &&
                tagging.map((tg: Tagging, tag_index: number) => (
                    <div key={tag_index} className="flex flex-col gap-1 w-full px-3 py-1 border border-yellow-400 rounded-lg bg-white mb-2">
                        <div className='flex items-center gap-1'>
                            <h1 className='text-emerald-500'><TbCircleCheckFilled /></h1>
                            <h1 className='font-semibold'>{tg.nama_tagging || "-"}</h1>
                        </div>
                        <h1 className="p-1 text-slate-600 text-start">{tg.keterangan_tagging || ""}</h1>
                    </div>
                ))
            }
            <table className='w-full'>
                <tbody>
                    <tr>
                        <td
                            className={`min-w-[50px] border px-2 py-3 bg-white text-start rounded-tl-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            Nama Pohon
                        </td>
                        <td
                            className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-tr-lg
                                ${jenis === "Strategic" && "border-red-700"}
                                ${jenis === "Tactical" && "border-blue-500"}
                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                            `}
                        >
                            {tema ? tema : "-"}
                        </td>
                    </tr>
                    {indikator ?
                        indikator.length > 1 ?
                            indikator.map((data: any, index: number) => (
                                <React.Fragment key={data.id_indikator}>
                                    <tr>
                                        <td
                                            className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            Indikator {index + 1}
                                        </td>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            {data.nama_indikator ? data.nama_indikator : "-"}
                                        </td>
                                    </tr>
                                    {data.targets ? 
                                        data.targets.map((data: any) => (
                                            <tr key={data.id_target}>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan {index + 1}
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    :
                                            <tr>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    -
                                                </td>
                                            </tr>
                                    }
                                </React.Fragment>
                            ))
                            :
                            indikator.map((data: any) => (
                                <React.Fragment key={data.id_indikator}>
                                    <tr>
                                        <td
                                            className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            Indikator
                                        </td>
                                        <td
                                            className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                ${jenis === "Strategic" && "border-red-700"}
                                                ${jenis === "Tactical" && "border-blue-500"}
                                                ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                            `}
                                        >
                                            {data.nama_indikator ? data.nama_indikator : "-"}
                                        </td>
                                    </tr>
                                    {data.targets ? 
                                        data.targets.map((data: any) => (
                                            <tr key={data.id_target}>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                                </td>
                                            </tr>
                                        ))
                                    :
                                            <tr>
                                                <td
                                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    Target/Satuan
                                                </td>
                                                <td
                                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                                        ${jenis === "Strategic" && "border-red-700"}
                                                        ${jenis === "Tactical" && "border-blue-500"}
                                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                                    `}
                                                >
                                                    -
                                                </td>
                                            </tr>
                                    }
                                </React.Fragment>
                            ))
                        :
                        <>
                            <tr>
                                <td
                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    `}
                                >
                                    Indikator
                                </td>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    `}
                                >
                                    -
                                </td>
                            </tr>
                            <tr>
                                <td
                                    className={`min-w-[50px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                    `}
                                >
                                    Target/Satuan
                                </td>
                                <td
                                    className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                        ${jenis === "Strategic" && "border-red-700"}
                                        ${jenis === "Tactical" && "border-blue-500"}
                                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                        ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                        ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                    `}
                                >
                                    -
                                </td>
                            </tr>
                        </>
                    }
                    {opd &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Kode OPD
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                {opd ? opd : "-"}
                            </td>
                        </tr>
                    }
                    {nama_opd &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Perangkat Daerah
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                {nama_opd ? nama_opd : "-"}
                            </td>
                        </tr>
                    }
                    {keterangan &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start rounded-bl-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                Keterangan
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-br-lg
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}    
                                `}
                            >
                                {keterangan ? keterangan : "-"}
                            </td>
                        </tr>
                    }
                    {status &&
                        <tr>
                            <td
                                className={`min-w-[50px] border px-2 py-1 bg-white text-start rounded-l-lg
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                                `}
                            >
                                Status
                            </td>
                            <td
                                className={`min-w-[100px] border px-2 py-3 bg-white text-start rounded-r-lg
                                    ${(jenis === "Strategic Pemda" || jenis === "Tactical Pemda" || jenis === "Operational Pemda") && "border-black"}
                                    ${(jenis === "Strategic Crosscutting" || jenis === "Tactical Crosscutting" || jenis === "Operational Crosscutting" || jenis === "Operational N Crosscutting") && "border-yellow-700"}
                                    ${jenis === "Strategic" && "border-red-700"}
                                    ${jenis === "Tactical" && "border-blue-500"}
                                    ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"} 
                                `}
                            >
                                {status === 'menunggu_disetujui' ? (
                                    <div className="flex items-center">
                                        Pending
                                        <TbHourglass />
                                    </div>
                                ) : status === 'crosscutting_disetujui_existing' ? (
                                    <div className="flex items-center text-green-500">
                                        Pilihan Crosscutting
                                        <TbCheck />
                                    </div>
                                ) : status === 'disetujui' ? (
                                    <div className="flex items-center text-green-500">
                                        Disetujui
                                        <TbCheck />
                                    </div>
                                ) : status === 'ditolak' ? (
                                    <div className="flex items-center text-red-500">
                                        Ditolak
                                        <TbCircleLetterXFilled />
                                    </div>
                                ) : (
                                    <span>{status || "-"}</span>
                                )}
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    )
}