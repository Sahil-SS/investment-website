import { User } from "@supabase/supabase-js";

interface SidebarProps {
  user: User;
  onLogout: () => void; // Add this
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  return (
    <aside className="w-64 bg-gray-900 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold">{user.user_metadata?.name}</h2>
        <p className="text-sm font-semibold">{user.user_metadata?.username}</p>
      </div>

      <button
        onClick={onLogout} // use it here
        className="mt-auto bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
