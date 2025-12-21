// src/app/events/[id]/edit/page.tsx
import { auth } from "@/auth";
import EventForm from "@/components/EventForm";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  // 1. Etkinliği Çek
  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  // 2. GÜVENLİK KONTROLÜ
  // Etkinliğin sahibi ben miyim? Veya Admin miyim?
  const isOwner = event.userId === session?.user?.id;
  const isAdmin = session?.user?.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        Bu etkinliği düzenleme yetkiniz yok! ⛔
      </div>
    );
  }

  // 3. Kategorileri de çek (Dropdown için lazım)
  const categories = await prisma.category.findMany();

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Etkinliği Düzenle ✏️
        </h1>
        
        {/* Formu "initialData" ile doldurarak çağırıyoruz */}
        <EventForm categories={categories} initialData={event} />
      </div>
    </div>
  );
}