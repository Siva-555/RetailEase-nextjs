"use client";

import { FixedSizeList as List } from "react-window";
import { CSSProperties } from "react";
import AutoSizer from "react-virtualized-auto-sizer";

type FixedVirtualizedListProps<T> = {
  data: T[];
  itemHeight: number;
  renderItem: (item: T, index: number, style: CSSProperties) => React.ReactNode;
};

export default function VirtualizedList<T>({
  data,
  itemHeight,
  renderItem,
}: FixedVirtualizedListProps<T>) {
  // const listRef = useRef<List>(null);
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, [data]);

  // if (!mounted) return null;

  return (
    <div style={{ flex: 1, height: "100%" }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={data.length}
            itemSize={itemHeight}
          >
            {({ index, style }) => renderItem(data[index], index, style)}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}

   {/* <VirtualizedList
                  data={filteredProducts}
                  itemHeight={80}
                  renderItem={(product, index, style) => (
                    <div
                      key={`product-item-${index}-${product.id}`}
                      style={style}
                    >
                      <div
                        className="flex items-center justify-between py-3 px-6 group hover:border-blue-500 border rounded-lg focus-within:border-blue-500 transition-colors focus-within:text-blue-800"
                        onClick={() =>
                          alert(`Clicked: ${product.product_name}`)
                        }
                      >
                        <div>
                          <h4 className="font-medium group-hover:text-blue-800 focus-within:text-blue-800 line-clamp-2">
                            {product.product_name}
                            {product.product_name}
                            {product.product_name}
                            {product.product_name}
                            {product.product_name}
                            {product.product_name}
                            {product.product_name}
                          </h4>
                          <p className="text-sm space-x-2 group-hover:text-blue-800 focus-within:text-blue-800">
                            <span>
                              Stock:
                              <span
                                className={cn(
                                  "ml-1 font-semibold",
                                  product.available_quantity === 0
                                    ? "text-gray-500"
                                    : product.available_quantity < 50
                                    ? "text-red-600"
                                    : product.available_quantity < 100
                                    ? "text-amber-600"
                                    : "text-green-800"
                                )}
                              >
                                {product.available_quantity === 0
                                  ? "Out of Stock"
                                  : product.available_quantity}
                              </span>
                            </span>
                            <span>•</span>
                            <span className="text-green-800">
                              ₹{product.sell_price.toFixed(2)}
                            </span>
                            <span className="line-through text-gray-500 text-xs">
                              ₹{product.mrp.toFixed(2)}
                            </span>
                            <span className="text-red-600 text-xs font-medium">
                              (
                              {Math.round(
                                ((product.mrp - product.sell_price) /
                                  product.mrp) *
                                  100
                              )}
                              % OFF)
                            </span>
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="primaryBlue"
                          className=""

                          // onClick={() => addToBill(product)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                /> */}
