const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="relative w-16 h-16">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
        
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-primary animate-spin"></div>
        
        {/* Inner pulse */}
        <div className="absolute inset-2 rounded-full bg-primary/20 animate-pulse"></div>
        
        {/* Center dot */}
        <div className="absolute inset-6 rounded-full bg-primary"></div>
      </div>
      
      <div className="space-y-2 text-center">
        <p className="text-lg font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
          Editing image...
        </p>
        <div className="flex gap-1 justify-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
