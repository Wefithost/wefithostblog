import Image from 'next/image';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import FileInput from '~/app/admin/products/components/inputs/preview-inputs';
import loader from '~/public/icons/loading-white.svg';
import check from '~/public/icons/check.svg';
const EditProduct = (props: any) => {
   const {
      editProduct,
      editProductVisible,
      firstViewVisible,
      secondViewVisible,
      error,
      setError,
      name,
      setName,
      price,
      setPrice,
      cancelledPrice,
      setCancelledPrice,
      toggleFirstView,
      firstViewImageUrl,
      submitting,
      handleFirstViewClick,
      toggleSecondView,
      secondViewImageUrl,
      handleSecondViewClick,
      upholstery,
      setUpholstery,
      toggleEditProduct,
      sucessful,
      handleEditProduct,
   } = props;
   return (
      editProduct && (
         <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
            <div
               className={`w-[350px]     mid-popup   duration-300 ease-in-out flex flex-col py-4 px-6  gap-4   rounded-lg bg-greyGreen  items-center      ${
                  editProductVisible ? '' : 'mid-popup-hidden'
               }  ${firstViewVisible ? ' brightness-75' : ' brightness-100'}  ${
                  secondViewVisible ? ' brightness-75' : ' brightness-100'
               }`}
            >
               <div className="flex flex-col gap-2 items-center">
                  <h1 className="text-2xl louize text-center">Edit Product</h1>
               </div>
               <div className="flex flex-col gap-2 w-full">
                  <ClassicInput
                     label="name"
                     errorContent="All fields are required."
                     setError={setError}
                     setValue={setName}
                     value={name}
                     placeholder="Coburn sofa"
                     error={error}
                  />
                  <ClassicInput
                     label="price (₦)"
                     errorContent="All fields are required."
                     setError={setError}
                     setValue={setPrice}
                     value={price}
                     inputType="number"
                     placeholder="400.00"
                     error={error}
                  />
                  <ClassicInput
                     label="Discount price (₦)"
                     errorContent="All fields are required."
                     setError={setError}
                     setValue={setCancelledPrice}
                     value={cancelledPrice}
                     inputType="number"
                     placeholder="400.88"
                     error={error}
                  />

                  <FileInput
                     label="First view"
                     togglePreview={toggleFirstView}
                     imageUrl={firstViewImageUrl}
                     error={error}
                     submitting={submitting}
                     errorContent="All fields are required."
                     toggleChange={handleFirstViewClick}
                     note="The first view of the product"
                  />
                  <FileInput
                     label="second view"
                     togglePreview={toggleSecondView}
                     imageUrl={secondViewImageUrl}
                     error={error}
                     submitting={submitting}
                     errorContent="All fields are required."
                     toggleChange={handleSecondViewClick}
                     note="The second view of the product, triggers on hover"
                  />
               </div>
               {error && (
                  <h1 className="text-[11px] neue-light text-red text-center">
                     {error}
                  </h1>
               )}
               <div className="flex items-center gap-2  pt-3 w-full">
                  <button
                     className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  text-center w-[60%]"
                     onClick={handleEditProduct}
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
                        toggleEditProduct();
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

export default EditProduct;
