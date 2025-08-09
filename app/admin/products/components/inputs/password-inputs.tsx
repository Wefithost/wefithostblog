import Image from 'next/image';
import eye from '~/public/icons/eye.svg';
import eyeoff from '~/public/icons/eye-off.svg';

type InputProps = {
   value: any;
   setValue: React.Dispatch<React.SetStateAction<any>>;
   togglePassword: () => void;
   visibility: boolean;
   error?: string;
   incorrect?: boolean;
   setIncorrect?: React.Dispatch<React.SetStateAction<boolean>>;
   label?: string;
   errorContent?: string;
   name?: string;
   inputType?: string;
   placeholder?: string;
   setError?: React.Dispatch<React.SetStateAction<string>>;
   note?: string;
   autocomplete?: 'on' | 'off';
};
const PasswordInput = ({
   value,
   error,
   setValue,
   setError,
   errorContent,
   placeholder,
   inputType = 'text',
   togglePassword,
   label,
   note,
   visibility,
   name,
   autocomplete = 'on',
   incorrect,
   setIncorrect,
}: InputProps) => {
   return (
      <div className="flex flex-col gap-1 w-full ">
         {label && (
            <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
               {label}
            </span>
         )}
         <div className="flex flex-col gap-1 w-full ">
            <div className="relative w-full flex items-center justify-center">
               <input
                  className={`h-[40px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full border-grey duration-150  focus:rounded-sm   ${
                     error === errorContent && !value
                        ? 'border-red'
                        : 'border-grey'
                  }   ${incorrect && 'border-red'}`}
                  autoComplete={autocomplete}
                  required
                  type={visibility ? 'text' : 'password'}
                  placeholder={placeholder}
                  name={name}
                  value={value}
                  onChange={(e) => {
                     setValue(e.target.value);
                     setError?.('');
                     setIncorrect?.(false);
                  }}
               />
               <Image
                  src={visibility ? eyeoff : eye}
                  alt=""
                  className="w-5 absolute  right-2 cursor-pointer "
                  onClick={togglePassword}
               />
            </div>
         </div>

         {note && <h1 className="text-[11px] neue-light text-grey">*{note}</h1>}
      </div>
   );
};

export default PasswordInput;
