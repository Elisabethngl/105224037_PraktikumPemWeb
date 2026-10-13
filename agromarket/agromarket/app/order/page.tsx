'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '../../data/mockData';
import { OrderFormData, FormErrors } from '../../types/product';
import { InputField } from '../../components/InputField';
import { Button } from '../../components/Button';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

function OrderContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');
  const initialProductId = idParam ? parseInt(idParam) : 1;

  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    productId: initialProductId,
    quantity: 1,
    notes: '',
    paymentMethod: 'Transfer Bank (BCA/BRI)',
    agreedSOP: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<OrderFormData | null>(null);

  const activeProduct = MOCK_PRODUCTS.find((p) => p.id === Number(formData.productId)) || MOCK_PRODUCTS[0];
  const totalPrice = activeProduct ? activeProduct.price * formData.quantity : 0;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { id, name, value, type } = e.target;
    const fieldName = (name || id) as keyof OrderFormData;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [fieldName]: checked }));
    } else if (fieldName === 'productId' || fieldName === 'quantity') {
      setFormData((prev) => ({ ...prev, [fieldName]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));
    }

    if (errors[fieldName as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [fieldName]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nama lengkap wajib diisi.';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama minimal terdiri dari 3 karakter.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Alamat email wajib diisi.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Format email tidak valid (contoh: petani@mail.com).';
    }

    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Nomor WhatsApp / telepon wajib diisi.';
    } else if (!phoneRegex.test(formData.phone.trim().replace(/\s+/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid (contoh: 081234567890).';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Alamat pengiriman wajib diisi lengkap.';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Harap sertakan nama jalan, RT/RW, desa/kecamatan, dan kota (minimal 10 karakter).';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Jumlah pesanan minimal 1 unit.';
    } else if (activeProduct && formData.quantity > activeProduct.stock) {
      newErrors.quantity = `Jumlah melebihi stok yang tersedia (${activeProduct.stock} ${activeProduct.unit}).`;
    }

    if (!formData.agreedSOP) {
      newErrors.agreedSOP = 'Anda wajib menyetujui SOP kepatuhan penggunaan obat dan pupuk pertanian.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmittedData({ ...formData });
      setIsSuccess(true);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
      </Link>

      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl overflow-hidden p-6 sm:p-10">
        
        {isSuccess && submittedData ? (
          <div className="text-center py-8 space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Pesanan Berhasil Diverifikasi!
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Terima kasih, <strong>{submittedData.fullName}</strong>. Data pemesanan sarana produksi pertanian Anda telah tervalidasi dan siap diproses ke logistik.
            </p>

            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Produk:</span>
                <span className="font-bold text-gray-800">{activeProduct?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Jumlah:</span>
                <span className="font-bold text-gray-800">{submittedData.quantity} {activeProduct?.unit}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Metode Pembayaran:</span>
                <span className="font-bold text-gray-800">{submittedData.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">No. WhatsApp:</span>
                <span className="font-bold text-gray-800">{submittedData.phone}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-extrabold text-emerald-900">
                <span>Total Tagihan:</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <Button
                variant="primary"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    address: '',
                    productId: MOCK_PRODUCTS[0]?.id || 1,
                    quantity: 1,
                    notes: '',
                    paymentMethod: 'Transfer Bank (BCA/BRI)',
                    agreedSOP: false,
                  });
                }}
              >
                Buat Pesanan Baru
              </Button>
              <Link href="/">
                <Button variant="outline">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Transaksi Sarana Pertanian
              </span>
              <h1 className="text-2xl font-extrabold text-gray-900 mt-1">
                Formulir Pemesanan & Verifikasi Pelanggan
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Lengkapi formulir di bawah ini dengan data asli untuk pemesanan pupuk dan obat racun pertanian berizin resmi.
              </p>
            </div>

            {/* Bagian 1: Produk & Jumlah */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-4">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                1. Pilih Produk yang Ingin Dipesan
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label htmlFor="productId" className="block text-xs font-bold text-gray-700">
                    Produk Pertanian <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="productId"
                    name="productId"
                    value={formData.productId}
                    onChange={handleChange}
                    className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  >
                    {MOCK_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - Rp {p.price.toLocaleString('id-ID')} / {p.unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <InputField
                    label="Jumlah Pesanan"
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    max={activeProduct?.stock || 100}
                    value={formData.quantity}
                    onChange={handleChange}
                    error={errors.quantity}
                    required
                  />
                </div>
              </div>

              {activeProduct && (
                <div className="bg-white p-3.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-gray-700 block">{activeProduct.name}</span>
                    <span className="text-gray-500 text-[11px]">
                      Stok tersedia: {activeProduct.stock} {activeProduct.unit}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block">Total Pembayaran</span>
                    <span className="text-base font-extrabold text-emerald-800">
                      Rp {totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Bagian 2: Data Pemesan */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                2. Data Pemesan & Pengiriman
              </h3>

              <InputField
                label="Nama Lengkap Pemesan"
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Contoh: Budi Santoso"
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
                helperText="Masukkan nama sesuai KTP untuk verifikasi penerimaan barang."
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Alamat Email"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="petani@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <InputField
                  label="Nomor WhatsApp / HP"
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="0812xxxxxxxx"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  helperText="Format nomor Indonesia diawali 08..."
                  required
                />
              </div>

              <InputField
                label="Alamat Lengkap Pengiriman"
                id="address"
                name="address"
                placeholder="Jl. Raya Pertanian No. 45, RT 02/05, Desa Sukamaju, Kec. Lembang, Kab. Bandung Barat"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
                isTextArea
                required
              />

              <InputField
                label="Catatan Tambahan untuk Petugas / Kurir (Opsional)"
                id="notes"
                name="notes"
                placeholder="Titipkan di pos kamling jika rumah sedang kosong"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {/* Bagian 3: Pembayaran */}
            <div className="space-y-2">
              <label htmlFor="paymentMethod" className="block text-xs font-bold text-gray-700">
                Pilih Metode Pembayaran <span className="text-red-500">*</span>
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full text-xs p-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Transfer Bank (BCA/BRI)">Transfer Bank (BCA / BRI Virtual Account)</option>
                <option value="COD (Bayar di Tempat)">COD (Bayar Tunai di Tempat)</option>
                <option value="E-Wallet (QRIS)">E-Wallet (QRIS / GoPay / OVO)</option>
              </select>
            </div>

            {/* Bagian 4: SOP Pestisida */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agreedSOP"
                  name="agreedSOP"
                  checked={formData.agreedSOP}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 cursor-pointer"
                  aria-invalid={!!errors.agreedSOP}
                />
                <label htmlFor="agreedSOP" className="text-xs text-amber-950 cursor-pointer leading-relaxed">
                  <strong>Pernyataan Kepatuhan SOP Pertanian:</strong> Saya menyatakan bahwa pupuk dan obat racun hama ini digunakan untuk keperluan budidaya pertanian secara bijak, sesuai takaran dosis anjuran, dan menggunakan alat pelindung diri (APD).
                </label>
              </div>
              {errors.agreedSOP && (
                <p className="text-xs font-bold text-red-600 ml-7" role="alert">
                  ⚠️ {errors.agreedSOP}
                </p>
              )}
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="lg" className="w-full py-4 text-base">
                Verifikasi & Konfirmasi Pesanan Sekarang
              </Button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Memuat formulir...</div>}>
      <OrderContent />
    </Suspense>
  );
}