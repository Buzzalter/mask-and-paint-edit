const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="relative w-32 h-32">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
        
        {/* Animated ring */}
        <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary border-r-primary animate-spin"></div>
        
        {/* Inner pulse */}
        <div className="absolute inset-4 rounded-full bg-primary/20 animate-pulse"></div>
        
        {/* Center dot */}
        <div className="absolute inset-12 rounded-full bg-primary"></div>
      </div>
      
      <div className="space-y-3 text-center">
        <p className="text-2xl font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
          Editing image...
        </p>
        <div className="flex gap-2 justify-center">
          <span className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
          <span className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
          <span className="w-3 h-3 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
