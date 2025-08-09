import ClassicInput from '~/app/admin/products/components/inputs/classic-input';

const OptionFeaturesPreview = (props: any) => {
   const {
      features,
      isFeaturesVisible,
      featuresRef,
      feature,
      featuresError,
      setFeaturesError,
      setFeature,
      setFeatures,
      fabrics,
      setFabrics,
      toggleFeatures,
      care,
      setCare,
   } = props;
   return (
      features && (
         <div
            className={`w-[280px]         duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center   top-[50%]    -translate-y-1/2   left-[50%]   -translate-x-1/2   fixed shadow-custom  z-[1003]      ${
               isFeaturesVisible ? ' opacity-100' : ' opacity-0 '
            }`}
            ref={featuresRef}
         >
            <div className="flex flex-col gap-3 w-full">
               <ClassicInput
                  value={feature}
                  setValue={setFeature}
                  error={featuresError}
                  setError={setFeaturesError}
                  errorContent="All fields are required"
                  placeholder='"Woven with minimal texture, classic weave fabrics ele...'
                  label="Features"
                  textarea={true}
               />
               <ClassicInput
                  value={fabrics}
                  setValue={setFabrics}
                  error={featuresError}
                  setError={setFeaturesError}
                  placeholder='"92% POLYESTER, 8% LINEN'
                  errorContent="All fields are required"
                  textarea
                  label="Fabrics"
               />
               <div className="flex gap-2 flex-col ">
                  <ClassicInput
                     value={care}
                     setValue={setCare}
                     label="Care"
                     placeholder="To help prevent fabrics from fading over ti..."
                     textarea
                     errorContent="At least a care for the option is required"
                     error={featuresError}
                     setError={setFeaturesError}
                  />
               </div>
               <h1 className="text-[11px] neue-light text-red">
                  {featuresError}
               </h1>
               <div className="flex gap-3">
                  <button
                     onClick={setFeatures}
                     className="bg-softGreen  text-white px-4 h-[40px]  rounded-md  hover:ring-[2px]  hover:ring-offset-1  ring-softGreen  duration-300 flex items-center gap-1 neue-light  text-sm  justify-center   w-[60%]"
                  >
                     <span>Set</span>
                  </button>
                  <button
                     onClick={() => {
                        toggleFeatures();
                        setFabrics('');
                        setFeature('');
                        setCare('');
                        setFeaturesError('');
                     }}
                     className="bg-white ring-[1px]      text-grey  px-4 h-[40px]  rounded-md  hover:ring-[2px] hover:ring-offset-1  ring-grey   duration-300 flex items-center gap-1 neue-light  text-sm w-[40%] justify-center   "
                  >
                     Cancel
                  </button>
               </div>
            </div>
         </div>
      )
   );
};

export default OptionFeaturesPreview;
