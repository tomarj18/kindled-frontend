import { Link } from 'react-router-dom';
import { BookOpen, ShoppingBag } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div style={{backgroundColor: '#FFFDF7', borderColor: '#E8DCC8'}} className="rounded-xl border overflow-hidden hover:shadow-lg transition-shadow duration-300">

      {/* Product Image */}
      <div style={{backgroundColor: '#FDF6E3'}} className="h-64 flex items-center justify-center p-4">
       {product.image ? (
       <img
        src={product.image}
        alt={product.name}
        className="h-full w-full object-contain"
      />
        ) : (
          <BookOpen size={64} color="#C9A84C" />
        )}
      </div>

      {/* Product Info */}
      <div className="p-5">
        <p style={{color: '#C9A84C'}} className="text-xs font-semibold uppercase tracking-widest mb-1">
          {product.category}
        </p>
        <h3 style={{fontFamily: 'Playfair Display, serif', color: '#5C3D2E'}} className="font-bold text-lg mb-1">
          {product.name}
        </h3>
        <p style={{color: '#9C7E6A'}} className="text-sm leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mt-4">
          <span style={{color: '#5C3D2E'}} className="font-bold text-xl">
            ${product.price}
          </span>
          <Link
            to={`/product/${product._id}`}
            style={{backgroundColor: '#5C3D2E', color: '#FFFDF7'}}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            <ShoppingBag size={16} />
            View
          </Link>
        </div>
      </div>

    </div>
  );
};

export default ProductCard;