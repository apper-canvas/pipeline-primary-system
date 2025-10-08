import Input from "@/components/atoms/Input";

const FormField = ({ label, error, required, children, ...props }) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children || <Input error={error} {...props} />}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormField;