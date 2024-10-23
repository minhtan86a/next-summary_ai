export default function Loading() {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
      <div className="animate-spin h-12 w-12 border-t-4 border-pink-600 rounded-full" />
    </div>
  );
}
