import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { User } from "../types/user";

type UserCardProps = {
  user: User;
  onSelect: (user: User) => void;
};

const avatarStyles = [
  "bg-[#dce8d9] text-[#426047]",
  "bg-[#f3dfd3] text-[#945b42]",
  "bg-[#e3def1] text-[#65528a]",
  "bg-[#dce7f1] text-[#3e6584]",
  "bg-[#f0e6c9] text-[#8a7135]",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function UserCard({
  user,
  onSelect,
}: UserCardProps) {
  const avatarStyle = avatarStyles[(user.id - 1) % avatarStyles.length];

  return (
    <button
      type="button"
      onClick={() => onSelect(user)}
      className="group w-full border border-[#e9e8e1] bg-white p-5 text-left transition duration-200 hover:-translate-y-1 hover:border-[#bdc9b5] hover:shadow-[0_12px_32px_rgba(40,50,35,0.07)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#607752]"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-semibold ${avatarStyle}`}
        >
          {getInitials(user.name)}
        </div>

        <span className="grid size-8 place-items-center rounded-full text-[#858b7c] transition group-hover:bg-[#edf1e9] group-hover:text-[#40573a]">
          <ArrowUpRight size={17} />
        </span>
      </div>

      <div className="mt-5">
        <h3 className="truncate font-semibold text-[#283128]">
          {user.name}
        </h3>

        <p className="mt-1 text-xs text-[#8a8f83]">
          @{user.username}
        </p>
      </div>

      <div className="mt-5 space-y-3 border-t border-[#efeee8] pt-4">
        <p className="flex min-w-0 items-center gap-2 text-xs text-[#686f63]">
          <Mail size={14} className="shrink-0 text-[#92998a]" />
          <span className="truncate">{user.email}</span>
        </p>

        <p className="flex items-center gap-2 text-xs text-[#686f63]">
          <MapPin size={14} className="shrink-0 text-[#92998a]" />
          <span className="truncate">{user.address.city}</span>
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-2">
        <span className="max-w-[80%] truncate rounded-full bg-[#f2f4ee] px-3 py-1.5 text-[10px] font-medium text-[#5c6b52]">
          {user.company.name}
        </span>

        <span className="text-[10px] text-[#9b9e94]">
          ID {String(user.id).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}