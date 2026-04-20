import React, { useState } from 'react';

interface QuestionCategorizeProps {
  categories: string[];
  items: { label: string; category: string }[];
  categorizeAssignments: Record<string, string>;
  onCategorizeAssignmentChange: (assignments: Record<string, string>) => void;
}

const QuestionCategorize: React.FC<QuestionCategorizeProps> = ({
  categories,
  items,
  categorizeAssignments,
  onCategorizeAssignmentChange,
}) => {
  const [draggingItem, setDraggingItem] = useState<string | null>(null);

  const handleDropToCategory = (cat: string, ev: React.DragEvent) => {
    ev.preventDefault();
    const label = ev.dataTransfer.getData('text/plain');
    if (!label) return;

    onCategorizeAssignmentChange({
      ...categorizeAssignments,
      [label]: cat,
    });

    setDraggingItem(null);
  };

  const handleDropToUnassigned = (ev: React.DragEvent) => {
    ev.preventDefault();
    const label = ev.dataTransfer.getData('text/plain');
    if (!label) return;

    const updated = { ...categorizeAssignments };
    delete updated[label];

    onCategorizeAssignmentChange(updated);
    setDraggingItem(null);
  };

  const assignedItems = (cat: string) =>
    items.filter((i) => categorizeAssignments[i.label] === cat);

  const unassignedItems = items.filter(
    (i) => !categorizeAssignments[i.label]
  );

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold text-gray-600">
        Drag items into the correct category
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={idx}
            className={`border rounded-xl p-3 transition ${
              draggingItem ? 'border-blue-300 bg-blue-50/30' : 'border-gray-200'
            }`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropToCategory(cat, e)}
          >
            <div className="text-sm font-semibold text-gray-900 mb-2">
              {cat}
            </div>

            <div className="space-y-2 min-h-[60px]">
              {assignedItems(cat).length === 0 && (
                <div className="text-xs text-gray-400">
                  Drop items here
                </div>
              )}

              {assignedItems(cat).map((i, iIdx) => (
                <div
                  key={`${idx}-${iIdx}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', i.label);
                    setDraggingItem(i.label);
                  }}
                  onDragEnd={() => setDraggingItem(null)}
                  className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm cursor-move hover:bg-gray-50"
                >
                  {i.label}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* UNASSIGNED */}
      <div
        className={`border rounded-xl p-3 transition ${
          draggingItem ? 'border-orange-300 bg-orange-50/30' : 'border-gray-200'
        }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropToUnassigned}
      >
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Unassigned Items
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {unassignedItems.map((i, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', i.label);
                setDraggingItem(i.label);
              }}
              onDragEnd={() => setDraggingItem(null)}
              className="px-3 py-2 rounded-lg border border-gray-200 bg-white cursor-move hover:bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm">{i.label}</span>
                <span className="text-xs text-gray-500">Drag</span>
              </div>
            </div>
          ))}
        </div>

        {/* RESET */}
        <button
          onClick={() => onCategorizeAssignmentChange({})}
          className="mt-3 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Reset Categories
        </button>
      </div>
    </div>
  );
};

export default QuestionCategorize;