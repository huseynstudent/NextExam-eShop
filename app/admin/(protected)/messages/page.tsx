import { prisma } from "@/lib/prisma";
import { toggleMessageRead, deleteMessage } from "@/app/admin/actions";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-xl font-semibold text-white">Messages</h1>
      <p className="mt-1 text-sm text-slate-400">
        Submissions from the storefront&apos;s /contact form.
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl border p-5 ${
              m.read
                ? "border-slate-800 bg-slate-900"
                : "border-[#64FFDA]/40 bg-slate-900"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white">
                  {m.name}{" "}
                  <span className="text-slate-500">— {m.email}</span>
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {m.createdAt.toLocaleString()}
                </p>
              </div>
              {!m.read && (
                <span className="rounded-full bg-[#64FFDA]/10 px-2 py-1 text-xs text-[#64FFDA]">
                  New
                </span>
              )}
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">
              {m.message}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <form action={toggleMessageRead.bind(null, m.id, !m.read)}>
                <button
                  type="submit"
                  className="text-xs text-slate-400 underline underline-offset-4 hover:text-white"
                >
                  {m.read ? "Mark as unread" : "Mark as read"}
                </button>
              </form>
              <form action={deleteMessage.bind(null, m.id)}>
                <button
                  type="submit"
                  className="text-xs text-red-500 underline underline-offset-4 hover:text-red-400"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-6 text-center text-sm text-slate-500">
            No messages yet.
          </p>
        )}
      </div>
    </div>
  );
}
