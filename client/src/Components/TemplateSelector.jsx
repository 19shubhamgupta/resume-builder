export default function TemplateSelector({ selectedTemplate, setSelectedTemplate }) {
  return (
    <div className="mb-6">
      <label className="block text-gray-700 font-medium mb-2">Select Template</label>
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded-md ${selectedTemplate === "template1" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedTemplate("template1")}
        >
          Template 1
        </button>
        <button
          className={`px-4 py-2 rounded-md ${selectedTemplate === "template2" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          onClick={() => setSelectedTemplate("template2")}
        >
          Template 2
        </button>
      </div>
    </div>
  );
}
