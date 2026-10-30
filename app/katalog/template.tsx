import KolomCatatan from "@/components/KolomCatatan";

// Template menerima key unik per segmen anak, sehingga
// isinya dipasang ulang (remount) setiap kali rute anak berganti.
export default function TemplateKatalog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <KolomCatatan label="Catatan di template" />
      {children}
    </div>
  );
}
