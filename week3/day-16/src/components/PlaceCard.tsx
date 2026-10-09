import { memo } from "react";
import { ArrowUpRight, Bookmark, MapPin, Star } from "lucide-react";
import type { Place } from "../data/places";

type PlaceCardProps = {
  place: Place;
  saved: boolean;
  onSelect: (place: Place) => void;
  onToggleSaved: (id: number) => void;
};

function PlaceCardComponent({
  place,
  saved,
  onSelect,
  onToggleSaved,
}: PlaceCardProps) {
  return (
    <article className="group min-w-0">
      <div className="relative overflow-hidden rounded-sm bg-[#e7e2d7]">
        <button
          type="button"
          onClick={() => onSelect(place)}
          className="block w-full text-left"
          aria-label={`Explore ${place.name}`}
        >
          <img
            src={place.image}
            alt={place.name}
            loading="lazy"
            className="aspect-[4/4.7] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        </button>

        <span className="absolute left-3 top-3 bg-[#f8f6f0] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#41483b]">
          {place.category}
        </span>

        <button
          type="button"
          onClick={() => onToggleSaved(place.id)}
          aria-label={
            saved
              ? `Remove ${place.name} from saved places`
              : `Save ${place.name}`
          }
          aria-pressed={saved}
          className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full transition ${
            saved
              ? "bg-[#424a38] text-white"
              : "bg-[#f8f6f0] text-[#30352d] hover:bg-white"
          }`}
        >
          <Bookmark
            size={16}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="flex items-start justify-between gap-3 pt-3">
        <button
          type="button"
          onClick={() => onSelect(place)}
          className="min-w-0 text-left"
        >
          <h3 className="font-serif text-xl leading-tight text-[#30352d] transition group-hover:text-[#7a805c] dark:text-[#eee9de]">
            {place.name}
          </h3>

          <p className="mt-2 flex items-center gap-1.5 text-xs text-[#7c7b70] dark:text-[#b1afa4]">
            <MapPin size={12} />
            {place.location}
          </p>
        </button>

        <span className="flex shrink-0 items-center gap-1 pt-1 text-xs text-[#555a47] dark:text-[#e4c982]">
          <Star size={12} fill="currentColor" />
          {place.rating.toFixed(1)}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#e3dfd4] pt-3 dark:border-[#3c4037]">
        <span className="text-xs text-[#77766b] dark:text-[#b1afa4]">
          {place.price}
        </span>

        <button
          type="button"
          onClick={() => onSelect(place)}
          className="flex items-center gap-1 text-xs font-semibold text-[#424a38] transition hover:gap-2 dark:text-[#d9d4bd]"
        >
          Explore <ArrowUpRight size={14} />
        </button>
      </div>
    </article>
  );
}

const PlaceCard = memo(PlaceCardComponent);

export default PlaceCard;