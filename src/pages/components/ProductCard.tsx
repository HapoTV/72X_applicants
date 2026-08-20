import React from 'react';
import { MapPin } from 'lucide-react';
import { getPrimaryProductImage, formatPrice, toTitleCase, canEditProduct } from '../marketplaceHelpers';
import type { UserProductItem } from '../../interfaces/MarketplaceData';

interface ProductCardProps {
  product: UserProductItem;
  variant: 'featured' | 'my';
  onPreview?: (product: UserProductItem) => void;
  onEdit?: (product: UserProductItem) => void;
  onDelete?: (productId: string) => void;
  onToggleStatus?: (product: UserProductItem) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant,
  onPreview,
  onEdit,
  onDelete,
  onToggleStatus
}) => {
  const primaryImage = getPrimaryProductImage(product);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        {primaryImage ? (
          <img
            src={primaryImage}
            alt={product.title}
            className="w-full h-32 object-cover"
          />
        ) : (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center px-4 text-center">
            <span className="text-sm text-gray-500">No product picture uploaded</span>
          </div>
        )}

        {variant === 'my' && (
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium ${
                product.status === 'sold'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              }`}
            >
              {product.status === 'sold' ? 'Sold' : 'Available'}
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 mb-1 text-sm line-clamp-1">{product.title}</h3>
        <p className="text-gray-600 text-xs mb-2 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-primary-600 text-sm">{formatPrice(product.price)}</span>
          <span className="text-xs text-gray-500">{product.timeAgo}</span>
        </div>

        {variant === 'featured' && (
          <>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{product.seller}</span>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{toTitleCase(product.location)}</span>
              </div>
            </div>
            
            <button
              onClick={() => onPreview?.(product)}
              className="w-full py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs"
            >
              Preview Product
            </button>
          </>
        )}

        {variant === 'my' && (
          <div className="grid grid-cols-2 gap-2">
            <div className="relative group">
              <button
                onClick={() => onEdit?.(product)}
                disabled={!canEditProduct(product) || !onEdit}
                className={`w-full py-1.5 bg-white border rounded-lg transition-colors text-xs ${
                  canEditProduct(product) && onEdit
                    ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    : 'border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Edit
              </button>
              {!canEditProduct(product) && onEdit && (
                <div className="pointer-events-none absolute -top-10 left-0 hidden group-hover:block">
                  <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                    Edit time expired. You cannot edit a product after 3 hours.
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={() => onDelete?.(product.id)}
              disabled={!onDelete}
              className={`py-1.5 bg-white border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-xs ${
                !onDelete ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Delete
            </button>
            <button
              onClick={() => onToggleStatus?.(product)}
              disabled={!onToggleStatus}
              className={`col-span-2 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs ${
                !onToggleStatus ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {product.status === 'sold' ? 'Mark Available' : 'Mark Sold'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
