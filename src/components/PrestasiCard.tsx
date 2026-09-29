import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  Trophy,
} from "lucide-react";

import type { Prestasi } from "../data/prestasi";

type PrestasiCardProps = {
  item: Prestasi;
};

export default function PrestasiCard({
  item,
}: PrestasiCardProps) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-neutral-200 bg-white transition duration-500 hover:-translate-y-1 hover:shadow-2xl">
      {/* IMAGE */}
      <Link
        to={`/prestasi/${item.id}`}
        className="block"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-neutral-200">
              <Trophy
                size={48}
                className="text-neutral-400"
              />
            </div>
          )}

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* LEVEL */}
          <div className="absolute left-4 top-4">
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-neutral-900 backdrop-blur">
              {item.level}
            </span>
          </div>

          {/* YEAR */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-medium text-white">
            <CalendarDays size={15} />
            {item.year}
          </div>

          {/* ARROW */}
          <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition duration-300 group-hover:rotate-45">
            <ArrowUpRight size={18} />
          </div>
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-neutral-400">
            {item.category}
          </span>

          <span className="text-xs text-neutral-400">
            {item.date}
          </span>
        </div>

        <Link
          to={`/prestasi/${item.id}`}
          className="block"
        >
          <h3 className="text-lg font-bold leading-tight text-neutral-950 transition group-hover:text-neutral-600">
            {item.title}
          </h3>
        </Link>

        <p className="mt-3 text-sm leading-6 text-neutral-500">
          {item.description}
        </p>

        <div className="mt-5 border-t border-neutral-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Penerima
          </p>

          <p className="mt-1 text-sm font-medium text-neutral-800">
            {item.recipient}
          </p>
        </div>
      </div>
    </article>
  );
}