function Loader({ size }) {
  const dimensionClass = size === 16 ? "h-4 w-4" : "h-10 w-10";
  const borderWidth = size === 16 ? "border-2" : "border-[6px]";

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div
          className={`${dimensionClass} rounded-full ${borderWidth} border-muted`}
        />
        <div
          className={`absolute top-0 left-0 ${dimensionClass} rounded-full ${borderWidth} border-primary border-t-transparent animate-spin`}
        />
      </div>
    </div>
  );
}

export default Loader;
