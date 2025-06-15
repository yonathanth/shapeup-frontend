"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye, EyeOff, Mail, Phone, Calendar, X } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

const NEXT_PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5003";

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(
    null
  );

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/contact`);
      const data = await response.json();
      if (response.ok) {
        setMessages(data.data);
      } else {
        console.error("Failed to fetch messages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/contact/${id}/read`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setMessages(
          messages.map((msg) =>
            msg.id === id ? { ...msg, isRead: true } : msg
          )
        );
      } else {
        console.error("Failed to mark as read");
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const openDeleteModal = (message: ContactMessage) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setMessageToDelete(null);
    setShowDeleteModal(false);
  };

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      const response = await fetch(
        `${NEXT_PUBLIC_API_BASE_URL}/api/contact/${messageToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== messageToDelete.id));
        if (selectedMessage?.id === messageToDelete.id) {
          setShowModal(false);
          setSelectedMessage(null);
        }
        closeDeleteModal();
      } else {
        console.error("Failed to delete message");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const openMessageModal = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);

    // Mark as read if not already read
    if (!message.isRead) {
      await markAsRead(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-customBlue"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Contact Messages</h1>
        <p className="text-gray-400">
          Manage and respond to customer inquiries
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {messages.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No messages found
                  </td>
                </tr>
              ) : (
                messages.map((message) => (
                  <motion.tr
                    key={message.id}
                    className={`cursor-pointer transition-colors hover:bg-gray-700 ${
                      message.isRead ? "bg-gray-800" : "bg-gray-750"
                    }`}
                    onClick={() => openMessageModal(message)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {message.isRead ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-customBlue" />
                        )}
                        <span
                          className={`ml-2 text-sm ${
                            message.isRead
                              ? "text-gray-400"
                              : "text-white font-medium"
                          }`}
                        >
                          {message.isRead ? "Read" : "Unread"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {message.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {message.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-300 truncate max-w-xs">
                        {message.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">
                        {formatDate(message.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(message);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                        title="Delete message"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Detail Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-white">
                  Message Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <div className="text-white font-medium">
                      {selectedMessage.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedMessage.isRead
                          ? "bg-gray-700 text-gray-300"
                          : "bg-customBlue text-black"
                      }`}
                    >
                      {selectedMessage.isRead ? "Read" : "Unread"}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <div className="flex items-center text-white">
                      <Mail className="h-4 w-4 mr-2 text-customBlue" />
                      {selectedMessage.email}
                    </div>
                  </div>
                  {selectedMessage.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone
                      </label>
                      <div className="flex items-center text-white">
                        <Phone className="h-4 w-4 mr-2 text-customBlue" />
                        {selectedMessage.phone}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  <div className="text-white font-medium">
                    {selectedMessage.subject}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Message
                  </label>
                  <div className="bg-gray-700 rounded-lg p-4 text-white whitespace-pre-wrap">
                    {selectedMessage.message}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Received Date
                  </label>
                  <div className="flex items-center text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-600">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => openDeleteModal(selectedMessage)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete Message
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && messageToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-gray-800 rounded-lg max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-2">
                  Delete Message
                </h3>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to delete the message from{" "}
                  <span className="font-medium text-white">
                    {messageToDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>

                <div className="bg-gray-700 rounded-lg p-3 mb-6 text-left">
                  <p className="text-sm text-gray-300">
                    <span className="font-medium">Subject:</span>{" "}
                    {messageToDelete.subject}
                  </p>
                  <p className="text-sm text-gray-300 mt-1">
                    <span className="font-medium">From:</span>{" "}
                    {messageToDelete.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteMessage}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
