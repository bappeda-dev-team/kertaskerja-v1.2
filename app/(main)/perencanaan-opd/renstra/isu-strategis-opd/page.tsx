'use client'

import TableIsuStrategis from "./comp/TableIsuStrategis";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OpdNull, TahunNull } from "@/components/ui/OpdTahunNull";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const IsuStrategisOpd = () => {

    const { branding } = useBrandingContext();
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    const menu = [
        { label: "Perencanaan OPD", href: "/" },
        { label: "Renstra", href: "/" },
        { label: "Permasalahan OPD", href: "/perencanaan-opd/renstra/permasalahan-opd", active: true }
    ]

    if((branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') && (branding?.opd?.value === undefined || branding?.opd?.value === null)){
        return(
            <OpdNull />
        )
    } else if(branding?.tahun?.value === undefined || branding?.tahun?.value === null){
        return(
            <TahunNull />
        )
    } 
    else {
        return (
            <>
                <Breadcrumbs items={menu} />
                <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                        <h1 className="font-bold text-lg uppercase">Isu Strategis OPD {branding?.tahun?.label || ''}</h1>
                        {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                            <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                            :
                            <div className="">
                                <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                            </div>
                        }
                    </div>
                    <div className="flex m-2">
                        <TableIsuStrategis 
                            nama_opd={nama_opd}
                            kode_opd={kode_opd}
                            tahun={branding?.tahun?.value}
                        />
                    </div>
                </div>
            </>
        )
    }
    
}

export default IsuStrategisOpd;