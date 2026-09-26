import React from 'react';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { Plus, Eye, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
  onQuickAdd
}) => {
  return (
    <div className="card-soft overflow-hidden group flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-lg bg-white border border-slate-200/80">
      {/* Image container */}
      <div
        onClick={() => onOpenDetails(product)}
        className="relative aspect-square overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 max-w-[55%]">
          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-800 shadow-2xs border border-white/50 truncate">
            {product.modelNumber}
          </span>
          {product.purity.includes('22K') ? (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-500/90 text-white shadow-2xs backdrop-blur-xs truncate">
              22K 916
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-800/80 text-white shadow-2xs backdrop-blur-xs truncate">
              18K 750
            </span>
          )}
        </div>

        {/* Stock status badge */}
        <div className="absolute top-2.5 right-2.5 z-10 max-w-[40%]">
          {product.status === 'In Stock' ? (
            <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-emerald-600/90 text-white shadow-2xs backdrop-blur-xs block truncate text-center">
              Stock: {product.stock}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-semibold bg-blue-600/90 text-white shadow-2xs backdrop-blur-xs block truncate text-center">
              MTO
            </span>
          )}
        </div>

        {/* Hover quick view overlay */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Details Area */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium text-slate-500">{product.category}</span>
            <span className="text-[11px] font-mono text-slate-400">{product.size}</span>
          </div>

          <h3
            onClick={() => onOpenDetails(product)}
            className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 cursor-pointer transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>

          <div className="mt-1 flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
            <span>Wt: {product.weight}</span>
            {product.diamondWeight && (
              <>
                <span>•</span>
                <span className="truncate text-amber-700 font-medium">Dia: {product.diamondWeight}</span>
              </>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 sm:mt-4 sm:pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[9px] sm:text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              Wholesale
            </div>
            <div className="text-sm sm:text-base font-bold text-slate-900 font-mono truncate">
              {formatCurrency(product.price)}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400">MOQ: {product.moq} pcs</div>
          </div>

          <Button
            variant="secondary"
            size="xs"
            onClick={() => onQuickAdd(product)}
            leftIcon={<Plus className="w-3.5 h-3.5 text-blue-600" />}
            className="hover:border-blue-400 hover:bg-blue-50/50 flex-shrink-0"
          >
            Add ({product.moq})
          </Button>
        </div>
      </div>
    </div>
  );
};
