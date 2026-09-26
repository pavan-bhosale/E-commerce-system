import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ProductCategory, ProductStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { PlusCircle, Sparkles } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose }) => {
  const { addProduct, products } = useApp();

  const [modelNumber, setModelNumber] = useState(`VJ-M${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Rings');
  const [purity, setPurity] = useState('18K Yellow Gold');
  const [weight, setWeight] = useState('4.20 gms');
  const [diamondWeight, setDiamondWeight] = useState('0.35 cts');
  const [size, setSize] = useState('Standard');
  const [price, setPrice] = useState(38000);
  const [moq, setMoq] = useState(10);
  const [stock, setStock] = useState(50);
  const [status, setStatus] = useState<ProductStatus>('In Stock');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(
    'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sampleImages: { label: string; url: string }[] = [
    { label: 'Diamond Ring', url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80' },
    { label: 'Rose Gold Ring', url: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80' },
    { label: 'Royal Necklace', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80' },
    { label: 'Jhumka Earrings', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
    { label: 'Diamond Huggies', url: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80' },
    { label: 'Tennis Bracelet', url: 'https://images.unsplash.com/photo-1611591475104-dc4602f094eb?auto=format&fit=crop&w=800&q=80' },
    { label: 'Filigree Kada', url: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=80' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      addProduct({
        modelNumber,
        name: name || `Fine ${category} Model ${modelNumber}`,
        category,
        image,
        size,
        price,
        moq,
        stock,
        status,
        purity,
        weight,
        diamondWeight,
        description: description || 'High-precision manufactured B2B fine jewellery with BIS hallmarking.'
      });
      setIsSubmitting(false);
      onClose();
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-blue-600" />
          <span>Add New Jewellery Model to Catalogue</span>
        </div>
      }
      subtitle="Expand B2B wholesale lines with specifications & MOQs"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Model Number *
            </label>
            <input
              type="text"
              value={modelNumber}
              onChange={(e) => setModelNumber(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="Rings">Rings</option>
              <option value="Earrings">Earrings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Bangles">Bangles</option>
              <option value="Chains">Chains</option>
              <option value="Pendants">Pendants</option>
              <option value="Sets">Sets</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Product Display Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Celestial Marquise Halo Ring"
            className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gold Purity
            </label>
            <select
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="18K Yellow Gold">18K Yellow Gold (750)</option>
              <option value="22K Yellow Gold">22K Yellow Gold (916)</option>
              <option value="18K Rose Gold">18K Rose Gold (750)</option>
              <option value="18K White Gold">18K White Gold (750)</option>
              <option value="Platinum 950">Platinum 950</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gross Weight
            </label>
            <input
              type="text"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 4.85 gms"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Diamond / Gem Weight
            </label>
            <input
              type="text"
              value={diamondWeight}
              onChange={(e) => setDiamondWeight(e.target.value)}
              placeholder="e.g. 0.45 cts VVS-EF"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Wholesale Price (₹) *
            </label>
            <input
              type="number"
              min="1000"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              MOQ (Pcs) *
            </label>
            <input
              type="number"
              min="1"
              value={moq}
              onChange={(e) => setMoq(parseInt(e.target.value) || 1)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Ready Stock
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value) || 0)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Availability
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProductStatus)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
            >
              <option value="In Stock">In Stock</option>
              <option value="Made to Order">Made to Order</option>
              <option value="Low Stock">Low Stock</option>
            </select>
          </div>
        </div>

        {/* Image Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Jewellery Image Preview / Quick Presets
          </label>
          <div className="flex items-center gap-3">
            <img
              src={image}
              alt="Preview"
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-2xs"
            />
            <div className="flex-1 flex flex-wrap gap-1.5">
              {sampleImages.map((s) => (
                <button
                  key={s.label}
                  type="button"
                  onClick={() => setImage(s.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                    image === s.url
                      ? 'bg-blue-50 text-blue-700 border-blue-300 font-semibold'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Manufacturing Description & Finish Details
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High-polish shank, micro-pave setting with rhodium flash..."
            className="w-full text-xs p-3 rounded-xl border border-slate-200"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
          <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isSubmitting}>
            Add Model to Catalogue
          </Button>
        </div>
      </form>
    </Modal>
  );
};
