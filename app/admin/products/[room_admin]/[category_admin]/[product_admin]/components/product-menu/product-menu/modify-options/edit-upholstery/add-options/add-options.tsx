import Image from 'next/image';
import BooleanInputs from '~/app/admin/products/components/inputs/boolean-inputs';
import check from '~/public/icons/check.svg';
import loader from '~/public/icons/loading-white.svg';
import ClassicInput from '~/app/admin/products/components/inputs/classic-input';
import FileInput from '~/app/admin/products/components/inputs/preview-inputs';
import { usePopup } from '~/lib/utils/toggle-popups';
import { useRef, useState } from 'react';
import OptionFeatures from './option-features';
import OptionFeaturesPreview from './option-features-preview';
import OptionProducts from './option-products';
import OptionProductsPreviews from './options-products-previews';
import { apiRequest } from '~/lib/utils/api-request';
import OptionPreview from '../option-preview';
import { useParams } from 'next/navigation';
const AddOptions = (props: any) => {
   const { isAddOptionVisible, addOption, toggleAddOption } = props;
   const { room_admin, category_admin, type_products, product_admin } =
      useParams();
   const {
      isVisible: isPreviewsVisible,
      isActive: previews,
      ref: previewsRef,
      togglePopup: togglePreviews,
   } = usePopup();

   const [submitting, setSubmitting] = useState(false);
   const [error, setError] = useState('');
   const [sucessful, setSucessful] = useState(false);
   const [restockDate, setRestockDate] = useState('');
   const [stockCount, setStockCount] = useState(0);
   const [optionName, setOptionName] = useState('');
   const [inStock, setInStock] = useState<string | number | boolean>(true);
   const [tags, setTags] = useState<string[]>([]);
   const [tagInput, setTagInput] = useState<string>('');

   const handleAddTag = () => {
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
         setTags([...tags, tagInput.trim()]);
         setError('');
         setTagInput('');
      }
   };

   const handleRemoveTag = (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
      setError('');
   };

   const [care, setCare] = useState<string>('');

   const [file, setFile] = useState<File | null>(null);
   const [imageUrl, setImageUrl] = useState<string | null>(null);
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      const selectedFile = e.target.files?.[0];

      if (selectedFile) {
         setFile(selectedFile);

         const reader = new FileReader();
         reader.onloadend = () => {
            setImageUrl(reader.result as string);
         };
         reader.readAsDataURL(selectedFile);
      }

      if (fileInputRef.current) {
         fileInputRef.current.value = '';
      }
   };
   const fileInputRef = useRef<HTMLInputElement | null>(null);

   const handleClick: any = () => {
      if (fileInputRef.current) {
         fileInputRef.current.click();
      }
   };
   const [feature, setFeature] = useState('');
   const [fabrics, setFabrics] = useState('');
   const featuresCheck = feature !== '' && fabrics !== '';
   const [files, setFiles] = useState<File[]>([]);
   const [imageUrls, setImageUrls] = useState<string[]>([]);
   const filesInputRef = useRef<HTMLInputElement | null>(null);
   const productsOptionCheck = imageUrls.length > 0;

   const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setError('');
      const selectedFiles = e.target.files;

      if (selectedFiles && selectedFiles.length > 0) {
         const fileArray = Array.from(selectedFiles);
         const urlPromises = fileArray.map(
            (file) =>
               new Promise<string>((resolve) => {
                  const reader = new FileReader();
                  reader.onloadend = () => resolve(reader.result as string);
                  reader.readAsDataURL(file);
               })
         );

         Promise.all(urlPromises)
            .then((urls) => {
               setImageUrls((prevUrls) => [...prevUrls, ...urls]);
               setFiles((prevFiles) => [...prevFiles, ...fileArray]);
            })
            .catch((error) => console.error('Error loading files', error));
      }

      if (filesInputRef.current) {
         filesInputRef.current.value = '';
      }
   };

   const handleRemove = (index: number) => {
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
      setImageUrls((prevUrls) => prevUrls.filter((_, i) => i !== index));
   };

   const handleFilesClick = () => {
      if (filesInputRef.current) {
         filesInputRef.current.click();
      }
   };

   const {
      isVisible: isFeaturesVisible,
      isActive: features,
      ref: featuresRef,
      togglePopup: toggleFeatures,
   } = usePopup();
   const {
      isVisible: isProductPreviewsVisible,
      isActive: productPreviews,
      ref: productPreviewsRef,
      togglePopup: toggleProductPreviews,
   } = usePopup();
   const [featuresError, setFeaturesError] = useState('');

   const setFeatures = () => {
      if (!featuresCheck) {
         setFeaturesError('All fields are required');
         return;
      }
      if (!care) {
         setFeaturesError('At least a care for the option is required');
         return;
      }
      toggleFeatures();
   };

   const optionFeaturesProps = {
      featuresCheck,
      toggleFeatures,
      error,
      isFeaturesVisible,
      submitting,
   };

   const optionFeaturesPreviewProps = {
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
   };
   const optionProductsProps = {
      toggleProductPreviews,
      productsOptionCheck,
      error,
      isProductPreviewsVisible,
      submitting,
   };

   const optionProductsPreviews = {
      productPreviews,
      isProductPreviewsVisible,
      productPreviewsRef,
      productsOptionCheck,
      imageUrls,
      handleRemove,
      toggleProductPreviews,
      handleFilesClick,
      setImageUrls,
      submitting,
      setFiles,
   };

   const handleAddOption = async (e: any) => {
      e.preventDefault();
      if (submitting) return;
      setError('');
      let check;
      if (inStock) {
         check = !(optionName && imageUrl && stockCount > 0);
      } else {
         check = !(optionName && imageUrl && restockDate);
      }

      const checkArrays = !(imageUrls.length > 0);

      if (check || checkArrays) {
         setError('All fields are required');
         return;
      }

      setSubmitting(true);
      const formData = new FormData();
      formData.append('optionPreview', file as any);
      files.forEach((file, index) => {
         formData.append(`optionProductsPreviews[${index}]`, file);
      });
      tags.forEach((tag, index) => {
         formData.append(`tags[${index}]`, tag);
      });
      formData.append('optionName', optionName);
      formData.append('care', care);
      formData.append('feature', feature);
      formData.append('fabrics', fabrics);
      formData.append('groupId', category_admin as any);
      formData.append('furntureId', room_admin as any);
      formData.append('typeId', type_products as any);
      formData.append('productId', product_admin as any);
      formData.append('inStock', inStock as any);
      formData.append('stockCount', stockCount as any);
      formData.append('restockDate', restockDate);

      await apiRequest({
         url: '/api/admin/create-option',
         method: 'POST',
         body: formData,
         headers: {
            'Content-Type': 'multipart/form-data',
         },
         onSuccess: () => {
            window.dispatchEvent(new CustomEvent('productFetched'));
            setSucessful(true);
            setImageUrl(null);
            setFiles([]);
            setFile(null);
            setImageUrls([]);
            setTags([]);
            setOptionName('');
            setCare('');
            setFeature('');
            setFabrics('');
            setStockCount(0);
            setRestockDate('');
            setTimeout(() => toggleAddOption(), 1000);
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

   const optionPreviewProps = {
      previews,
      isPreviewsVisible,
      previewsRef,
      imageUrl,
      togglePreviews,
      handleClick,
   };
   return (
      <>
         {addOption && (
            <div className="fixed bottom-[0px]  h-full w-full  z-50 left-0 flex  justify-center  items-center        backdrop-brightness-50  px-8     xs:px-0">
               <div
                  className={`w-[300px]         duration-300 ease-in-out flex flex-col py-6 px-6  gap-4   rounded-lg bg-greyGreen  items-center   mid-popup     ${
                     isAddOptionVisible ? '' : 'mid-popup-hidden'
                  }  ${
                     isPreviewsVisible ? ' brightness-75' : ' brightness-100'
                  }  ${
                     isFeaturesVisible ? ' brightness-75' : ' brightness-100'
                  }   ${
                     isProductPreviewsVisible
                        ? ' brightness-75'
                        : ' brightness-100'
                  }`}
               >
                  <div className="flex w-full flex-col gap-3">
                     <ClassicInput
                        value={optionName}
                        setValue={setOptionName}
                        label="Option"
                        error={error}
                        errorContent="All fields are required"
                        setError={setError}
                        placeholder="Option name"
                     />
                     <div className="flex flex-col gap-1  w-full ">
                        <FileInput
                           label="Upholstery preview"
                           togglePreview={togglePreviews}
                           imageUrl={imageUrl}
                           error={error}
                           submitting={submitting}
                           errorContent="All fields are required"
                           toggleChange={handleClick}
                           note="The preview of the upholstery"
                        />
                     </div>

                     <OptionProducts {...optionProductsProps} />

                     <OptionFeatures {...optionFeaturesProps} />
                     <div className="flex flex-col gap-3  w-full ">
                        <div className="flex gap-2 flex-col ">
                           <div className="flex items-center gap-2 flex-wrap">
                              {tags.map((tag: any, index: number) => (
                                 <div
                                    className=" flex items-center gap-2 px-2  py-1  bg-lightGrey text-xs   rounded-full  capitalize neue-light text-darkGrey"
                                    key={tag}
                                 >
                                    <span>{tag}</span>
                                    <button
                                       onClick={() => handleRemoveTag(index)}
                                    >
                                       x
                                    </button>
                                 </div>
                              ))}
                           </div>
                           <div className="flex gap-2  ">
                              <ClassicInput
                                 value={tagInput}
                                 setValue={setTagInput}
                                 placeholder="Classic"
                                 error={error}
                                 setError={setError}
                              />
                              <button
                                 onClick={handleAddTag}
                                 className="shrink-0 bg-softGreen  text-xs text-white  px-2  rounded hover:ring hover:ring-[2px] ring-offset-[1px]  duration-150 ring-softGreen"
                              >
                                 Add Tag
                              </button>
                           </div>
                        </div>
                        <BooleanInputs
                           header="In stock"
                           firstChoice={true}
                           secondChoice={false}
                           state={inStock}
                           setState={setInStock}
                        />
                        {inStock && (
                           <div className="flex flex-col gap-1 w-full">
                              <span className="text-[11px]    neue    text-darkGrey  neue-light uppercase">
                                 No. Of Stocks available:
                              </span>
                              <ClassicInput
                                 inputType="number"
                                 value={stockCount}
                                 setValue={setStockCount}
                                 error={error}
                                 setError={setError}
                                 errorContent="All fields are required"
                              />
                           </div>
                        )}
                        {!inStock && (
                           <div className="flex flex-col gap-1 w-full">
                              <span className="text-xs    neue    text-darkGrey  neue-light uppercase">
                                 When in stock:
                              </span>
                              <ClassicInput
                                 inputType="date"
                                 value={restockDate}
                                 setValue={setRestockDate}
                                 errorContent="All fields are required"
                                 error={error}
                                 setError={setError}
                              />
                           </div>
                        )}
                        {error && (
                           <h1 className="text-[11px] neue-light text-red text-center">
                              {error}
                           </h1>
                        )}

                        <div className="flex items-center gap-2  pt-3">
                           <button
                              className="flex items-center justify-center  gap-2  h-[40px]  px-2 rounded-md bg-softGreen  duration-150 hover:ring hover:ring-[2px]  ring-softGreen ring-offset-2  text-center w-[60%]"
                              onClick={handleAddOption}
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
                                    'Create '
                                 )}
                              </span>
                           </button>
                           <button
                              onClick={() => {
                                 toggleAddOption();
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
               </div>
            </div>
         )}
         <OptionFeaturesPreview {...optionFeaturesPreviewProps} />
         <OptionProductsPreviews {...optionProductsPreviews} />
         <OptionPreview {...optionPreviewProps} />
         <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
         />
         <input
            type="file"
            ref={filesInputRef}
            multiple
            className="hidden"
            onChange={handleFilesChange}
         />
      </>
   );
};

export default AddOptions;
