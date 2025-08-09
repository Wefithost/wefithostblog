const Options = (props: any) => {
   const {
      productData,
      selectedOption,
      handleMouseEnter,
      handleMouseLeave,
      handleOptionClick,
      activeOption,
      isVisible,
      hideTimeout,
      setOptionId,
      setActiveIndex,
   } = props;
   return (
      <div className="flex items-center gap-3  relative">
         {productData?.options?.map((data: any, index: number) => (
            <div
               className={`w-6 h-6  ${
                  selectedOption === index &&
                  'ring  ring-offset-2 ring-lightGreen duration-150  '
               }`}
               key={data?._id}
               onMouseEnter={() => handleMouseEnter(index)}
               onMouseLeave={handleMouseLeave}
               onClick={() => {
                  handleOptionClick(index);
                  setActiveIndex(0);
                  setOptionId(data._id);
               }}
            >
               <img
                  src={data?.option_image}
                  className="w-full h-full  object-cover"
                  alt=""
               />
            </div>
         ))}
         {activeOption !== null && (
            <div
               className={`absolute top-[40px] left-0 w-[350px]    z-10 transition-all duration-300  flex bg-white  shadow-lg  lg:top-[50%]   lg:-translate-y-1/2  lg:left-[50%]  lg:-translate-x-1/2  lg:fixed dxs:w-[300px]    ${
                  isVisible ? ' opacity-100' : ' opacity-0 '
               }

      `}
               onMouseEnter={() => {
                  if (hideTimeout.current) {
                     clearTimeout(hideTimeout.current);
                     hideTimeout.current = null;
                  }
               }}
               onMouseLeave={handleMouseLeave}
            >
               <div className="flex gap-4  w-full  shrink-0 flex-col  pb-4  ">
                  <img
                     src={productData?.options[activeOption]?.option_image}
                     alt="option"
                     className="h-[120px]  w-full object-cover "
                  />
                  <div className="flex flex-col gap-3 px-4">
                     <h1 className="text-lg  text-darkGrey neue-light  uppercase ">
                        {productData?.options[activeOption]?.option}
                     </h1>
                     <div className="flex items-center gap-2 flex-wrap">
                        {productData?.options[activeOption]?.tags.map(
                           (tag: string, index: number) => (
                              <button
                                 className="px-4  py-1  bg-[#edece880] text-[10px]  rounded-full  capitalize neue-light "
                                 key={tag}
                              >
                                 {tag}
                              </button>
                           )
                        )}
                     </div>
                     <p className="text-[13px]  neue-light text-grey  leading-snug">
                        {productData?.options[activeOption]?.features}
                     </p>
                     {productData?.options[activeOption]?.care && (
                        <>
                           <h1 className="text-[13px]  neue-light text-grey  leading-none  tracking-wide ">
                              RECOMMENDED CARE:
                           </h1>
                           <p className="text-[13px]  neue-light text-grey  leading-snug">
                              {productData?.options[activeOption]?.care}
                           </p>
                        </>
                     )}

                     {productData?.options[activeOption]?.fabrics && (
                        <>
                           <h1 className="text-[13px]  neue-light text-grey  leading-none  tracking-wide ">
                              FABRIC CONTENT:
                           </h1>
                           <p className="text-[13px]  neue-light text-grey  leading-snug">
                              {productData?.options[activeOption]?.fabrics}
                           </p>
                        </>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Options;
