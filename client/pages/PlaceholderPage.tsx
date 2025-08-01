import { motion } from "framer-motion";
import { Construction, MessageCircle } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

const PlaceholderPage = ({ title, description }: PlaceholderPageProps) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center"
      >
        <div className="bg-primary/10 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <Construction className="h-12 w-12 text-primary" />
        </div>

        <h1 className="text-3xl font-heading font-bold text-gray-900 mb-4">
          {title}
        </h1>

        <p className="text-gray-600 mb-8">{description}</p>

        <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
          <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-4">
            This page is under development. Continue prompting to help us build
            this feature!
          </p>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            Request this feature →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceholderPage;
