import { FC, ReactNode } from "react";

interface AuthFormWrapperProps {
  title: string;
  children: ReactNode;
}

const AuthFormWrapper: FC<AuthFormWrapperProps> = ({ title, children }) => {
  return (
    <div className="h-fit flex items-center justify-center bg-gray-100 px-4 py-12">
      <div className="bg-white rounded-2xl px-10 py-8 w-full max-w-lg">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center tracking-tight">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default AuthFormWrapper;
