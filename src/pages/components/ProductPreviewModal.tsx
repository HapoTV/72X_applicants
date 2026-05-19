import React from 'react';
import { normalizePreviewImages, toTitleCase, formatPrice, formatConditionLabel } from '../marketplaceHelpers';

interface ProductPreviewModalProps {
  isOpen: boolean;
  previewProduct: any;
  previewLoading: boolean;
  previewError: string | null;
  activePreviewImageIndex: number;
  isFreeTrialUser: boolean;
  isOwnPreviewProduct: boolean;
  onClose: () => void;
  onContactSeller: () => void;
  onImageIndexChange: (index: number) => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  isOpen,
  previewProduct,
  previewLoading,
  previewError,
  activePreviewImageIndex,
  isFreeTrialUser,
  isOwnPreviewProduct,
  onClose,
  onContactSeller,
  onImageIndexChange
}) => {
  if (!isOpen) return null;

  const previewImages = normalizePreviewImages(previewProduct?.images);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-3xl max-h-[95vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">Product Preview</div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">×</button>
        </div>

        <div className="p-4">
          {previewLoading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : previewError ? (
            <div className="text-sm text-red-600">{previewError}</div>
          ) : previewProduct ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {previewImages.length > 0 ? (
                    <div className="space-y-2">
                      <img
                        src={previewImages[Math.min(activePreviewImageIndex, previewImages.length - 1)]}
                        alt={previewProduct.title}
                        className="w-full h-64 object-cover rounded-lg border border-gray-100"
                      />

                      {previewImages.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                          {previewImages.map((img: string, idx: number) => (
                            <button
                              key={`${img}-${idx}`}
                              onClick={() => onImageIndexChange(idx)}
                              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border ${
                                idx === activePreviewImageIndex ? 'border-primary-500' : 'border-gray-200'
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center px-4 text-center rounded-lg">
                      <span className="text-sm text-gray-500">No product picture uploaded</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="text-xl font-bold text-gray-900">{previewProduct.title}</div>
                  <div className="text-lg font-semibold text-primary-600">{formatPrice(previewProduct.price)}</div>
                  <div className="text-sm text-gray-600">{previewProduct.description}</div>

                  <div className="pt-2 space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Seller</span>
                      <span className="text-gray-900">{previewProduct.seller}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Category</span>
                      <span className="text-gray-900">{toTitleCase(previewProduct.category)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Location</span>
                      <span className="text-gray-900">{toTitleCase(previewProduct.location)}</span>
                    </div>
                    {previewProduct.condition && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Condition</span>
                        <span className="text-gray-900">{formatConditionLabel(previewProduct.condition)}</span>
                      </div>
                    )}
                    {typeof previewProduct.negotiable === 'boolean' && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Negotiable</span>
                        <span className="text-gray-900">{previewProduct.negotiable ? 'Yes' : 'No'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Close
                </button>
                <div className="relative group">
                  <button
                    onClick={isFreeTrialUser || isOwnPreviewProduct ? undefined : onContactSeller}
                    disabled={isFreeTrialUser || isOwnPreviewProduct}
                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                      isFreeTrialUser || isOwnPreviewProduct
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    Contact Seller
                  </button>
                  {isFreeTrialUser && (
                    <div className="pointer-events-none absolute -top-10 right-0 hidden group-hover:block">
                      <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                        Users on Free Trial cannot contact sellers. Subscribe to access messaging.
                      </div>
                    </div>
                  )}
                  {!isFreeTrialUser && isOwnPreviewProduct && (
                    <div className="pointer-events-none absolute -top-10 right-0 hidden group-hover:block">
                      <div className="max-w-xs rounded-md bg-gray-900 text-white text-xs px-3 py-2 shadow-lg">
                        You can't contact yourself about your own product.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProductPreviewModal;
