import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from '../../components/customer/ProductCard';
import { ProductDetailModal } from '../../components/customer/ProductDetailModal';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Sparkles,
  ArrowUpDown,
  Check
} from 'lucide-react';

export const CustomerCataloguePage: React.FC = () => {
  const { products, addToCart } = useApp();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPurity, setSelectedPurity] = useState<string>('All');
  const [selectedStock, setSelectedStock] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'model'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active product modal for deep details
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(() => {
    const id = searchParams.get('id');
    return id ? products.find((p) => p.id === id) || null : null;
  });

  const categories: (ProductCategory | 'All')[] = [
    'All',
    'Rings',
    'Earrings',
    'Necklaces',
    'Bracelets',
    'Bangles',
    'Chains',
    'Pendants',
    'Sets'
  ];

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          p.modelNumber.toLowerCase().includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);

        const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
        const matchesPurity = selectedPurity === 'All' || p.purity.includes(selectedPurity);
        const matchesStock =
          selectedStock === 'All' ||
          (selectedStock === 'In Stock' && p.status === 'In Stock') ||
          (selectedStock === 'Made to Order' && p.status === 'Made to Order');

        return matchesQuery && matchesCat && matchesPurity && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'model') return a.modelNumber.localeCompare(b.modelNumber);
        return 0; // featured default
      });
  }, [products, searchQuery, selectedCategory, selectedPurity, selectedStock, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedPurity('All');
    setSelectedStock('All');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'All' ||
    selectedPurity !== 'All' ||
    selectedStock !== 'All' ||
    sortBy !== 'featured';

  return (
    <div className="space-y-6">
      {/* Banner / Wholesale Welcome */}
      <div className="card-navy-hero p-5 sm:p-7 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Diwali & Festive B2B Manufacturing Booking Open
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight font-serif">
            Wholesale Fine Jewellery Catalogue
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
            Select authentic 18K and 22K hallmarked fine jewellery models. Customize order quantities, line-wise stamping, and schedule factory production.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-soft p-4 bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search model number e.g. VJ-R102, floral ring, necklace..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Desktop Filters & Sorting */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            <div className="hidden md:flex items-center gap-2">
              <select
                value={selectedPurity}
                onChange={(e) => setSelectedPurity(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Purities</option>
                <option value="22K">22K Gold (916)</option>
                <option value="18K">18K Gold (750)</option>
              </select>

              <select
                value={selectedStock}
                onChange={(e) => setSelectedStock(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="All">All Stock</option>
                <option value="In Stock">Ready Stock</option>
                <option value="Made to Order">Made to Order</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-slate-700"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="model">Model Number</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Horizontal Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? products.length
                : products.filter((p) => p.category === cat).length;

            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0b1e36] text-white shadow-2xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Products Match Your Criteria"
          description="Try broadening your category or search keyword filters to find wholesale jewellery models."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      ) : (
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onOpenDetails={(p) => setSelectedProduct(p)}
              onQuickAdd={(p) => addToCart(p, p.moq)}
            />
          ))}
        </div>
      )}

      {/* Product Details Modal */}
      <ProductDetailModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto bg-white rounded-t-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Catalogue Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Gold Purity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All', '22K', '18K'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setSelectedPurity(p)}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      selectedPurity === p
                        ? 'bg-[#0b1e36] text-white border-[#0b1e36]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {p === 'All' ? 'All' : `${p} Gold`}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Stock Availability
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All', 'In Stock', 'Made to Order'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStock(s)}
                    className={`py-2 text-xs font-semibold rounded-xl border ${
                      selectedStock === s
                        ? 'bg-[#0b1e36] text-white border-[#0b1e36]'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Sort Pricing
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200"
              >
                <option value="featured">Featured Collection</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="model">Model Number</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <Button
                variant="secondary"
                size="md"
                onClick={handleClearFilters}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
