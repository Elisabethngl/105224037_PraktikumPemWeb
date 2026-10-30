import KolomCatatan from "@/components/KolomCatatan";

export default function LayoutKatalog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl p-4 lg:grid lg:grid-cols-[16rem_1fr] lg:gap-8">
      <aside aria-label="Panel katalog" className="mb-6 space-y-3">
        <p className="font-semibold">Panel Katalog</p>
        <KolomCatatan label="Catatan di layout" />
      </aside>
      <div>{children}</div>
    </div>
  );
}
