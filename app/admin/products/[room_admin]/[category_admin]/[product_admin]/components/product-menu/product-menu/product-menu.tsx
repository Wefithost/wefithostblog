import Image from 'next/image';
import { usePopup } from '~/lib/utils/toggle-popups';
import bag from '~/public/icons/bagwhite.svg';
import heart from '~/public/icons/heart.svg';
import Dimensions from './dimensions/dimensions';
import reload from '~/public/icons/reload.svg';
import { useState } from 'react';
import ModifyOptions from './modify-options/options';
import ModifyProductName from './modify-name';
import ModifyFeatures from './modify-features/modify-features';
import Restock from './restock';
const ProductMenu = (props: any) => {
   const {
      productData,
      selectedOption,
      handleMouseEnter,
      handleMouseLeave,
      handleOptionClick,
      activeOption,
      isVisible,
      hideTimeout,
      setSelectedOption,

      setActiveIndex,
   } = props;

   const {
      isVisible: isDimensionsVisible,
      isActive: dimensions,
      ref: dimensionsRef,
      togglePopup: toggleDimensions,
   } = usePopup();
   const dimensionsProps = {
      dimensions,
      isDimensionsVisible,
      dimensionsRef,
      toggleDimensions,
      productData,
   };
   const {
      isVisible: isUpholsteryEditVisible,
      isActive: upholsteryEdit,
      ref: upholsteryEditRef,
      togglePopup: toggleUpholsteryEdit,
   } = usePopup();

   const [optionId, setOptionId] = useState('');
   const modifyOptionsProps = {
      optionId,
      setOptionId,
      productData,
      selectedOption,
      setSelectedOption,
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

      setActiveIndex,
   };
   const modifyProductNameProps = {
      productData,
   };

   const restockProps = { productData, selectedOption, optionId };
   return (
      <div className="flex  w-full gap-4 w-[40%] flex-col gap-6  px-8  divide-y divide-lightGrey  lg:px-4   xl:px-2 lg:w-[45%] md:w-full">
         <ModifyProductName {...modifyProductNameProps} />

         <ModifyOptions {...modifyOptionsProps} />

         <Restock {...restockProps} />

         <Dimensions {...dimensionsProps} />

         <ModifyFeatures productData={productData} />
      </div>
   );
};

export default ProductMenu;
