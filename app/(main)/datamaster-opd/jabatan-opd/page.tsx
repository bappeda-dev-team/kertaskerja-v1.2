'use client'

import Table from "./comp/Table";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { IsLoadingBranding } from "@/lib/loading";

const JabatanOpd = () => {

    const { LoadingBranding, branding } = useBrandingContext();
    const nama_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.label : branding?.user?.nama_opd;
    const kode_opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    if(LoadingBranding){
        return <IsLoadingBranding />
    } else {
        return (
            <>
                <Table 
                    kode_opd={kode_opd}
                    nama_opd={nama_opd}
                    tahun={branding?.tahun?.value ?? 0}
                />
            </>
        )
    }

}

export default JabatanOpd;