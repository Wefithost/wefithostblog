import { useEffect } from 'react';
import { useState } from 'react';
import { useRef } from 'react';
import { usePopup } from '~/lib/utils/toggle-popups';
import EditFeature from './edit-feature';
import DeleteFeature from './delete-feature';

interface AccordionItemProps {
   isOpen: boolean;
   onClick: () => void;

   [key: string]: any;
}
const AccordionItem: React.FC<AccordionItemProps> = ({
   isOpen,
   onClick,
   ...props
}) => {
   const contentHeight = useRef<HTMLDivElement | null>(null);
   const lists = props?.lists || [];
   const content = props?.content;
   const paragraph = props?.paragraph;
   const [height, setHeight] = useState('0px');
   useEffect(() => {
      if (isOpen && contentHeight.current) {
         setHeight(`${contentHeight.current.scrollHeight}px`);
      } else {
         setHeight('0px');
      }
   }, [isOpen]);
   const {
      isVisible: isEditFeaturesVisible,
      isActive: editFeatures,
      ref: editFeaturesRef,
      togglePopup: toggleEditFeatures,
   } = usePopup();
   const {
      isVisible: isDeleteFeaturesVisible,
      isActive: deleteFeatures,
      ref: deleteFeaturesRef,
      togglePopup: toggleDeleteFeatures,
   } = usePopup();

   const [feature, setFeature] = useState('');

   const [editType, setEditType] = useState<string | number | boolean>('Lists');
   const [editSentence, setEditSentence] = useState<string | number | boolean>(
      ''
   );
   const [editLists, setEditLists] = useState<any>([]);
   const [editListInput, setEditListInput] = useState<string>('');
   const [featureId, setFeatureId] = useState('');
   const handleAddList = () => {
      if (editListInput.trim() && !editLists.includes(editListInput.trim())) {
         setEditLists([...editLists, editListInput.trim()]);
         setEditListInput('');
      }
   };

   const handleRemoveList = (index: number) => {
      setEditLists(editLists.filter((_: any, i: any) => i !== index));
   };

   const editFeatureProps = {
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
   };

   const deleteFeatureProps = {
      deleteFeatures,
      isDeleteFeaturesVisible,
      featureId,
      toggleDeleteFeatures,
      deleteFeaturesRef,
   };
   return (
      <div className=" overflow-hidden   w-full flex flex-col     bg-white    px-2 lg:px-0 md:px-2 ">
         <button
            className="w-full  py-4   flex items-center justify-between  border-none pointer leading-none   flex-nowrap outline-none"
            onClick={onClick}
         >
            <p className="text-xs text-grey  uppercase neue-light ">
               {props.header}
            </p>
            <span
               className={`p-[3px]   border-b-[1px] border-r-[1px]   border-black duration-300   ${
                  isOpen ? 'rotate-[225deg]' : 'rotate-[45deg]'
               }`}
            ></span>
         </button>
         <div
            ref={contentHeight}
            className="ease-out duration-300"
            style={{ height }}
         >
            <div className="flex flex-col  py-2 pb-3 ">
               {paragraph && (
                  <p className="   text-sm neue-light text-dimGrey   capitalize leading-relaxed ">
                     {content}
                  </p>
               )}
               {!paragraph && (
                  <ul className=" list-disc  px-5 gap-4  flex flex-col">
                     {lists.map((data: any) => (
                        <li
                           className="   text-sm neue-light text-dimGrey   capitalize leading-relaxed "
                           key={data?._id}
                        >
                           {data?.list}
                        </li>
                     ))}
                  </ul>
               )}
               <div className="flex items-center pt-3 w-full justify-between ">
                  <button
                     className="bg-softGreen py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-softGreen duration-150  self-end"
                     onClick={() => {
                        toggleEditFeatures();
                        setEditLists(
                           props?.lists?.map((item: any) => item.list) || []
                        );
                        setFeature(props?.header);
                        setEditType(props?.paragraph ? 'Sentence' : 'Lists');
                        setEditSentence(props?.content);
                        setFeatureId(props?._id);
                     }}
                  >
                     Edit {props?.header}
                  </button>
                  <button
                     className="bg-[#E53E3E]  py-2 px-3 text-xs  text-white  hover:ring-[1px]  ring-offset-2 hover:ring-[#E53E3E]  duration-150  self-start"
                     onClick={() => {
                        setFeatureId(props?._id);
                        toggleDeleteFeatures();
                     }}
                  >
                     Delete {props?.header}
                  </button>
               </div>
            </div>
         </div>

         <EditFeature {...editFeatureProps} />
         <DeleteFeature {...deleteFeatureProps} />
      </div>
   );
};
export const Accordion = (props: any) => {
   const { productData } = props;
   const [activeIndices, setActiveIndices] = useState<number[]>([]);

   const handleItemClick = (index: number) => {
      setActiveIndices((prevIndices) =>
         prevIndices.includes(index)
            ? prevIndices.filter((i) => i !== index)
            : [...prevIndices, index]
      );
   };

   return (
      <div className="w-full flex flex-col divide-y  divide-lightGrey border-b border-b-lightGrey   ">
         {productData?.features?.map((data: any, index: number) => (
            <AccordionItem
               key={data?._id}
               {...data}
               isOpen={activeIndices.includes(index)}
               onClick={() => handleItemClick(index)}
               lists={data.lists}
               content={data.content}
               paragraph={data.paragraph}
            />
         ))}
      </div>
   );
};
