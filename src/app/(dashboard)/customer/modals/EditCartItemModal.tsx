"use client";
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface EditCartItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  onSave: (itemId: number, quantity: number, notes: string) => Promise<void>;
}

const EditCartItemModal: React.FC<EditCartItemModalProps> = ({ isOpen, onClose, item, onSave }) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setNotes(item.notes || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(item.id, quantity, notes);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Edit Cart Item</h2>
        <h3 className="font-semibold text-gray-800 mb-2">{item.service?.name}</h3>
        
        <div className="mb-4">
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10)))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            min="1"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Any special instructions?"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-300 flex items-center"
          >
            {isSaving && <Loader2 size={16} className="animate-spin mr-2" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCartItemModal;
