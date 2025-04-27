import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.log("Error in Getusersidebar:", error.message);
        res.status(500).json({ error: "Something went wrong" })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.log("error in getMessages:", error.message);
        res.status(500).json({ error: "Something went wrong" });

    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image, file } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        let imageUrl;
        let fileData = null;

        if (image) {
            try {
                // Save image to cloudinary with increased size limit
                const uploadedResponse = await cloudinary.uploader.upload(image, {
                    resource_type: "image",
                    max_file_size: 10000000, // 10MB in bytes
                    quality: "auto"
                });
                imageUrl = uploadedResponse.secure_url;
            } catch (imageError) {
                console.error("Error uploading image to Cloudinary:", imageError);
                return res.status(500).json({ error: "Failed to upload image" });
            }
        }

        if (file && file.data) {
            try {
                // Handle file upload (PDF, etc.)
                const uploadedFile = await cloudinary.uploader.upload(file.data, {
                    resource_type: "auto",
                    max_file_size: 10000000, // 10MB in bytes
                    folder: "chat_files",
                    public_id: `file_${Date.now()}`,
                });
                
                fileData = {
                    url: uploadedFile.secure_url,
                    name: file.name,
                    type: file.type
                };
            } catch (fileError) {
                console.error("Error uploading file to Cloudinary:", fileError);
                return res.status(500).json({ error: "Failed to upload file" });
            }
        }

        try {
            const newMessage = new Message({
                senderId,
                receiverId,
                text,
                image: imageUrl,
                file: fileData
            });

            await newMessage.save();
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            res.status(200).json(newMessage);
        } catch (dbError) {
            console.error("Error saving message to database:", dbError);
            res.status(500).json({ error: "Failed to save message" });
        }
    } catch (error) {
        console.error("Error in Sending message:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}