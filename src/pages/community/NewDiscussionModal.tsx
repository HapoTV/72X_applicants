import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface NewDiscussionForm {
  title: string;
  category: string;
  content: string;
}

interface NewDiscussionModalProps {
  isOpen: boolean;
  categories: Category[];
  onSubmit: (discussion: NewDiscussionForm) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NewDiscussionModal: React.FC<NewDiscussionModalProps> = ({
  isOpen,
  categories,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [form, setForm] = useState<NewDiscussionForm>({
    title: '',
    category: 'startup',
    content: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', category: 'startup', content: '' });
  };

  const handleCancel = () => {
    setForm({ title: '', category: 'startup', content: '' });
    onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Post Business Advice</h3>
          <button
            onClick={handleCancel}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Advice Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="Give your advice a clear title"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={isLoading}
            >
              {categories.slice(1).map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Advice</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              placeholder="Share your business advice or experience..."
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Posting...' : 'Post Advice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDiscussionModal;