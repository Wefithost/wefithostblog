import Image from 'next/image';
import { useParams } from 'next/navigation';
import featuresIcon from '~/public/icons/features.svg';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import { useState } from 'react';
import { apiRequest } from '~/lib/utils/api-request';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import BooleanInputs from '~/app/admin/products/components/inputs/boolean-inputs';

const EditFeature = (props: any) => {
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      editFeatures,
      isEditFeaturesVisible,
      editFeaturesRef,
      editType,
      feature,
      editSentence,
      editLists,
      featureId,
      setEditLists,
      toggleEditFeatures,
      setEditSentence,
      setFeature,
      setEditType,
      editListInput,
      setEditListInput,
      handleAddList,
      handleRemoveList,
   } = props;
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [submitting, setSubmitting] = useState(false);
   const handleEditFeatures = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      const check = editType === 'Lists' ? !feature : !feature || !editSentence;
      const checkArray = editType === 'Lists' ? editLists?.length === 0 : false;

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
         url: '/api/admin/edit-product-feature',
         method: 'POST',
         body: {
            furnitureId: room_admin,
            groupId: category_admin,
            typeId: type_products,
            productId: product_admin,
            feature: feature,
            lists: editLists,
            content: editSentence,
            featureId,
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setTimeout(() => toggleEditFeatures(), 1000);
            setEditSentence('');
            setEditLists([]);
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
      editFeatures && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  isEditFeaturesVisible ? '' : 'mid-popup-hidden'
               }`}
               ref={editFeaturesRef}
            >
               <div className="flex items-center flex-col gap-2 w-full">
                  <Image className="w-10" alt="" src={featuresIcon} />

                  <h1 className="text-2xl louize text-center">
                     Edit Product Feature
                  </h1>
               </div>
               <div className="flex w-full flex-col gap-4">
                  <ClassicInput
                     error={error}
                     errorContent="All fields are required"
                     value={feature}
                     setValue={setFeature}
                     label="Feature"
                     placeholder={editType === 'Lists' ? 'Details' : 'Story'}
                     note="Product details"
                  />

                  <BooleanInputs
                     header="Feature type"
                     firstChoice={'Lists'}
                     secondChoice={'Sentence'}
                     setError={setError}
                     state={editType}
                     setFirstCleanup={setEditSentence}
                     setFirstCleanupValue={[]}
                     setSecondCleanupValue={''}
                     setSecondCleanup={setEditLists}
                     setState={setEditType}
                  />
                  {editType === 'Lists' ? (
                     <div className="flex gap-2 flex-col ">
                        <div className="flex items-center gap-2 flex-wrap max-h-[200px] overflow-y-auto">
                           {editLists.length > 0 &&
                              editLists?.map((care: any, index: number) => (
                                 <div
                                    className=" flex items-center gap-2 px-2  py-1  bg-lightGrey text-[10px]   rounded-sm   capitalize neue-light text-darkGrey "
                                    key={care}
                                 >
                                    <span className="line-clamp-1">{care}</span>
                                    <button
                                       onClick={() => handleRemoveList(index)}
                                    >
                                       x
                                    </button>
                                 </div>
                              ))}
                        </div>
                        <div className="flex gap-2 items-end  ">
                           <ClassicInput
                              value={editListInput}
                              setValue={setEditListInput}
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
                        value={editSentence}
                        setValue={setEditSentence}
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
                     onClick={handleEditFeatures}
                  >
                     <span className=" text-white uppercase  text-xs  text-center">
                        {sucessful ? (
                           <Image src={check} alt="" className="w-6" />
                        ) : submitting ? (
                           <Image src={loader} alt="" className="w-6" />
                        ) : (
                           'Edit'
                        )}
                     </span>
                  </button>
                  <button
                     onClick={() => {
                        toggleEditFeatures();
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

export default EditFeature;
