import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Upload } from "lucide-react";
import { toast } from "react-hot-toast";

const AddCategory = () => {
  const { axios, navigate, loading, setLoading } = useContext(AppContext);

  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Handle text input
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !file) {
      toast.error("Category name and image are required");
      return;
    }

    try {
      setLoading(true);

      // Prepare FormData for file upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", file);

      // Send POST request to backend
      const response = await axios.post(
        "http://localhost:5000/api/categories/add", // Direct backend URL
        formData,
        {
          withCredentials: true, // ✅ send cookies for auth
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/admin/categories");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong while adding category"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-md w-full flex flex-col gap-5 bg-white p-6 rounded-xl shadow-md"
      >
        <h2 className="text-xl font-semibold text-center">Add New Category</h2>

        {preview && (
          <img src={preview} alt="preview" className="w-1/2 mx-auto mb-4" />
        )}

        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
          </label>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={handleNameChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Image *
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            required
          />
          <label
            htmlFor="fileUpload"
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 transition"
          >
            <Upload className="w-8 h-8 text-gray-500 mb-2" />
            <span className="text-gray-600 text-sm">
              {file ? file.name : "Click to upload an image"}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-orange-500 text-white py-3 rounded-md hover:bg-orange-600 transition"
        >
          {loading ? "Adding..." : "Add Category"}
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
