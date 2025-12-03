'use client'

import Table from "./Table";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OpdNull, TahunNull } from "@/components/ui/OpdTahunNull";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const ControlPokin = () => {

    const { branding } = useBrandingContext();

    const menu = [
        { label: "Laporan", href: "/" },
        { label: "Control Pokin", href: "/laporan/control-pokin", active: true }
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
                        <h1 className="font-bold text-lg uppercase">Control Pokin {branding?.tahun?.label || ''}</h1>
                        {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                            <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                            :
                            <div className="">
                                <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                            </div>
                        }
                    </div>
                    <div className="flex m-2">
                        {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                            <Table kode_opd={branding?.opd?.value || ""} tahun={branding?.tahun?.value}/>
                            :
                            (branding?.tahun?.value === undefined) ?
                                <div className="w-full">
                                    <TahunNull />
                                </div>
                                :
                                <Table kode_opd={branding?.user?.kode_opd} tahun={branding?.tahun?.value} />
                        }
                    </div>
                </div>
            </>
        )
    }
    
}

export default ControlPokin;