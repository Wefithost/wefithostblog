import Image from 'next/image';
import { usePopup } from '~/lib/utils/toggle-popups';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import pen from '~/public/icons/pen.svg';
import OptionPreview from '../../../[room_admin]/[category_admin]/[product_admin]/components/product-menu/product-menu/modify-options/edit-upholstery/option-preview';
import FileInput from '../../inputs/preview-inputs';
const EditCategory = (props: any) => {
   const {
      editCategory,
      editCategoryVisible,
      editCategoryRef,
      contentEdit,
      setContentEdit,
      directoryEdit,
      setDirectoryEdit,
      error,
      setError,
      handleEditCategory,
      sucessful,
      submitting,
      toggleEditCategory,

      file,
      fileInputRef,
      imageUrl,
      setImageUrl,
      handleFileChange,
      handleClick,
   } = props;
   const {
      isVisible: isPreviewsVisible,
      isActive: previews,
      ref: previewsRef,
      togglePopup: togglePreviews,
   } = usePopup();
   const editPreviewProps = {
      previews,
      isPreviewsVisible,
      previewsRef,
      imageUrl,
      togglePreviews,
      handleClick,
   };
   return (
      editCategory && (
         <>
            <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
               <div
                  className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                     editCategoryVisible ? '' : 'mid-popup-hidden'
                  }`}
               >
                  <div className="flex flex-col gap-3 items-center w-full">
                     <Image src={pen} alt="" className="w-12" />
                     <div>
                        <h1 className="text-2xl louize text-center">
                           Edit Product Category
                        </h1>
                     </div>
                  </div>
                  <div className="flex flex-col gap-3  w-full ">
                     <div className="flex flex-col gap-4 ">
                        <div className="flex flex-col gap-1 w-full ">
                           <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                              Content
                           </span>
                           <input
                              className={`h-[40px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full  duration-150  focus:rounded-sm  ${
                                 error === 'All  fields are required' &&
                                 !contentEdit
                                    ? 'border-red'
                                    : 'border-grey'
                              }`}
                              placeholder="Living room furniture"
                              type="text"
                              value={contentEdit}
                              required
                              onChange={(e) => {
                                 setContentEdit(e.target.value);
                                 setError('');
                              }}
                           />
                        </div>
                        <div className="flex flex-col gap-1 w-full ">
                           <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                              Directory
                           </span>
                           <input
                              className={`h-[40px] py-1 px-3 bg-white  text-black  text-sm  border  focus:ring-[1px]    ring-black  outline-none w-full  duration-150  focus:rounded-sm  ${
                                 error === 'All  fields are required' &&
                                 !directoryEdit
                                    ? 'border-red'
                                    : 'border-grey'
                              }`}
                              placeholder="Living"
                              type="text"
                              value={directoryEdit}
                              required
                              onChange={(e) => {
                                 setDirectoryEdit(e.target.value);
                                 setError('');
                              }}
                           />
                           <h1 className="text-[11px] neue-light text-grey">
                              *Shown on header for navigation
                           </h1>
                        </div>
                        <FileInput
                           label="Room preview"
                           togglePreview={togglePreviews}
                           imageUrl={imageUrl}
                           error={error}
                           submitting={submitting}
                           errorContent="All fields are required."
                           toggleChange={handleClick}
                           note="Shown on overlay for mobile screens"
                        />
                        <input
                           type="file"
                           accept="image/*"
                           onChange={handleFileChange}
                           ref={fileInputRef}
                           className="hidden"
                        />
                        {error && (
                           <h1 className="text-[11px] neue-light text-red text-center">
                              {error}
                           </h1>
                        )}
                        <div className="flex gap-3 ">
                           <button
                              className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  text-center w-[60%]"
                              onClick={handleEditCategory}
                           >
                              <span className=" text-white uppercase  text-xs  text-center">
                                 {sucessful ? (
                                    <Image src={check} alt="" className="w-6" />
                                 ) : submitting ? (
                                    <Image
                                       src={loader}
                                       alt=""
                                       className="w-6"
                                    />
                                 ) : (
                                    'Edit'
                                 )}
                              </span>
                           </button>
                           <button
                              className=" h-[40px]  px-2 rounded-md bg-green  duration-150 hover:ring hover:ring-[2px]  ring-green ring-offset-2  text-center w-[40%] text-white text-xs"
                              onClick={toggleEditCategory}
                           >
                              CANCEL
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <OptionPreview {...editPreviewProps} />
         </>
      )
   );
};

export default EditCategory;
