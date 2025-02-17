import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
  Transition,
} from "@headlessui/react";
import { Dispatch, Fragment, SetStateAction } from "react";

export default function LocaleButton({
  locale,
  setLocale,
}: {
  locale: string;
  setLocale: Dispatch<SetStateAction<string>>;
}) {
  const Global = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99998 3H8.99998C7.04998 8.84 7.04998 15.16 8.99998 21H7.99998"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 3C16.95 8.84 16.95 15.16 15 21"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 16V15C8.84 16.95 15.16 16.95 21 15V16"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 9.0001C8.84 7.0501 15.16 7.0501 21 9.0001"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className="flex items-center">
      <Menu as="div" className="relative inline-block text-left">
        <div className="hover:text-blue-500 flex items-center justify-center">
          <MenuButton aria-label="Locale switcher">
            <Global />
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="ring-opacity-5 absolute right-0 z-50 mt-2 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black focus:outline-hidden">
            <RadioGroup value={locale} onChange={setLocale}>
              <div className="p-1">
                <Radio value="en">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={`${
                          focus ? "bg-blue-600 text-white" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        English
                      </button>
                    )}
                  </MenuItem>
                </Radio>

                <Radio value="ko">
                  <MenuItem>
                    {({ focus }) => (
                      <button
                        className={`${
                          focus ? "bg-blue-600 text-white" : ""
                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                      >
                        한국어
                      </button>
                    )}
                  </MenuItem>
                </Radio>
              </div>
            </RadioGroup>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}
