import { useState } from "react";
import { createCategory, updateCategory } from "../../../api/stock";

export default function CategoryModal({ close, onSaved, editData }) {
  const [name, setName] = useState(editData?.name || "");

  const submit = async () => {
    if (editData) {
      await updateCategory(editData.id, { name });
    } else {
      await createCategory({ name });
    }
    onSaved();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-96 animate-slide-up">
        <h2 className="text-lg font-semibold mb-4">
          {editData ? "Edit Category" : "Add Category"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full border p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={close} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
