import React, { useEffect, useState } from 'react';
import {
    TbCircleCheckFilled, TbEye, TbArrowGuide, TbCheck, TbX, TbCircleLetterXFilled,
    TbCirclePlus, TbHourglass, TbPencil, TbTrash, TbBookmarkPlus, TbZoom, TbCopy, TbPrinter
} from 'react-icons/tb';
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder, ButtonBlackBorder, ButtonBlack, ButtonSky } from '@/components/ui/button';
import { AlertNotification, AlertQuestion } from '@/lib/alert';
import { LoadingClip } from '@/lib/loading';
import { apiFetch } from '@/hook/apiFetch';
import { useBrandingContext } from '@/providers/BrandingProvider';
import { ModalReview } from '@/components/global/pohon/ModalReviewPohon';

interface pohon {
    tema: any;
    deleteTrigger: () => void;
    user?: string;
    show_all?: boolean;
    tahun?: string;
    idForm?: number;
    set_show_all: () => void;
}

interface Review {
    id: number;
    id_pohon_kinerja: number;
    review: string;
    keterangan: string;
    nama_pegawai: string;
}

interface Tagging {
    id: number;
    id_pokin: number;
    nama_tagging: string;
    keterangan_tagging_program: KeteranganTagging[];
}
interface KeteranganTagging {
    id: number;
    id_tagging: number;
    kode_program_unggulan: string;
    keterangan_tagging_program: string;
    tahun: string;
}

export const Pohon: React.FC<pohon> = ({ tema, tahun, deleteTrigger, user, show_all, set_show_all, idForm }) => {

    const [childPohons, setChildPohons] = useState(tema.childs || []);
    const [PutPohons, setPutPohons] = useState(tema.childs || []);
    const [formList, setFormList] = useState<number[]>([]); // List of form IDs
    const [PutList, setPutList] = useState<number[]>([]); // List of form IDs
    const [PutListStrategic, setPutListStrategic] = useState<number[]>([]); // List of form IDs
    const [FormStrategic, setFormStrategic] = useState<number[]>([]); // List of form IDs
    const [strategicPohons, setStrategicPohons] = useState(tema.strategics || []);
    const [edit, setEdit] = useState<boolean>(false);
    const [Deleted, setDeleted] = useState<boolean>(false);
    const [Edited, setEdited] = useState<any | null>(null);

    const { branding } = useBrandingContext();

    // SHOW ALL
    const [Show, setShow] = useState<boolean>(false);

    // REVIEW
    const [IsNewReview, setIsNewReview] = useState<boolean>(false);
    const [IsEditReview, setIsEditReview] = useState<boolean>(false);
    const [idReview, setIdReview] = useState<number | null>(null);
    const [Review, setReview] = useState<Review[]>([]);
    const [ShowReview, setShowReview] = useState<boolean>(false);
    const [LoadingReview, setLoadingReview] = useState<boolean>(false);

    //CLONE
    const [IsClone, setIsClone] = useState<boolean>(false);

    // Adds a new form entry
    const newChild = () => {
        setFormList([...formList, Date.now()]); // Using unique IDs
    };
    const newPutChild = () => {
        setPutList([...PutList, Date.now()]); // Using unique IDs
    };
    const newStrategic = () => {
        setFormStrategic([...FormStrategic, Date.now()]); // Using unique IDs
    };
    const handleEditSuccess = (data: any) => {
        setEdited(data);
        setEdit(false);
    };
    const handleShow = () => {
        setShow((prev) => !prev);
    }

    const handleNewReview = () => {
        if (IsNewReview) {
            setIsNewReview(false);
        } else {
            setIsNewReview(true);
        }
    };
    const handleEditReview = (id: number) => {
        if (IsEditReview) {
            setIsEditReview(false);
            setIdReview(0);
        } else {
            setIsEditReview(true);
            setIdReview(id);
        }
    };
    const fetchReview = async (id_pohon: any) => {
        try {
            setLoadingReview(true);
            await apiFetch(`${branding?.api_perencanaan}/review_pokin/findall/${id_pohon}`, {
            }).then((resp: any) => {
                if (resp.code === 200) {
                    setReview(resp.data);
                    console.log(resp.data);
                } else {
                    console.log('tidak ada review di pohon ini');
                    setReview([]);
                }
            }).catch(err => {
                // AlertNotification("Gagal", `${err}`, "error", 3000, true);
                // console.error(err);
            })
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        } finally {
            setLoadingReview(false);
        }
    };
    const hapusReview = async (id_review: any) => {
        try {
            await apiFetch(`${branding?.api_perencanaan}/review_pokin/delete/${id_review}`, {
                method: "DELETE",
            }).then((resp: any) => {
                if (resp.code === 400 || resp.code === 500) {
                    AlertNotification("Gagal", "Review gagal Dihapus", "success", 1000);
                    console.log(resp);
                } else {
                    AlertNotification("Berhasil", "Review Berhasil Dihapus", "success", 1000);
                    fetchReview(tema.id);
                }
            }).catch(err => {
                AlertNotification("Gagal", `${err}`, "error", 3000, true);
                console.error(err);
            })
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    //STYLING POHON
    const CardPohon = `tf-nc tf flex flex-col w-[600px] rounded-lg shadow-lg pohon-pemda
                            ${tema.jenis_pohon === "Tematik" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Sub Tematik" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Sub Sub Tematik" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Super Tematik" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Strategic Pemda" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'shadow-slate-500'}
                            ${tema.jenis_pohon === "Strategic" && 'shadow-red-500 bg-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'shadow-blue-500 bg-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'shadow-green-500 bg-green-500'}
                            ${tema.status === "ditolak" && 'shadow-black bg-gray-500'}
                        `;
    const HeaderPohon = `flex pt-3 justify-center font-bold text-lg uppercase border my-3 py-3 rounded-lg bg-white
                            ${tema.jenis_pohon === "Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Sub Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Super Sub Tematik" && 'border-black'}
                            ${tema.jenis_pohon === "Strategic" && 'border-red-500 text-red-700'}
                            ${tema.jenis_pohon === "Tactical" && 'border-blue-500 text-blue-500'}
                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-green-500 text-green-500'}
                            ${tema.jenis_pohon === "Strategic Pemda" && 'border-red-700 text-white bg-gradient-to-r from-[#CA3636] from-40% to-[#BD04A1]'}
                            ${tema.jenis_pohon === "Tactical Pemda" && 'border-blue-500 text-white bg-gradient-to-r from-[#3673CA] from-40% to-[#08D2FB]'}
                            ${tema.jenis_pohon === "Operational Pemda" && 'border-green-500 text-white bg-gradient-to-r from-[#139052] from-40% to-[#2DCB06]'}
                        `
    const ReviewTableStyle = `${(tema.jenis_pohon === "Tematik" || tema.jenis_pohon === "Sub Tematik" || tema.jenis_pohon === "Sub Sub Tematik" || tema.jenis_pohon === "Super Tematik") && "border border-black"}
                        ${tema.jenis_pohon === "Strategic Pemda" && "border border-black"}
                        ${tema.jenis_pohon === "Tactical Pemda" && "border border-black"}
                        ${tema.jenis_pohon === "Operational Pemda" && "border border-black"}
                        ${tema.jenis_pohon === "Strategic" && "border-r border-b bg-yellow-100 border-red-700"}
                        ${tema.jenis_pohon === "Tactical" && "border-r border-b bg-yellow-100 border-blue-500"}
                        ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && "border-r border-b bg-yellow-100 border-green-500"}
                        `

    useEffect(() => {
        if (show_all) {
            setShow(true);
        }
        if (!show_all) {
            setShow(false);
        }
    }, [show_all, set_show_all]);

    return (
        <React.Fragment key={tema.id}>
            {Deleted ?
                <React.Fragment></React.Fragment>
                :
                <React.Fragment>
                    <li>
                        <>
                            <div className={CardPohon}>
                                {/* HEADER */}
                                <div className={HeaderPohon}>
                                    <div className="flex flex-wrap items-center justify-center gap-1">
                                        <h1>{tema.jenis_pohon} {tema.id}</h1>
                                        {tema.is_active === false &&
                                            <button className="px-2 bg-red-600 text-white rounded-xl cursor-default">NON-AKTIF</button>
                                        }
                                    </div>
                                </div>
                                {/* BODY */}
                                <div className="flex justify-center my-3">
                                    {Edited ?
                                        <TablePohon item={Edited} />
                                        :
                                        <TablePohon item={tema} />
                                    }
                                </div>
                                {/* REVIEW */}
                                {ShowReview && (
                                    LoadingReview ?
                                        <div className="flex w-full px-2 bg-white justify-center rounded-lg mt-2">
                                            <LoadingClip />
                                        </div>
                                        :
                                        Review.length == 0 ?
                                            <div className="flex mt-2 text-center">
                                                <h1 className='text-center bg-white w-full border border-black rounded-lg p-2'>tidak ada review</h1>
                                            </div>
                                            :
                                            <div className="flex mt-2">
                                                <table className="w-full">
                                                    {Review.map((item: Review) => (
                                                        <tbody key={item.id}>
                                                            <tr>
                                                                <td className={`min-w-[100px] px-2 py-3 text-start rounded-tl-lg ${ReviewTableStyle}`}>
                                                                    review
                                                                </td>
                                                                <td className={`min-w-[300px] px-2 py-3 text-start ${ReviewTableStyle}`}>
                                                                    <div className="flex items-start justify-between gap-1">
                                                                        {item.review}
                                                                    </div>
                                                                </td>
                                                                {/* EDIT REVIEW */}
                                                                <td className={`text-start rounded-tr-lg ${ReviewTableStyle}`}>
                                                                    <div className="flex items-center justify-center gap-1">
                                                                        <ButtonSkyBorder
                                                                        onClick={() => handleEditReview(item.id)}
                                                                        >
                                                                            <TbPencil />
                                                                        </ButtonSkyBorder>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td className={`min-w-[100px] px-2 py-3 text-start rounded-bl-lg ${ReviewTableStyle}`}>
                                                                    Keterangan
                                                                </td>
                                                                <td className={`min-w-[300px] px-2 py-3 text-start flex flex-wrap gap-2 ${ReviewTableStyle}`}>
                                                                    <p>
                                                                        {item.keterangan}
                                                                    </p>
                                                                    <p className="font-bold">
                                                                        {`( ${item.nama_pegawai} )`}
                                                                    </p>
                                                                </td>
                                                                {/* HAPUS REVIEW */}
                                                                <td className={`text-start rounded-br-lg ${ReviewTableStyle}`}>
                                                                    <div className="flex items-center justify-center gap-1"
                                                                        onClick={() => {
                                                                            AlertQuestion("Hapus?", "Hapus Review", "question", "Hapus", "Batal").then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    hapusReview(item.id);
                                                                                }
                                                                            });
                                                                        }}>
                                                                        <ButtonRedBorder><TbTrash /></ButtonRedBorder>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    ))}
                                                </table>
                                            </div>
                                )}

                                {/* BUTTON REVIEW */}
                                <div
                                    className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white border-black hide-on-capture
                                            ${tema.jenis_pohon === "Strategic" && 'border-white'}
                                            ${tema.jenis_pohon === "Tactical" && 'border-white'}
                                            ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-white'}
                                        `}
                                >
                                    <ButtonSkyBorder
                                    onClick={handleNewReview}
                                    >
                                        <TbBookmarkPlus className="mr-1" />
                                        Tambah Review
                                    </ButtonSkyBorder>
                                    <button
                                        className={`px-3 flex justify-center items-center py-1 rounded-lg border border-red-400 text-red-400 hover:bg-red-400 hover:text-white ${tema.jumlah_review > 0 && "bg-yellow-200 animate-pulse"}`}
                                        onClick={() => {
                                            setShowReview((prev) => (!prev));
                                            if (!ShowReview) {
                                                fetchReview(tema.id);
                                            }
                                        }}
                                    >
                                        <TbZoom className="mr-1" />
                                        <p>{ShowReview ? "sembunyikan review" : "tampilkan review"} : {tema.jumlah_review}</p>
                                    </button>
                                    {/* MODAL TAMBAH REVIEW POHON */}
                                    <ModalReview
                                        jenis={'tambah'}
                                        pokin="pemda"
                                        isOpen={IsNewReview}
                                        onClose={() => {
                                            setIsNewReview(false);
                                            setIdReview(null);
                                        }}
                                        idPohon={tema.id}
                                        onSuccess={() => {
                                            fetchReview(tema.id);
                                            setShowReview(true);
                                        }}
                                    />
                                    {/* MODAL EDIT REVIEW POHON */}
                                    {/* <ModalReview
                                        jenis={'lama'}
                                        pokin="pemda"
                                        id={idReview}
                                        isOpen={IsEditReview}
                                        onClose={() => setIsEditReview(false)}
                                        idPohon={tema.id}
                                        onSuccess={() => {
                                            fetchReview(tema.id);
                                            setShowReview(true);
                                        }}
                                    /> */}
                                </div>
                                {/* BUTTON ACTION INSIDE BOX */}
                                {user != 'reviewer' &&
                                    <div
                                        className={`flex justify-evenly border my-3 py-3 rounded-lg bg-white border-black hide-on-capture
                                                ${tema.jenis_pohon === "Strategic" && 'border-white'}
                                                ${tema.jenis_pohon === "Tactical" && 'border-white'}
                                                ${(tema.jenis_pohon === "Operational" || tema.jenis_pohon === "Operational N") && 'border-white'}
                                            `}
                                    >
                                        <React.Fragment>
                                            {!['Strategic', 'Tactical', 'Operational', 'Operational N'].includes(tema.jenis_pohon) &&
                                                <ButtonSkyBorder onClick={() => setEdit(true)}>
                                                    <TbPencil className="mr-1" />
                                                    Edit
                                                </ButtonSkyBorder>
                                            }
                                            {tema.level_pohon !== 0 &&
                                                <ButtonSky
                                                    className='flex items-center gap-1'
                                                // onClick={() => setIsCetak(true)}
                                                >
                                                    <TbPrinter />
                                                    Cetak
                                                </ButtonSky>
                                            }
                                            {tema.jenis_pohon === 'Tematik' &&
                                                <>
                                                    <button
                                                        className={`border px-3 py-1 rounded-lg flex jutify-center items-center gap-1
                                                        ${tema.is_active === false ?
                                                                'border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
                                                                :
                                                                'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                                                            }    
                                                    `}
                                                        onClick={() => {
                                                            AlertQuestion(`${tema.is_active === true ? 'NON AKTIFKAN' : 'AKTIFKAN'}`, `${tema.is_active === false ? 'Aktifkan tematik?' : 'non aktifkan tematik'}`, "question", `${tema.is_active === false ? 'Aktifkan' : 'Non Aktifkan'}`, "Batal").then((result) => {
                                                                if (result.isConfirmed) {
                                                                    // AktifasiTematik(tema.id, tema.is_active);
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        {tema.is_active === false ? <TbCheck /> : <TbX />}
                                                        {tema.is_active === false ? 'Aktifkan tematik' : 'Non Aktifkan tematik'}
                                                    </button>
                                                    <ButtonBlack
                                                        className='flex justify-center items-center gap-1'
                                                        onClick={() => setIsClone(true)}
                                                    >
                                                        <TbCopy />
                                                        Clone
                                                    </ButtonBlack>
                                                    {/* <ModalClone
                                                        jenis="pemda"
                                                        isOpen={IsClone}
                                                        onClose={() => setIsClone(false)}
                                                        nama_pohon={tema.tema}
                                                        tahun={tahun || "0"}
                                                        id={tema.id}
                                                        kode_opd=''
                                                        onSuccess={deleteTrigger}
                                                    /> */}
                                                </>
                                            }
                                        </React.Fragment>
                                        {tema.jenis_pohon !== 'Tematik' &&
                                            <ButtonRedBorder
                                                onClick={() => {
                                                    AlertQuestion("Hapus?", "DATA POHON yang terkait kebawah jika ada akan terhapus juga", "question", "Hapus", "Batal").then((result) => {
                                                        if (result.isConfirmed) {
                                                            if (tema.jenis_pohon === 'Tematik' || 'SubTematik' || 'SubSubTematik' || 'SuperSubTematik') {
                                                                // hapusSubTematik(tema.id);
                                                            } else {
                                                                // hapusPohonOpd(tema.id);
                                                            }
                                                        }
                                                    });
                                                }}
                                            >
                                                <TbTrash className='mr-1' />
                                                Hapus
                                            </ButtonRedBorder>
                                        }
                                    </div>
                                }
                                {/* TOMBOL ADD POHON */}
                                {(
                                    tema.jenis_pohon !== 'Operational Pemda' &&
                                    tema.jenis_pohon !== 'Operational' &&
                                    tema.jenis_pohon !== 'Operational N'
                                ) &&
                                    <div className="flex flex-wrap gap-3 justify-evenly my-3 py-3 hide-on-capture">
                                        <ButtonBlackBorder
                                            className={`px-3 bg-white flex justify-center items-center py-1 bg-linear-to-r rounded-lg`}
                                            onClick={handleShow}
                                        >
                                            <TbEye className='mr-1' />
                                            {Show ? 'Sembunyikan' : 'Tampilkan'}
                                        </ButtonBlackBorder>
                                        {(Show && user != 'reviewer') &&
                                            <>
                                                {/* TOMBOL ADD POHON SESUAI URUTAN AKARNYA */}
                                                {tema.level_pohon !== 3 &&
                                                    <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 rounded-lg
                                                ${(tema.jenis_pohon === 'Strategic' || tema.jenis_pohon === 'Strategic Pemda') && 'border-[#3b82f6] hover:bg-[#3b82f6] text-[#3b82f6] hover:text-white'}    
                                            `}
                                                        onClick={newChild}
                                                    >
                                                        <TbCirclePlus className='mr-1' />
                                                        {tambahPohonName(tema.jenis_pohon)}
                                                    </ButtonGreenBorder>
                                                }
                                                {/* AMBIL POHON MULAI DARI STRATEGIC DARI OPD */}
                                                <ButtonGreenBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-linear-to-r border-2 border-[#00A607] hover:bg-[#00A607] text-[#00A607] hover:text-white rounded-lg`}
                                                    onClick={newPutChild}
                                                >
                                                    <TbArrowGuide className='mr-1' />
                                                    {"(Ambil)"} {ambilPohonName(tema.jenis_pohon)}
                                                </ButtonGreenBorder>
                                                {/* TOMBOL ADD KHUSUS STRATEGIC KOTA  */}
                                                {(tema.level_pohon === 0 || tema.level_pohon === 1 || tema.level_pohon === 2 || tema.level_pohon === 3) &&
                                                    <ButtonRedBorder className={`px-3 bg-white flex justify-center items-center py-1 bg-linear-to-r border-2 rounded-lg`}
                                                        onClick={newStrategic}
                                                    >
                                                        <TbCirclePlus className='mr-1' />
                                                        Strategic
                                                    </ButtonRedBorder>
                                                }
                                            </>
                                        }
                                    </div>
                                }
                            </div>
                        </>
                        <ul style={{ display: Show ? '' : 'none' }}>
                            {childPohons.map((dahan: any, index: any) => (
                                <React.Fragment key={index}>
                                    <Pohon
                                        user={user}
                                        tema={dahan}
                                        key={index}
                                        deleteTrigger={deleteTrigger}
                                        show_all={show_all}
                                        set_show_all={set_show_all}
                                    />
                                </React.Fragment>
                            ))}
                            {strategicPohons.map((dahan: any, index: any) => (
                                <React.Fragment key={index}>
                                    <Pohon
                                        user={user}
                                        tema={dahan}
                                        key={index}
                                        deleteTrigger={deleteTrigger}
                                        show_all={show_all}
                                        set_show_all={set_show_all}
                                    />
                                </React.Fragment>
                            ))}
                            {/* FORM POHON */}
                            {formList.map((formId: number) => (
                                <React.Fragment key={formId}>
                                    {/* <FormPohonPemda
                                        level={tema.level_pohon}
                                        id={tema.id}
                                        key={formId}
                                        formId={formId}
                                        pokin={'pemda'}
                                        onCancel={() => setFormList(formList.filter((id) => id !== formId))}
                                    /> */}
                                </React.Fragment>
                            ))}
                            {/* FORM STRATEGIC */}
                            {FormStrategic.map((formIdStrategic: number) => (
                                <React.Fragment key={formIdStrategic}>
                                    {/* <FormPohonPemda
                                        level={3}
                                        id={tema.id}
                                        key={formIdStrategic}
                                        formId={formIdStrategic}
                                        pokin={'pemda'}
                                        onCancel={() => setFormStrategic(FormStrategic.filter((id) => id !== formIdStrategic))}
                                    /> */}
                                </React.Fragment>
                            ))}
                            {PutList.map((formId: number) => (
                                <React.Fragment key={formId}>
                                    {/* <FormAmbilPohon
                                        level={tema.level_pohon}
                                        id={tema.id}
                                        key={formId}
                                        formId={formId}
                                        onCancel={() => setPutList(PutList.filter((id) => id !== formId))}
                                    /> */}
                                </React.Fragment>
                            ))}
                        </ul>
                    </li>
                </React.Fragment>
            }
        </React.Fragment>
    )
}

export const TablePohon = (props: any) => {
    const tema = props.item.tema;
    const tagging = props.item.tagging;
    const nama_pohon = props.item.nama_pohon;
    const keterangan = props.item.keterangan;
    const opd = props.item.perangkat_daerah?.nama_opd;
    const jenis = props.item.jenis_pohon;
    const indikator = props.item.indikator;
    const status = props.item.status;

    // STYLE TABLE
    const TableStyle = `border px-2 py-3 bg-white text-start rounded-tl-lg
                        ${jenis === "Tematik" && "border-black"}
                        ${jenis === "Sub Tematik" && "border-black"}
                        ${jenis === "Sub Sub Tematik" && "border-black"}
                        ${jenis === "Super Sub Tematik" && "border-black"}
                        ${jenis === "Strategic Pemda" && "border-black"}
                        ${jenis === "Tactical Pemda" && "border-black"}
                        ${jenis === "Operational Pemda" && "border-black"}
                        ${jenis === "Strategic" && "border-red-700"}
                        ${jenis === "Tactical" && "border-blue-500"}
                        ${(jenis === "Operational" || jenis === "Operational N") && "border-green-500"}
                    `

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
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            {tg?.keterangan_tagging_program?.map((tp: KeteranganTagging, tp_index: number) => (
                                <h1 key={tp_index} className="py-1 px-3 text-white text-start bg-yellow-500 rounded-lg">
                                    {tg.keterangan_tagging_program.length > 1 && `${tp_index + 1}.`} {tp.keterangan_tagging_program || ""}
                                </h1>
                            ))}
                        </div>
                    </div>
                ))
            }
            <table className='w-full'>
                <tbody>
                    <tr>
                        <td className={`min-w-[100px] ${TableStyle}`}>
                            {(jenis === 'Tematik' || jenis === 'Sub Tematik' || jenis === 'Sub Sub Tematik' || jenis === 'Super Sub Tematik') && 'Tema'}
                            {(jenis === 'Strategic' || jenis === 'Strategic Pemda') && 'Strategic'}
                            {(jenis === 'Tactical' || jenis === 'Tactical Pemda') && 'Tactical'}
                            {(jenis === 'Operational' || jenis === 'Operational Pemda') && 'Operational'}
                            {jenis === 'Operational N' && 'Operational N'}
                        </td>
                        <td
                            className={`min-w-[300px] ${TableStyle}`}
                        >
                            {tema ? tema : nama_pohon ? nama_pohon : "-"}
                        </td>
                    </tr>
                    {indikator ?
                        indikator.map((data: any, index: number) => (
                            <React.Fragment key={data.id_indikator}>
                                <tr>
                                    <td className={`min-w-[100px] ${TableStyle}`}>
                                        {indikator.length > 1 ?
                                            <p>Indikator {index + 1}</p>
                                            :
                                            <p>Indikator</p>
                                        }
                                    </td>
                                    <td className={`min-w-[300px] ${TableStyle}`}>
                                        {data.nama_indikator ? data.nama_indikator : "-"}
                                    </td>
                                </tr>
                                {data.targets ?
                                    data.targets.map((data: any) => (
                                        <tr key={data.id_target}>
                                            <td className={`min-w-[100px] ${TableStyle}`}>
                                                {indikator.length > 1 ?
                                                    <p>Target/Satuan {index + 1}</p>
                                                    :
                                                    <p>Target/Satuan</p>
                                                }
                                            </td>
                                            <td className={`min-w-[300px] ${TableStyle}`}>
                                                {data.target ? data.target : "-"} / {data.satuan ? data.satuan : "-"}
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td className={`min-w-[100px] ${TableStyle}`}>
                                            -
                                        </td>
                                        <td className={`min-w-[300px] ${TableStyle}`}>
                                            -
                                        </td>
                                    </tr>
                                }
                            </React.Fragment>
                        ))
                        :
                        <>
                            <tr>
                                <td className={`min-w-[100px] ${TableStyle}`}  >
                                    Indikator
                                </td>
                                <td className={`min-w-[300px] ${TableStyle}`}>
                                    -
                                </td>
                            </tr>
                            <tr>
                                <td className={`min-w-[100px] ${TableStyle}    `}  >
                                    Target/Satuan
                                </td>
                                <td className={`min-w-[300px] ${TableStyle}    `}>
                                    -
                                </td>
                            </tr>
                        </>
                    }
                    {opd &&
                        <tr>
                            <td className={`min-w-[100px] ${TableStyle}`}>
                                Perangkat Daerah
                            </td>
                            <td className={`min-w-[300px] ${TableStyle}`}>
                                {opd ? opd : "-"}
                            </td>
                        </tr>
                    }
                    <tr>
                        <td className={`min-w-[100px] rounded-bl-lg ${TableStyle}`}>
                            Keterangan
                        </td>
                        <td className={`min-w-[300px] rounded-br-lg ${TableStyle}`}>
                            {keterangan ? keterangan : "-"}
                        </td>
                    </tr>
                    {status &&
                        <tr>
                            <td className={`min-w-[100px] rounded-bl-lg ${TableStyle}`}>
                                Status
                            </td>
                            <td className={`min-w-[300px] border px-2 py-3 bg-white text-start rounded-br-lg ${TableStyle}`}>
                                {status === 'menunggu_disetujui' ? (
                                    <div className="flex items-center">
                                        {status || "-"}
                                        <TbHourglass />
                                    </div>
                                ) : status === 'disetujui' ? (
                                    <div className="flex items-center text-green-500">
                                        {status || "-"}
                                        <TbCheck />
                                    </div>
                                ) : status === 'ditolak' ? (
                                    <div className="flex items-center text-red-500">
                                        {status || "-"}
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

export const tambahPohonName = (jenis: string): string => {
    switch (jenis) {
        case 'Tematik':
            return 'Sub Tematik';
        case 'Sub Tematik':
            return 'Sub Sub Tematik';
        case 'Sub Sub Tematik':
            return 'Super Sub Tematik';
        case 'Super Sub Tematik':
            return 'Strategic';
        case 'Strategic Pemda':
            return 'Tactical';;
        case 'Tactical Pemda':
            return 'Operational';
        case 'Strategic':
            return 'Tactical';;
        case 'Tactical':
            return 'Operational';
        default:
            return '-'
    }
}
export const ambilPohonName = (jenis: string): string => {
    switch (jenis) {
        case 'Tematik':
            return 'Strategic';
        case 'Sub Tematik':
            return 'Strategic';
        case 'Sub Sub Tematik':
            return 'Strategic';
        case 'Super Sub Tematik':
            return 'Strategic';
        case 'Strategic':
            return 'Tactical';
        case 'Tactical':
            return 'Operational';
        case 'Strategic Pemda':
            return 'Tactical';
        case 'Tactical Pemda':
            return 'Operational';
        default:
            return '-'
    }
}