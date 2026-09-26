import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, ProductCategory } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { AddProductModal } from '../../components/admin/AddProductModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Gem,
  Plus,
  Search,
  Copy,
  Trash2,
  Edit,
  ExternalLink,
  Layers,
  Sparkles,
  Grid,
  List
} from 'lucide-react';

export const CataloguePage: React.FC = () => {
  const { products, deleteProduct, addProduct, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

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

  const filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.modelNumber.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.purity.toLowerCase().includes(q);

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDuplicate = (prod: Product) => {
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newModel = `${prod.modelNumber}-D${randomSuffix}`;
    addProduct({
      ...prod,
      modelNumber: newModel,
      name: `${prod.name} (Copy)`
    });
    showToast('Product Duplicated', 'success', `Cloned as ${newModel}`);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deleteProduct(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans">
            Catalogue Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage wholesale jewellery lines, gold alloys, weights, diamond specs, and MOQ inventory
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-white p-0.5 shadow-2xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-[#0b1e36] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-[#0b1e36] text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setAddProductOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Model
          </Button>
        </div>
      </div>

      {/* Filter and Category Pills */}
      <div className="card-soft p-4 bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by model# (e.g. VJ-R101), design name, alloy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredProducts.length} of {products.length} models
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
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
                    ? 'bg-[#0b1e36] text-white shadow-2xs'
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

      {/* Main Content: Table or Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          title="No Jewellery Models Found"
          description="Try changing the category filter, search query, or add a new jewellery model."
          actionLabel="Add Product"
          onAction={() => setAddProductOpen(true)}
        />
      ) : viewMode === 'table' ? (
        <div className="card-soft overflow-hidden bg-white border border-slate-200 shadow-2xs">
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Jewellery Model</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Purity & Alloy</th>
                  <th className="py-3 px-3">Gross Wt / Dia</th>
                  <th className="py-3 px-3 text-right">Wholesale Rate</th>
                  <th className="py-3 px-3 text-center">MOQ</th>
                  <th className="py-3 px-3 text-center">Ready Stock</th>
                  <th className="py-3 px-3 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-200 flex-shrink-0 shadow-2xs"
                        />
                        <div>
                          <div className="font-mono font-bold text-slate-900">{prod.modelNumber}</div>
                          <div className="text-slate-600 font-medium line-clamp-1 max-w-[180px]">{prod.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{prod.category}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800">{prod.purity}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      <div>{prod.weight}</div>
                      {prod.diamondWeight && (
                        <div className="text-[10px] text-amber-700">{prod.diamondWeight}</div>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(prod.price)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-700">
                      {prod.moq} pcs
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">
                      {prod.stock} pcs
                    </td>
                    <td className="py-3 px-3 text-center">
                      <Badge
                        variant={prod.status === 'In Stock' ? 'success' : prod.status === 'Low Stock' ? 'warning' : 'default'}
                        size="xs"
                        dot
                      >
                        {prod.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleDuplicate(prod)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Duplicate Model"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(prod)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Delete Model"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Responsive Cards View */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredProducts.map((prod) => (
              <div key={prod.id} className="p-3.5 space-y-2.5">
                <div className="flex items-start gap-3">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 flex-shrink-0 shadow-2xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-slate-900 text-xs">{prod.modelNumber}</span>
                      <span className="font-mono font-bold text-slate-900 text-xs">{formatCurrency(prod.price)}</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">{prod.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {prod.category} • {prod.purity} • {prod.weight}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono">
                      Stock: {prod.stock}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">MOQ: {prod.moq} pcs</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(prod)}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(prod)}
                      className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {filteredProducts.map((prod) => (
            <div key={prod.id} className="card-soft overflow-hidden bg-white border border-slate-200 flex flex-col justify-between">
              <div className="aspect-square relative bg-slate-100">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-white/90 shadow-2xs">
                  {prod.modelNumber}
                </span>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase">{prod.category}</div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">{prod.purity} • {prod.weight}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-bold text-slate-900">{formatCurrency(prod.price)}</div>
                    <div className="text-[10px] text-slate-400">MOQ: {prod.moq} pcs</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(prod)}
                      className="p-1 text-slate-400 hover:text-blue-600"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(prod)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={addProductOpen}
        onClose={() => setAddProductOpen(false)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Catalogue Model?"
        message={`Are you sure you want to remove model "${deleteTarget?.modelNumber} - ${deleteTarget?.name}" from the active B2B wholesale catalogue? This cannot be undone.`}
        confirmLabel="Delete Model"
        variant="danger"
      />
    </div>
  );
};
