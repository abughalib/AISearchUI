interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesWindow: React.FC<ModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
      id="upload_modal"
      onClick={onClose}
    >
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-black dark:text-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium">Preferences</h3>
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
        </div>
      </div>
    </div>
  );
};

export default PreferencesWindow;