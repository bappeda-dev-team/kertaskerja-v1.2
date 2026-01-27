export function formatRupiah(angka: number) {
    if (typeof angka !== 'number') {
        return String(angka); // Jika bukan angka, kembalikan sebagai string
    }
    return angka.toLocaleString('id-ID'); // 'id-ID' untuk format Indonesia
}