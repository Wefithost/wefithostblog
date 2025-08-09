import Image from 'next/image';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import dimensionIcon from '~/public/icons/dimension.svg';
const SetDimensions = (props: any) => {
   const {
      setDimensions,
      isSetDimensionsVisible,
      setDimensionsRef,
      error,
      setError,
      submitting,
      sucessful,
      width,
      setWidth,
      weight,
      setWeight,
      height,
      setHeight,
      depth,
      setDepth,
      armHeight,
      setArmHeight,
      seatBackHeight,
      setSeatBackHeight,
      seatDepth,
      setSeatDepth,
      seatHeight,
      setSeatHeight,
      toggleSetDimensions,
      handleSetDimensions,
   } = props;
   return (
      setDimensions && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  isSetDimensionsVisible ? '' : 'mid-popup-hidden'
               }`}
               ref={setDimensionsRef}
            >
               <div className="flex items-center flex-col gap-0">
                  <Image className="w-20" alt="" src={dimensionIcon} />
                  <h1 className="text-2xl louize text-center">
                     Set Product Dimensions
                  </h1>
               </div>
               <div className="flex flex-col gap-2 w-full ">
                  <div className="w-full  flex gap-2">
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Width (")'
                        value={width}
                        setValue={setWidth}
                        placeholder='139"'
                        errorContent="Width, Depth and Height are all required"
                        inputType="number"
                     />
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Height (")'
                        value={height}
                        setValue={setHeight}
                        placeholder='39"'
                        errorContent="Width, Depth and Height are all required"
                        inputType="number"
                     />
                  </div>
                  <div className="w-full  flex gap-2">
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Depth (")'
                        value={depth}
                        setValue={setDepth}
                        placeholder='44"'
                        errorContent="Width, Depth and Height are all required"
                        inputType="number"
                     />
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label="Weight (lbs)"
                        value={weight}
                        setValue={setWeight}
                        placeholder="432 LBS"
                        inputType="number"
                     />
                  </div>
                  <div className="w-full  flex gap-2">
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Seat Back Height (")'
                        value={seatBackHeight}
                        setValue={setSeatBackHeight}
                        placeholder='17"'
                        inputType="number"
                     />
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Seat Depth (")'
                        value={seatDepth}
                        setValue={setSeatDepth}
                        placeholder='26"'
                        inputType="number"
                     />
                  </div>
                  <div className="w-full  flex gap-2">
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Seat Height (")'
                        value={seatHeight}
                        setValue={setSeatHeight}
                        placeholder='25"'
                        inputType="number"
                     />
                     <ClassicInput
                        error={error}
                        setError={setError}
                        label='Arm Height (")'
                        value={armHeight}
                        setValue={setArmHeight}
                        placeholder='17"'
                        inputType="number"
                     />
                  </div>
               </div>
               {error && (
                  <h1 className="text-[11px] neue-light text-red text-center">
                     {error}
                  </h1>
               )}

               <div className="flex items-center gap-2  w-full">
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-[1px]  text-center w-[60%]"
                     onClick={handleSetDimensions}
                  >
                     <span className=" text-white uppercase  text-xs  text-center">
                        {sucessful ? (
                           <Image src={check} alt="" className="w-6" />
                        ) : submitting ? (
                           <Image src={loader} alt="" className="w-6" />
                        ) : (
                           'Set'
                        )}
                     </span>
                  </button>
                  <button
                     onClick={() => {
                        toggleSetDimensions();
                        setError('');
                     }}
                     disabled={submitting}
                     className="bg-grey   text-white px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300  gap-1 neue-light  text-xs w-[40%] "
                  >
                     CANCEL
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default SetDimensions;
