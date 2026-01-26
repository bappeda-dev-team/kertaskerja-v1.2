'use client'

// import { TablePermasalahan } from "./comp/Table";
import { useBrandingContext } from "@/providers/BrandingProvider";
import { OpdNull, TahunNull } from "@/components/ui/OpdTahunNull";
import { Breadcrumbs } from "@/components/ui/breadcrumb";

const SasaranOpdPage = () => {

    const { branding } = useBrandingContext();
    const opd = branding?.user?.roles == "super_admin" ? branding?.opd?.value : branding?.user?.kode_opd;

    const menu = [
        { label: "Perencanaan OPD", href: "/" },
        { label: "Renstra", href: "/" },
        { label: "Sasaran OPD", href: "/perencanaan-opd/renstra/sasaran-opd", active: true }
    ]

    if ((branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') && (branding?.opd?.value === undefined || branding?.opd?.value === null)) {
        return (
            <OpdNull />
        )
    } else if (branding?.tahun?.value === undefined || branding?.tahun?.value === null) {
        return (
            <TahunNull />
        )
    }
    else {
        return (
            <>
                <Breadcrumbs items={menu} />
                <div className="mt-3 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-wrap items-center justify-between border-b border-gray-200 px-5 py-5">
                        <h1 className="font-bold text-lg uppercase">Sasaran OPD {branding?.tahun?.label || ''}</h1>
                        {(branding?.user?.roles == 'super_admin' || branding?.user?.roles == 'reviewer') ?
                            <h1 className="text-sm">{branding?.opd?.label || ''}</h1>
                            :
                            <h1 className="text-sm">{branding?.user?.nama_opd || ''}</h1>
                        }
                    </div>
                    <div className="flex m-2">
                        {/* <TablePermasalahan kode_opd={opd} tahun={String(branding?.tahun?.value) ?? "0"}/> */}
                    </div>
                </div>
            </>
        )
    }

}

export default SasaranOpdPage;