
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Star, Plus, Loader2, Info } from 'lucide-react';
import { Product } from '../types.ts';
import { api } from '../services/api.ts';

interface ProductsProps {
  onSelectProduct: (product: Product) => void;
}

const Products: React.FC<ProductsProps> = ({ onSelectProduct }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getImg = (p: any) => p.image || p.image_url || 'https://images.unsplash.com/photo-1635848600716-52445e994e63?q=80&w=500&auto=format&fit=crop';

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 px-4">
        <div className="min-w-0">
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Catalog</h2>
           <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2 md:mt-4 italic truncate">Engineered Fluids for Reliability</p>
        </div>
        <div className="w-full md:w-96 relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..." 
            className="w-full bg-white border-2 border-slate-100 rounded-2xl md:rounded-3xl py-4 md:py-5 pl-14 pr-6 text-sm focus:border-emerald-500 transition-all shadow-sm outline-none font-bold placeholder:text-slate-300 uppercase tracking-tight"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 md:py-40 opacity-40">
          <Loader2 className="animate-spin text-emerald-500 mb-6" size={40} />
          <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">Optimizing Inventory...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-32 md:py-40 opacity-30 px-6">
          <p className="text-base md:text-lg font-black uppercase italic tracking-tighter">Molecular Search Result: Empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 px-4">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              onClick={() => onSelectProduct(product)}
              className="group bg-white border border-slate-100 rounded-3xl md:rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-100 transition-all active:scale-95 cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-[4/5] relative overflow-hidden bg-slate-50">
                <img 
                  src={getImg(product)} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-1000"
                />
                <div className="absolute top-3 right-3 md:top-5 md:right-5">
                  <div className="bg-white/90 backdrop-blur-md p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl border border-white/20">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-end p-8">
                   <p className="text-white text-[10px] font-black uppercase tracking-widest italic">View Item Details</p>
                </div>
              </div>
              
              <div className="p-4 md:p-6 flex flex-col flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-500 rounded-full"></span>
                    <p className="text-[8px] md:text-[9px] font-black text-emerald-600 uppercase tracking-widest leading-none">Lucky Original</p>
                  </div>
                  <h3 className="text-xs md:text-sm font-black text-slate-800 leading-tight uppercase tracking-tight line-clamp-2 italic">{product.name}</h3>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic">Tap to Order</span>
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#1e1b4b] group-hover:text-white transition-all">
                    <Info size={14} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
