type cellProps = {
   value: any;
   end?: boolean;
};
const Cell = ({ value, end = false }: cellProps) => {
   return (
      <div className="bg-greyGreen  border-b border-b-lightGrey p-2">
         <h1 className={`text-xs   capitalize  ${end && ' text-end'}`}>
            {value}
         </h1>
      </div>
   );
};

export default Cell;
