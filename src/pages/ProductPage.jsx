import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/products/${id}`);
        setProduct(data);
        setCurrentImage(0);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate('/login');
    try {
      await axios.post('/cart', { productId: id, quantity });
      navigate('/cart');
    } catch (error) {
      console.error(error);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/products/${id}/reviews`, { rating, comment });
      setReviewSuccess(true);
      setComment('');
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;
  if (!product) return <p className="text-center py-20">Product not found</p>;

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const hasManyImages = allImages.length > 1;

  const prevImage = () => setCurrentImage(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  const nextImage = () => setCurrentImage(prev => (prev === allImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image Gallery */}
        <div className="relative bg-amber-50 rounded-xl flex items-center justify-center overflow-hidden">
          {allImages.length > 0 ? (
            <>
              <img
                src={allImages[currentImage]}
                alt={`${product.name} ${currentImage + 1}`}
                className="w-full h-auto object-contain rounded-xl"
              />
              {hasManyImages && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-amber-50 transition text-amber-800 text-xl font-bold"
                  >
                    ‹
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white rounded-full w-9 h-9 flex items-center justify-center shadow-md hover:bg-amber-50 transition text-amber-800 text-xl font-bold"
                  >
                    ›
                  </button>
                  <div className="absolute bottom-3 flex gap-2">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentImage(i)}
                        className={`w-2 h-2 rounded-full transition ${
                          i === currentImage ? 'bg-amber-800' : 'bg-amber-300'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <span className="text-9xl">📓</span>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-amber-700 text-sm font-medium uppercase tracking-wide">
            {product.category}
          </p>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">{product.name}</h1>
          <p className="text-gray-500 mt-3">{product.description}</p>
          <p className="text-3xl font-bold text-amber-800 mt-4">${product.price}</p>
          <p className="text-gray-500 mt-1">
            {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
          </p>

          <div className="flex items-center gap-4 mt-6">
            <input
              type="number"
              min="1"
              max={product.countInStock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 w-20 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              className="bg-amber-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

        {product.reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map(review => (
              <div key={review._id} className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <p className="text-amber-700">{'⭐'.repeat(review.rating)}</p>
                </div>
                <p className="text-gray-500 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Write Review */}
        {user && (
          <div className="mt-8 bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Write a Review</h3>
            {reviewSuccess && (
              <div className="bg-green-100 text-green-700 px-4 py-3 rounded-lg mb-4">
                Review submitted!
              </div>
            )}
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {[5,4,3,2,1].map(r => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-amber-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-900 transition"
              >
                Submit Review
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;