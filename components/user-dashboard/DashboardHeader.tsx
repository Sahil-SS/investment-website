"use client";

interface SidebarProps {
  user: { name: string };
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white p-5 shadow-md flex flex-col">
      <div className="mb-10">
        <h2 className="font-bold text-lg">Welcome, {user.name}</h2>
      </div>
      <nav className="flex flex-col gap-3">
        <button className="py-2 px-4 bg-blue-500 text-white rounded" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </aside>
  );
}
