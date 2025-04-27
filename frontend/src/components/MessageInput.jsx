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
    <div className="px-2 py-3 sm:p-4 w-full border-t border-base-300">
      {/* Attachments section - horizontal scroll on mobile */}
      {(imagePreview || fileAttachment) && (
        <div className="mb-3 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {/* Image Preview */}
          {imagePreview && (
            <div className="relative flex-shrink-0">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-base-300"
              />
              <button
                onClick={removeImage}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-base-300
                flex items-center justify-center shadow-md"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}

          {/* File Attachment Preview */}
          {fileAttachment && (
            <div className="relative flex-shrink-0">
              <div className="flex items-center gap-2 py-2 px-3 border border-base-300 rounded-lg bg-base-200 h-16">
                <FileText className="text-primary" size={20} />
                <span className="text-sm font-medium truncate max-w-[120px] sm:max-w-[180px]">{fileAttachment.name}</span>
              </div>
              <button
                onClick={removeFile}
                className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-base-300
                flex items-center justify-center shadow-md"
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-1 sm:gap-2">
        <div className="flex-1 flex gap-1 sm:gap-2 items-center bg-base-200 rounded-full pl-4 pr-1 py-1">
          <input
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-base-content placeholder:text-base-content/50"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {/* Hidden inputs */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          {/* Attachment buttons */}
          <div className="flex items-center">
            {/* Image upload button */}
            <button
              type="button"
              className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full ${imagePreview ? "text-primary" : "text-base-content/70 hover:bg-base-300"}`}
              onClick={() => imageInputRef.current?.click()}
            >
              <Image size={18} />
            </button>

            {/* File upload button */}
            <button
              type="button"
              className={`flex-shrink-0 h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full ${fileAttachment ? "text-primary" : "text-base-content/70 hover:bg-base-300"}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <PaperclipIcon size={18} />
            </button>
          </div>
        </div>
        
        {/* Send button */}
        <button
          type="submit"
          className={`btn btn-circle btn-primary ${!text.trim() && !imagePreview && !fileAttachment ? 'opacity-70' : ''}`}
          disabled={!text.trim() && !imagePreview && !fileAttachment}
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;