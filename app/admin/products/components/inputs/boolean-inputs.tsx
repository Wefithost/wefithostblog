type booleanInputs = {
   header: string;
   state: string | number | boolean;
   setState: React.Dispatch<React.SetStateAction<string | number | boolean>>;
   firstChoice: string | number | boolean;
   secondChoice: string | number | boolean;
   thirdChoice?: string | number | boolean | any;
   setFirstCleanup?: React.Dispatch<
      React.SetStateAction<string | number | boolean>
   >;
   setFirstCleanupValue?: any;
   setSecondCleanupValue?: any;
   setSecondCleanup?: React.Dispatch<
      React.SetStateAction<string | number | boolean>
   >;
   setThirdCleanup?: React.Dispatch<
      React.SetStateAction<string | number | boolean>
   >;
   setThirdCleanupValue?: any;
   setError?: React.Dispatch<React.SetStateAction<string>>;
};
const BooleanInputs = ({
   header,
   state,
   setState,
   firstChoice,
   secondChoice,
   thirdChoice,
   setFirstCleanup,
   setSecondCleanup,
   setError,
   setFirstCleanupValue,
   setSecondCleanupValue,
   setThirdCleanup,
   setThirdCleanupValue,
}: booleanInputs) => {
   return (
      <div className="flex gap-2 flex-col ">
         <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
            {header}:<span className="neue text-xs"> {state.toString()}</span>
         </span>
         <div className="flex w-full gap-2">
            <button
               className={`  gap-2  h-[35px]  px-2    duration-150    w-[50%]  uppercase  text-[11px]  text-center capitalize ${
                  state === firstChoice
                     ? 'bg-softGreen  text-white '
                     : ' bg-white  text-grey   ring-grey  border border-grey hover:ring-[1px] hover:ring     ring-offset-[1px]'
               }`}
               onClick={() => {
                  setState(firstChoice);
                  setFirstCleanup?.(setSecondCleanupValue);
                  setError?.('');
               }}
            >
               {firstChoice.toString()}
            </button>
            <button
               className={`  gap-2  h-[35px]  px-2    duration-150    w-[50%]  uppercase  text-[11px]    text-center capitalize ${
                  state === secondChoice
                     ? 'bg-softGreen  text-white ring-softGreen'
                     : ' bg-white  text-grey   ring-grey  border border-grey hover:ring-[1px] hover:ring     ring-offset-[1px]'
               }`}
               onClick={() => {
                  setState(secondChoice);
                  setSecondCleanup?.(setFirstCleanupValue);
                  setError?.('');
               }}
            >
               {secondChoice.toString()}
            </button>
            {thirdChoice && (
               <button
                  className={`  gap-2  h-[35px]  px-2    duration-150    w-[50%]  uppercase  text-[11px]  text-center capitalize ${
                     state === thirdChoice
                        ? 'bg-softGreen  text-white '
                        : ' bg-white  text-grey   ring-grey  border border-grey hover:ring-[1px] hover:ring     ring-offset-[1px]'
                  }`}
                  onClick={() => {
                     setState?.(thirdChoice);
                     setThirdCleanup?.(setThirdCleanupValue);
                     setError?.('');
                  }}
               >
                  {thirdChoice.toString()}
               </button>
            )}
         </div>
      </div>
   );
};

export default BooleanInputs;
