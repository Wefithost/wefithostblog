type InputProps = {
   value: any;
   setValue: React.Dispatch<React.SetStateAction<any>>;
   error?: string;
   label?: string;
   errorContent?: string;
   name?: string;
   inputType?: string;
   placeholder?: string;
   setError?: React.Dispatch<React.SetStateAction<string>>;
   note?: string;
   textarea?: boolean;
   except?: boolean;
   autocomplete?: 'on' | 'off';
   autofocus?: boolean;
};
const ClassicInput = ({
   value,
   error,
   setValue,
   setError,
   errorContent,
   placeholder,
   inputType = 'text',
   label,
   note,
   name,
   textarea = false,
   except,
   autocomplete = 'on',
   autofocus = false,
}: InputProps) => {
   return (
      <div className="flex flex-col gap-1 w-full ">
         {label && (
            <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
               {label}
            </span>
         )}
         {!textarea && (
            <input
               className={`h-[40px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full  duration-150  focus:rounded-sm  ${
                  error === errorContent && (!value || except)
                     ? 'border-red'
                     : 'border-grey'
               }`}
               placeholder={placeholder}
               type={inputType}
               value={value}
               name={name}
               autoFocus={autofocus}
               required
               autoComplete={autocomplete}
               onChange={(e) => {
                  setValue(e.target.value);
                  setError?.('');
               }}
            />
         )}

         {textarea && (
            <textarea
               className={`min-h-[50px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full  duration-150  focus:rounded-sm  ${
                  error === errorContent && !value
                     ? 'border-red'
                     : 'border-grey'
               }`}
               placeholder={placeholder}
               value={value}
               required
               onChange={(e) => {
                  setValue(e.target.value);
                  setError?.('');
               }}
            />
         )}

         {note && <h1 className="text-[11px] neue-light text-grey">*{note}</h1>}
      </div>
   );
};

export default ClassicInput;
