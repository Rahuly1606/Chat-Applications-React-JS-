import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { FileText, Image, PaperclipIcon, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [fileAttachment, setFileAttachment] = useState(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size - reduce to 5MB to avoid upload issues
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File size cannot exceed 5MB");
      return;
    }

    // Accept PDF and common document formats
    const acceptedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "text/plain"];
    
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Please select a PDF, DOC, DOCX, or TXT file");
      return;
    }

    toast.loading("Processing file...");
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setFileAttachment({
        data: reader.result,
        name: file.name,
        type: file.type
      });
      toast.dismiss();
      toast.success("File ready to send");
    };
    
    reader.onerror = () => {
      toast.dismiss();
      toast.error("Error processing file");
    };
    
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeFile = () => {
    setFileAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview && !fileAttachment) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
        file: fileAttachment
      });

      // Clear form
      setText("");
      setImagePreview(null);
      setFileAttachment(null);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* File Attachment Preview */}
      {fileAttachment && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <div className="flex items-center gap-2 p-2 border border-zinc-700 rounded-lg bg-base-200">
              <FileText className="text-primary" size={18} />
              <span className="text-sm truncate max-w-[180px]">{fileAttachment.name}</span>
            </div>
            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Image upload input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          {/* File upload input */}
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Image upload button - Now visible on mobile */}
          <button
            type="button"
            className={`flex btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => imageInputRef.current?.click()}
          >
            <Image size={18} />
          </button>

          {/* File upload button - Now visible on mobile */}
          <button
            type="button"
            className={`flex btn btn-circle ${fileAttachment ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <PaperclipIcon size={18} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview && !fileAttachment}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;