import {
  ArrowUpRight,
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import type { User } from "../types/user";

type UserDetailsProps = {
  user: User | null;
  onClose: () => void;
};

export default function UserDetails({
  user,
  onClose,
}: UserDetailsProps) {
  if (!user) {
    return (
      <aside className="border border-dashed border-[#dcded5] bg-[#fafbf8] p-7">
        <div className="grid size-12 place-items-center rounded-2xl bg-[#edf1e8] text-[#607752]">
          <Building2 size={22} />
        </div>

        <h3 className="mt-5 font-serif text-2xl text-[#303a2d]">
          Get to know your team.
        </h3>

        <p className="mt-3 text-sm leading-7 text-[#858b7c]">
          Select a person from the directory to explore their
          contact details, company, and profile information.
        </p>

        <div className="mt-6 border-t border-[#e9eae3] pt-4 text-xs text-[#969b90]">
          PEOPLE ATLAS · PROFILE PREVIEW
        </div>
      </aside>
    );
  }

  return (
    <aside className="border border-[#e9e8e1] bg-white">
      <div className="flex items-center justify-between border-b border-[#efeee8] px-5 py-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#818879]">
          Profile details
        </span>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close profile"
          className="grid size-8 place-items-center rounded-full text-[#818879] transition hover:bg-[#f0f2ec] hover:text-[#303a2d]"
        >
          <X size={17} />
        </button>
      </div>

      <div className="p-5">
        <div className="grid size-16 place-items-center rounded-2xl bg-[#dce8d9] text-xl font-semibold text-[#426047]">
          {user.name
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase()}
        </div>

        <h2 className="mt-5 font-serif text-3xl leading-tight text-[#283128]">
          {user.name}
        </h2>

        <p className="mt-2 text-sm text-[#858b7c]">
          @{user.username}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 bg-[#edf1e9] px-3 py-2 text-xs font-medium text-[#53694a]">
          <Building2 size={14} />
          {user.company.name}
        </div>

        <p className="mt-5 border-l-2 border-[#a8b99a] pl-4 font-serif text-lg italic leading-7 text-[#687360]">
          “{user.company.catchPhrase}”
        </p>

        <div className="mt-6 space-y-5 border-t border-[#efeee8] pt-5">
          <DetailRow
            icon={<Mail size={16} />}
            label="Email"
            value={user.email}
          />

          <DetailRow
            icon={<Phone size={16} />}
            label="Phone"
            value={user.phone}
          />

          <DetailRow
            icon={<MapPin size={16} />}
            label="Location"
            value={`${user.address.city}, ${user.address.zipcode}`}
          />

          <DetailRow
            icon={<Globe size={16} />}
            label="Website"
            value={user.website}
          />

          <DetailRow
            icon={<Building2 size={16} />}
            label="Business focus"
            value={user.company.bs}
          />
        </div>

        <a
          href={`https://${user.website.replace(/^https?:\/\//, "")}`}
          target="_blank"
          rel="noreferrer"
          className="mt-7 flex items-center justify-center gap-2 bg-[#354b31] px-4 py-3 text-xs font-semibold text-white transition hover:bg-[#496443]"
        >
          Visit website <ArrowUpRight size={15} />
        </a>

        <p className="mt-4 text-[10px] leading-5 text-[#a0a397]">
          Sample profile data from JSONPlaceholder. Contact details
          and websites are illustrative.
        </p>
      </div>
    </aside>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span className="mt-0.5 text-[#92998a]">{icon}</span>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#969b90]">
          {label}
        </p>

        <p className="mt-1 break-words text-xs leading-5 text-[#434b3f]">
          {value}
        </p>
      </div>
    </div>
  );
}