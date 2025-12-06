// src/app/page.tsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-24">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-green-800 mb-6">
          Tarım & Ziraat Etkinlik Platformu
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Şehrinizdeki tarım etkinliklerini keşfedin, üreticilerle buluşun ve bilgi paylaşımına katılın.
        </p>
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-gray-500">
            👈 Yukarıdaki menüyü kullanarak <strong>Giriş</strong> yapabilir veya <strong>Etkinliklere</strong> göz atabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}