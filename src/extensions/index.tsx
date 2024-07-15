import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExtensionWindow: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  const closeModal = (e: React.MouseEvent) => {
    if (modalRef.current && e.target === modalRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="upload_modal"
      ref={modalRef}
      onClick={closeModal}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-black dark:text-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium">Extensions</h3>
          <div className="mt-2 px-7 py-3">
            <div className="my-1 flex justify-start">
              <ul>
                <li>
                  <label className="flex flex-row mx-2">
                    <input className="mx-2" type="radio" />
                    <p>Test</p>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="upload_button"
              className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onClose}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionWindow;
