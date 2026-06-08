const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-slate-500 text-lg">{description}</p>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
