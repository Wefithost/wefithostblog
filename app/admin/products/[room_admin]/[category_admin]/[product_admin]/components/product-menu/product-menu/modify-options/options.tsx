import { useState } from 'react';
import Options from '../../options';
import EditUpholstery from './edit-upholstery/edit-upholstery';
import { usePopup } from '~/lib/utils/toggle-popups';
import AddOptions from './edit-upholstery/add-options/add-options';
import DeleteOption from './edit-upholstery/delete-option';

const ModifyOptions = (props: any) => {
   const {
      productData,
      selectedOption,
      handleMouseEnter,
      handleMouseLeave,
      handleOptionClick,
      activeOption,
      isVisible,
      hideTimeout,
      isUpholsteryEditVisible,
      upholsteryEdit,
      upholsteryEditRef,
      toggleUpholsteryEdit,
      setSelectedOption,

      setActiveIndex,
      optionId,
      setOptionId,
   } = props;
   const {
      isVisible: isAddOptionVisible,
      isActive: addOption,
      ref: addOptionRef,
      togglePopup: toggleAddOption,
   } = usePopup();
   const {
      isVisible: isDeleteOptionVisible,
      isActive: deleteOption,
      ref: deleteOptionRef,
      togglePopup: toggleDeleteOption,
   } = usePopup();
   const optionsProps = {
      productData,
      selectedOption,
      handleMouseEnter,
      handleMouseLeave,
      handleOptionClick,
      activeOption,
      isVisible,
      hideTimeout,
      optionId,
      setOptionId,
      setActiveIndex,
   };
   const editUpholsteryProps = {
      upholsteryEdit,
      isUpholsteryEditVisible,
      upholsteryEditRef,
      toggleUpholsteryEdit,
   };

   const addOptionsProps = {
      isAddOptionVisible,
      addOption,
      addOptionRef,
      toggleAddOption,
      toggleDeleteOption,
   };

   const deleteOptionProps = {
      optionId,
      setOptionId,
      isDeleteOptionVisible,
      deleteOption,
      deleteOptionRef,
      toggleDeleteOption,
      setSelectedOption,
   };
   return (
      <div className="py-4 flex flex-col  gap-4  items-start">
         <div className="flex  flex-col w-full">
            <div className="flex items-center  gap-2">
               <h1 className="text-xs uppercase   tracking-widest  font-bold">
                  {productData?.fabric ? (
                     'Fabric:'
                  ) : productData?.leather ? (
                     'Leather:'
                  ) : productData?.finish ? (
                     'Finish:'
                  ) : (
                     <span className="text-red">No Upholstery or finish</span>
                  )}
               </h1>

               <h1 className="text-darkGrey uppercase text-sm neue-light ">
                  {productData?.options[selectedOption]?.option || '_'}
               </h1>
            </div>
            <button
               className="bg-softGreen py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-softGreen duration-150  self-end"
               onClick={toggleUpholsteryEdit}
            >
               Edit Upholstery Details:
            </button>
         </div>

         {productData?.options.length > 0 ? (
            <Options {...optionsProps} />
         ) : (
            <h1 className="text-grey   text-xs neue-light">No options</h1>
         )}
         <div className="flex items-center w-full justify-between ">
            <button
               className="bg-softGreen py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-softGreen duration-150  self-end"
               onClick={toggleAddOption}
            >
               Add options
            </button>
            {optionId && (
               <button
                  className="bg-[#E53E3E]  py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-[#E53E3E]  duration-150  self-start"
                  onClick={toggleDeleteOption}
               >
                  Delete selected Option
               </button>
            )}
         </div>

         <EditUpholstery {...editUpholsteryProps} />
         <AddOptions {...addOptionsProps} />
         <DeleteOption {...deleteOptionProps} />
      </div>
   );
};

export default ModifyOptions;
