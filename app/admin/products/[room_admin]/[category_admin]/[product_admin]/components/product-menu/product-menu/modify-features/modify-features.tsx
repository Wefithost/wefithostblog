import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import BooleanInputs from '~/app/admin/products/components/inputs/boolean-inputs';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import { usePopup } from '~/lib/utils/toggle-popups';
import featuresIcon from '~/public/icons/features.svg';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import { apiRequest } from '~/lib/utils/api-request';
import { Accordion } from '../../../features-accordion/accordion';
const ModifyFeatures = (props: any) => {
   const { productData } = props;
   const accordionProps = { productData };
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      isVisible: isSetFeaturesVisible,
      isActive: setFeatures,
      ref: setFeaturesRef,
      togglePopup: toggleSetFeatures,
   } = usePopup();
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const [feature, setFeature] = useState('');

   const [type, setType] = useState<string | number | boolean>('Lists');
   const [sentence, setSentence] = useState<string | number | boolean>('');
   const [lists, setLists] = useState<any>([]);
   const [listInput, setListInput] = useState<string>('');

   const handleAddList = () => {
      const newItems = listInput
         .split('\n') // Split input by new lines
         .map((item) => item.trim()) // Trim spaces
         .filter((item) => item.length > 0 && !lists.includes(item)); // Remove empty & duplicate entries

      if (newItems.length > 0) {
         setLists([...lists, ...newItems]);
         setListInput(''); // Clear input after adding
      }
   };

   const handleRemoveList = (index: number) => {
      setLists(lists.filter((_: any, i: any) => i !== index));
   };

   const handleSetFeatures = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = type === 'Lists' ? !feature : !feature || !sentence;
      const checkArray = type === 'Lists' ? lists.length === 0 : false;

      if (check) {
         setError('All fields are required');
         return;
      }

      if (checkArray) {
         setError('At least a list is required');
         return;
      }

      setSubmitting(true);
      setError('');
      await apiRequest({
         url: '/api/admin/set-product-features',
         method: 'POST',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            typeId: type_products,
            productId: product_admin,
            feature: feature,
            lists: lists,
            content: sentence,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setFeature('');
            setSentence('');
            setLists([]);
         },
         onError: (error) => {
            setError(error);
         },
         onFinally: () => {
            setSubmitting(false);
            setTimeout(() => setSucessful(false), 2000);
         },
      });
   };
   return (
      <div className="flex flex-col w-full gap-2 py-3 px-4 items-start lg:px-0">
         {productData?.features.length > 0 && <Accordion {...accordionProps} />}

         <button
            className="bg-softGreen py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-softGreen duration-150  self-end mt-6"
            onClick={toggleSetFeatures}
         >
            Add Product Features
         </button>

         {setFeatures && (
            <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0 ">
               <div
                  className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                     isSetFeaturesVisible ? '' : 'mid-popup-hidden'
                  }`}
                  ref={setFeaturesRef}
               >
                  <div className="flex items-center flex-col gap-2 w-full">
                     <Image className="w-10" alt="" src={featuresIcon} />

                     <h1 className="text-2xl louize text-center">
                        Add Product Features
                     </h1>
                  </div>
                  <div className="flex w-full flex-col gap-4">
                     <ClassicInput
                        error={error}
                        errorContent="All fields are required"
                        value={feature}
                        setValue={setFeature}
                        label="Feature"
                        placeholder={type === 'Lists' ? 'Details' : 'Story'}
                        note="Product details"
                     />

                     <BooleanInputs
                        header="Feature type"
                        firstChoice={'Lists'}
                        secondChoice={'Sentence'}
                        setError={setError}
                        state={type}
                        setFirstCleanup={setSentence}
                        setFirstCleanupValue={[]}
                        setSecondCleanupValue={''}
                        setSecondCleanup={setLists}
                        setState={setType}
                     />
                     {type === 'Lists' ? (
                        <div className="flex gap-2 flex-col ">
                           <div className="flex items-center gap-2 flex-wrap  max-h-[200px] overflow-y-auto">
                              {lists.length > 0 &&
                                 lists?.map((care: any, index: number) => (
                                    <div
                                       className=" flex items-center gap-2 px-2  py-1  bg-lightGrey text-[10px]   rounded-sm   capitalize neue-light text-darkGrey "
                                       key={care}
                                    >
                                       <span className="line-clamp-1">
                                          {care}
                                       </span>
                                       <button
                                          onClick={() =>
                                             handleRemoveList(index)
                                          }
                                       >
                                          x
                                       </button>
                                    </div>
                                 ))}
                           </div>
                           <div className="flex gap-2 items-end  ">
                              <ClassicInput
                                 value={listInput}
                                 setValue={setListInput}
                                 placeholder="Sofa is made up of: 1 Left Arm Recliner, 1 Armless Recliner, and..."
                                 errorContent="At least a list is required"
                                 error={error}
                                 setError={setError}
                                 textarea
                              />
                              <button
                                 onClick={handleAddList}
                                 className="shrink-0 bg-softGreen  text-xs text-white  px-2  rounded hover:ring hover:ring-[2px] ring-offset-[1px]  duration-150 ring-softGreen h-[30px] w-[40px] shrink-none"
                              >
                                 Add
                              </button>
                           </div>
                        </div>
                     ) : (
                        <ClassicInput
                           error={error}
                           errorContent="All fields are required"
                           value={sentence}
                           setValue={setSentence}
                           label="Content"
                           placeholder="With contemporary silhouettes and uncomplicated styling, the modular piece..."
                           textarea
                        />
                     )}
                  </div>
                  {error && (
                     <h1 className="text-[11px] neue-light text-red text-center">
                        {error}
                     </h1>
                  )}
                  <div className="flex items-center gap-2  w-full">
                     <button
                        className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-[1px]  text-center w-[60%]"
                        onClick={handleSetFeatures}
                     >
                        <span className=" text-white uppercase  text-xs  text-center">
                           {sucessful ? (
                              <Image src={check} alt="" className="w-6" />
                           ) : submitting ? (
                              <Image src={loader} alt="" className="w-6" />
                           ) : (
                              'Add'
                           )}
                        </span>
                     </button>
                     <button
                        onClick={() => {
                           toggleSetFeatures();
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
         )}
      </div>
   );
};

export default ModifyFeatures;
