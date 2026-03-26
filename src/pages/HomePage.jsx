import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Pen, Heart, Star } from 'lucide-react';
import axios from '../api/axios';
import ProductCard from '../components/ProductCard';

const QuillAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.offsetWidth;
    const H = 140;
    canvas.width = W;
    canvas.height = H;

    const TEXT = "Write Your Story with Intention";
    const FONT_SIZE = W < 500 ? 28 : 48;

    let sparkles = [];
    let progress = 0;
    let animId = null;
    let done = false;
    let glowPulse = 0;

    function drawQuill(x, y) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.6);
      glowPulse += 0.08;
      const glow = 6 + Math.sin(glowPulse) * 4;
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = glow;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-6, -12, -10, -28, -4, -44);
      ctx.bezierCurveTo(0, -52, 8, -48, 10, -38);
      ctx.bezierCurveTo(12, -24, 8, -10, 0, 0);
      ctx.fillStyle = '#C9A84C';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-2, -12, -4, -28, -1, -42);
      ctx.bezierCurveTo(1, -48, 4, -46, 5, -38);
      ctx.bezierCurveTo(6, -26, 3, -12, 0, 0);
      ctx.fillStyle = '#E8C96A';
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(2, -44);
      ctx.strokeStyle = '#A07820';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 0;
      ctx.stroke();
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const py = -i * 5 - 4;
        ctx.moveTo(1, py);
        ctx.lineTo(-8 + i * 0.3, py - 4);
        ctx.strokeStyle = 'rgba(160,120,32,0.5)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        const py = -i * 5 - 4;
        ctx.moveTo(2, py);
        ctx.lineTo(9 - i * 0.3, py - 4);
        ctx.strokeStyle = 'rgba(160,120,32,0.5)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(-1, 2);
      ctx.lineTo(1, 2);
      ctx.lineTo(0, 8);
      ctx.closePath();
      ctx.fillStyle = '#1A1A1A';
      ctx.shadowBlur = 0;
      ctx.fill();
      ctx.restore();
    }

    function addSparkles(x, y) {
      for (let i = 0; i < 5; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 0.5;
        sparkles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          r: Math.random() * 3 + 1.5,
          vx: Math.cos(angle) * speed * 0.6,
          vy: Math.sin(angle) * speed - 1,
          life: 35 + Math.random() * 20,
          maxLife: 55
        });
      }
    }

    function drawSparkles() {
      sparkles = sparkles.filter(s => s.life > 0);
      sparkles.forEach(s => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,215,0,${s.life / s.maxLife})`;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.restore();
        s.x += s.vx;
        s.y += s.vy;
        s.r *= 0.97;
        s.life--;
      });
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      const revealed = TEXT.slice(0, Math.floor(progress));
      ctx.font = `bold ${FONT_SIZE}px 'Playfair Display', Georgia, serif`;
      ctx.fillStyle = '#C9A84C';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      const fullW = ctx.measureText(TEXT).width;
      const startX = W / 2 - fullW / 2;
      const textY = H / 2 + 10;
      ctx.fillText(revealed, startX, textY);
      const revW = ctx.measureText(revealed).width;
      const quillX = startX + revW + 4;
      const quillY = textY + 6;
      drawSparkles();
      if (!done) {
        addSparkles(quillX, quillY - 2);
        drawQuill(quillX, quillY);
      }
      if (progress < TEXT.length) {
        progress += 0.10;
        animId = requestAnimationFrame(loop);
      } else {
        done = true;
        let flyX = quillX;
        let flyY = quillY;
        let flyAlpha = 1;
        function flyAway() {
          ctx.clearRect(0, 0, W, H);
          ctx.font = `bold ${FONT_SIZE}px 'Playfair Display', Georgia, serif`;
          ctx.fillStyle = '#C9A84C';
          ctx.textAlign = 'left';
          ctx.fillText(TEXT, startX, textY);
          drawSparkles();
          ctx.globalAlpha = flyAlpha;
          drawQuill(flyX, flyY);
          ctx.globalAlpha = 1;
          flyY -= 2.5;
          flyX += 1.5;
          flyAlpha -= 0.025;
          if (flyAlpha > 0) requestAnimationFrame(flyAway);
        }
        flyAway();
      }
    }

    loop();
    return () => { if (animId) cancelAnimationFrame(animId); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', margin: '0 auto', width: '100%' }}
    />
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/products');
        setProducts(data.slice(0, 3));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{backgroundColor: '#f3e1ae'}} className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p style={{fontFamily: 'Inter', color: '#29231a'}} className="text-sm font-medium uppercase tracking-widest mb-4">
            Purposeful Stationery
          </p>
          <QuillAnimation />
          <p style={{color: '#29231a'}} className="text-xl mb-10 max-w-2xl mx-auto leading-relaxed mt-6">
            Journals, planners, stickers and bookmarks crafted to inspire your everyday moments
          </p>
          <Link
            to="/shop"
            style={{backgroundColor: '#C9A84C', color: '#FFFDF7'}}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition"
          >
            Shop Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <p style={{color: '#29231a'}} className="text-sm font-medium uppercase tracking-widest mb-2">
            Our Collection
          </p>
          <h2 style={{fontFamily: 'Playfair Display, serif', color: '#C9A84C'}} className="text-4xl font-bold">
            Featured Products
          </h2>
        </div>
        {loading ? (
          <p className="text-center" style={{color: '#7A5C44'}}>Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-center" style={{color: '#7A5C44'}}>No products yet!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link
            to="/shop"
            style={{borderColor: '#C9A84C', color: '#C9A84C'}}
            className="inline-flex items-center gap-2 border-2 px-8 py-3 rounded-lg font-medium hover:opacity-80 transition"
          >
            View All Products <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section style={{backgroundColor: '#f3e1ae', color: '#FFFFFF'}} className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{fontFamily: 'Playfair Display, serif'}} className="text-3xl font-bold text-white mb-12">
            Why Kindled Paper Studio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div style={{backgroundColor: '#C9A84C'}} className="w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Pen size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Intentional Design</h3>
              <p style={{color: '#29231a'}}>Every product crafted with purpose and meaning</p>
            </div>
            <div className="flex flex-col items-center">
              <div style={{backgroundColor: '#C9A84C'}} className="w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Heart size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Faith Inspired</h3>
              <p style={{color: '#29231a'}}>Rooted in faith and designed to help you grow</p>
            </div>
            <div className="flex flex-col items-center">
              <div style={{backgroundColor: '#C9A84C'}} className="w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Star size={24} color="white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Quality Products</h3>
              <p style={{color: '#29231a'}}>Premium stationery that lasts and inspires daily</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;