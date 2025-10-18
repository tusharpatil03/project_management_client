//Provider → Hook → Consumer → UI chain

import { createPortal } from 'react-dom';
import {
  createContext,
  useContext,
  useCallback,
  ReactNode,
  useState,
  useEffect,
} from 'react';

export type MessageType = 'success' | 'error' | 'warning' | 'info';

//interface of the message
interface Message {
  id: string;
  text: string;
  type: MessageType;
  duration?: number;
}

interface ShowMessageProps {
  message: Message | null;
  onClose: () => void;
}

// React component that will get render is message it trigged in context provider
const ShowMessage: React.FC<ShowMessageProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  // if message state is changed by context proiders (showMessage)
  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, message.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getStyles = () => {
    const base =
      'flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 transform';
    const colors = {
      success: 'bg-green-50 text-green-800 border border-green-200',
      error: 'bg-red-50 text-red-800 border border-red-200',
      warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
      info: 'bg-blue-50 text-blue-800 border border-blue-200',
    };
    return `${base} ${colors[message.type]} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`;
  };

  const getIcon = () => {
    const icons = {
      success: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };
    return icons[message.type];
  };

  // this it the popup window for the message
  return createPortal(
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={getStyles()}>
        {getIcon()}
        <span className="flex-1 font-medium">{message.text}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>,
    document.body
  );
};


// type definition of context
interface MessageContextType {
  showMessage: (text: string, type: MessageType, duration?: number) => void;
  showSuccess: (text: string, duration?: number) => void;
  showError: (text: string, duration?: number) => void;
  showWarning: (text: string, duration?: number) => void;
  showInfo: (text: string, duration?: number) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

//useMessage() → gets the contextValue object.
export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within MessageProvider');
  }
  return context;
};

//message provider take a react component (Node) as a input
export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  //updates provider state (messages[]).
  const showMessage = useCallback(
    (text: string, type: MessageType, duration?: number) => {
      const id = Date.now().toString();
      const newMessage: Message = { id, text, type, duration };
      setMessages((prev) => [...prev, newMessage]);
    },
    []
  );

  //onclose -> after timeout
  const removeMessage = useCallback((id: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  const contextValue: MessageContextType = {
    showMessage,

    // this all triggers showMessage() inside the provider
    showSuccess: (text, duration) => showMessage(text, 'success', duration),
    showError: (text, duration) => showMessage(text, 'error', duration),
    showWarning: (text, duration) => showMessage(text, 'warning', duration),
    showInfo: (text, duration) => showMessage(text, 'info', duration),
  };

  //It returns children → all your other components continue rendering normally.
  // It also renders UI (ShowMessage) for visible messages on top of everything else.
  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {messages.map((message) => (
          <ShowMessage
            key={message.id}
            message={message}
            onClose={() => removeMessage(message.id)}
          />
        ))}
      </div>
    </MessageContext.Provider>
  );
};

export default ShowMessage;
