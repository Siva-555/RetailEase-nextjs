"use client";

import { CSSProperties, ReactNode } from "react";

import { ICellRendererParams } from "ag-grid-community";
import { cn } from "@/lib/utils";

interface CustomCellRendererProps extends ICellRendererParams {
  cusStyle?: CSSProperties;
  cusRenderer?: ReactNode;
  className?: string ,
  title?: string;
  onClick?: (params: CustomCellRendererProps) => void;
}


const CellRenderer = (props: CustomCellRendererProps) => {

  const { cusStyle, cusRenderer, className, title, onClick } = props;

  const onClickHandler = onClick ? () => onClick(props) : undefined;

  const style: CSSProperties = cusStyle ?? {};
  return (
    <div
      className={cn("size-full flex justify-center items-center", className)}
      style={style}
      title={title}
      onClick={onClickHandler}
    >
      {cusRenderer ?? props.value}
    </div>
  );
};

export type { CustomCellRendererProps };
export default CellRenderer;
