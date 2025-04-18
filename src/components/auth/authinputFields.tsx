// AuthInputField.tsx

type AuthInputFieldProps = {
  label: string
  type: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  rightElement?: React.ReactNode
}

export default function AuthInputField({
  label,
  type,
  name,
  value,
  onChange,
  placeholder,
  rightElement,
}: AuthInputFieldProps) {
  return (
      <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <div className="relative mt-1">
              <input
                  type={type}
                  name={name}
                  value={value}
                  onChange={onChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {rightElement && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {rightElement}
                  </div>
              )}
          </div>
      </div>
  )
}
