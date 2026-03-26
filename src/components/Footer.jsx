import { Link } from 'react-router-dom';
import { Instagram, Mail, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{backgroundColor: '#ffffff', color: '#E8DCC8'}}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 style={{fontFamily: 'Playfair Display, serif', color: '#C9A84C'}} className="text-2xl font-bold mb-3">
              Kindled Paper Studio
            </h3>
            <p style={{color: '#9C7E6A'}} className="text-sm leading-relaxed">
              Purposeful stationery for intentional living. Every product crafted with faith and meaning.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" style={{color: '#C9A84C'}} className="hover:opacity-80 transition">
                <Instagram size={20} />
              </a>
              <a href="#" style={{color: '#C9A84C'}} className="hover:opacity-80 transition">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 style={{color: '#6d5f39'}} className="font-semibold uppercase tracking-widest text-sm mb-4">
              Shop
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">All Products</Link>
              <Link to="/shop?category=Journals%20%26%20Notebooks" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Journals & Notebooks</Link>
              <Link to="/shop?category=Stickers%20%26%20Bookmarks" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Stickers & Bookmarks</Link>
              <Link to="/shop?category=Planners" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Planners</Link>
              <Link to="/shop?category=Pens" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Pens</Link>
              <Link to="/shop?category=Keychains" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Keychains</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h4 style={{color: '#6d5f39'}} className="font-semibold uppercase tracking-widest text-sm mb-4">
              Account
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/login" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Login</Link>
              <Link to="/register" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Sign Up</Link>
              <Link to="/orders" style={{color: '#9C7E6A'}} className="text-sm hover:text-white transition">Order History</Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div style={{borderColor: '#fadaab'}} className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p style={{color: '#6B4F3A'}} className="text-sm">
            © 2026 Kindled Paper Studio. All rights reserved.
          </p>
          <p style={{color: '#6B4F3A'}} className="text-sm flex items-center gap-1">
            Made with <Heart size={14} color="#C9A84C" /> by Kindled Paper Studio
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;