export const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-700 text-lg font-medium">Loading data...</p>
    </div>
  );
};
