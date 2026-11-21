import { nombreEnCarta } from "../lib/menuLabels";
import { Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { BreakfastCustomizationModal } from "./BreakfastCustomizationModal";
import { resolveDeliveryPrice, useLiveMenuCategories } from "../lib/liveProducts";
import { MobileCategoryFilter } from "./MobileCategoryFilter";

/* ─── Paleta de Lujo (Eucalipto & Crema) ─── */
const R = {
  rojo: "#8B261D",
  verde: "var(--color-eucalipto)",
  morado: "var(--color-nogal)",
  eucalipto: "var(--color-eucalipto)",
  amarillo: "var(--color-eucalipto)",
  crema: "#FBF5E6",
  blanco: "#FFFFFF",
  textoBoton: "#FBF5E6",
};

export interface DishOption {
  id: string;
  name: string;
  desc?: string;
  price?: string | number;
}

export interface DishCustomizationSection {
  id: string;
  title: string;
  options: DishOption[];
}

export interface Dish {
  /** UUID real del producto en Supabase. Ausente para platos del fallback estático (sin datos en BD). */
  id?: string;
  name: string;
  description: string;
  price: string;
  image?: string;
  is_customizable?: boolean;
  custom_options?: DishCustomizationSection[];
}

export interface Category {
  id: string;
  label: string;
  dishes: Dish[];
}

/**
 * FALLBACK VACÍO — Los platos ahora se cargan completamente desde Supabase en tiempo real.
 * Si no hay datos en la BD, se usa esta lista mínima para evitar crashes.
 */
export const categories: Category[] = [
  {
    id: "cargando",
    label: "Cargando categorías...",
    dishes: [],
  },
];

interface DishCardProps {
  dish: Dish;
  categoryId: string;
  onSelectBreakfast?: (dish: Dish) => void;
}

function DishCard({ dish, categoryId, onSelectBreakfast }: DishCardProps) {
  const { addItem } = useCart();
  const priceNum = parseFloat(dish.price.replace("S/ ", ""));

  const isCustomizable =
    dish.is_customizable === true ||
    (dish.custom_options?.length || 0) > 0 ||
    dish.name.toLowerCase().includes("desayuno ayacuchano") ||
    dish.name.toLowerCase().includes("arma tu ronda");

  const handleAdd = () => {
    if (isCustomizable && onSelectBreakfast) {
      onSelectBreakfast(dish);
    } else {
      addItem({
        id: `${categoryId}-${dish.name}`,
        productId: dish.id,
        name: dish.name,
        price: priceNum,
        image: dish.image,
      });
    }
  };

  return (
    <div
      onClick={isCustomizable ? handleAdd : undefined}
      className={`bg-white rounded-2xl overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-piedra/50 ${
        isCustomizable ? "cursor-pointer" : ""
      }`}
    >
      {dish.image ? (
        <div className="h-44 overflow-hidden relative m-2.5 rounded-xl border border-black/5">
          <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
          <img
            src={dish.image}
            alt={nombreEnCarta(dish.name)}
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="h-44 m-2.5 rounded-xl bg-black/5 flex items-center justify-center relative">
          <span className="font-serif italic text-black/30 text-xl px-4 text-center">
            {nombreEnCarta(dish.name)}
          </span>
        </div>
      )}
      <div className="px-5 pb-5 pt-3 flex flex-col flex-1">
        <div className="mb-2">
          <h3 className="text-lg font-serif font-bold leading-tight text-nogal">
            {nombreEnCarta(dish.name)}
          </h3>
        </div>
        <p className="text-black/60 text-xs flex-1 mb-5 leading-relaxed font-medium">
          {dish.description}
        </p>
        <span className="self-start font-serif font-bold text-sm px-3 py-1 rounded-full bg-cochinilla/10 text-cochinilla mb-3">
          {dish.price}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all border border-cochinilla/30 text-cochinilla font-bold text-sm bg-piedra hover:bg-cochinilla hover:text-white shadow-xs hover:shadow-sm active:scale-[0.99]"
        >
          <Plus size={15} strokeWidth={2.5} />
          {isCustomizable ? "Personalizar y agregar" : "Agregar"}
        </button>
      </div>
    </div>
  );
}




