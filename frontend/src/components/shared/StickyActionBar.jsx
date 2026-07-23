// src/components/shared/StickyActionBar.jsx
import { Save, Send, X, Loader2 } from 'lucide-react';

export default function StickyActionBar({
  onSaveDraft,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isSaving = false,
  disabled = false,
  showDraft = true,
}) {
  return (
    <div className="sticky bottom-0 z-30 bg-white border-t border-gray-200 px-6 py-3 -mx-4 -mb-4 mt-6 flex items-center justify-between shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-1.5"><X className="h-4 w-4" /> Cancel</span>
      </button>
      <div className="flex items-center gap-3">
        {showDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving || disabled}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save as Draft
          </button>
        )}
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || disabled}
          className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#1e3a5f] rounded hover:bg-[#163050] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Submit
        </button>
      </div>
    </div>
  );
}
