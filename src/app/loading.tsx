// src/app/loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        {/* Dönen Çember */}
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
        <p className="text-green-800 font-medium animate-pulse">Yükleniyor...</p>
      </div>
    </div>
  );
}