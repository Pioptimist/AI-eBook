import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Book } from "lucide-react";

import DashboardLayout from "../components/layout/DashboardLayout";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import BookCard from "../components/cards/BookCard";
import CreateBookModal from "../components/modals/CreateBookModal";
// Skeleton Loader for Book Card
const BookCardSkeleton = () => (
  <div className="animate-pulse bg-white border border-slate-200 rounded-lg shadow-sm">
    <div className="w-full aspect-[16/25] bg-slate-200 rounded-t-lg"></div>
    <div className="p-4">
      <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
    </div>
  </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 text-center">
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-25 transition-opacity"
          onClick={onClose}
        ></div>
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
          <p className="text-slate-600 mb-5">{message}</p>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );  
};


const DashboardPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.BOOKS.GET_BOOKS);
        setBooks(response.data);
      } catch (error) {
        toast.error("Failed to fetch your eBooks.");
      } finally{
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleDeleteBook = async () => {
    if (!bookToDelete) return;
    try {
      await axiosInstance.delete(
        `${API_PATHS.BOOKS.DELETE_BOOK}/${bookToDelete}`
      );
      setBooks(books.filter((book) => book._id !== bookToDelete));   //this is to remove the deleted book from the list
      toast.success("eBook deleted successfully.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete eBook.");
    } finally {
      setBookToDelete(null);
    }
  };

  const handleCreateBookClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleBookCreated = (bookId) => {
    setIsCreateModalOpen(false);
    navigate(`/editor/${bookId}`);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 xl:px-20 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-bold text-slate-900">All eBooks</h1>
            <p className="text-[13px] text-slate-600 mt-1">
              Create, edit, and manage all your AI-generated eBooks.
            </p>
          </div>
          <Button
            className="whitespace-nowrap"
            onClick={handleCreateBookClick}
            icon={Plus}
          >
            Create New eBook
          </Button>
        </div>

        {isLoading ? (  //in here isloading will only be true if useEffect is not finished fetching the books so it loads the skeleton
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <BookCardSkeleton key={i} />
            ))}  
          </div> //this whole thing is just a placeholder while the real data is being fetched bcz in try block we are waiting for data to come and till then isloading is true once the data arrives we move the below code
        ) : books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-200 rounded-xl mt-8">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Book className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No eBooks Found</h3>
            <p className="text-slate-500 mb-6 max-w-md">
              You haven't created any eBooks yet. Get started by creating your first one.
            </p>
            <Button onClick={handleCreateBookClick} icon={Plus}>
              Create Your First eBook
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} 
              onDelete={() => setBookToDelete(book._id)}
              />
            ))} 
            {/* we used ondel like that bcz we want t wait till the delete button is pressed which is checked in bookcard and if it does in its onclick we passed ondelete with bookid which is coolected by setbooktodelete */}
          </div>

        )}

        <ConfirmationModal
          isOpen={!!bookToDelete}   //the two exclamation mark effeectively turns null into false nd id into true.
          onClose={() => setBookToDelete(null)}
          onConfirm={handleDeleteBook}
          title="Delete eBook"
          message="Are you sure you want to delete this ebook? This action cannot be undone."
        />

        <CreateBookModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onBookCreated={handleBookCreated}
        />
        

      </div>
    </DashboardLayout>
    

  );
};

export default DashboardPage;
