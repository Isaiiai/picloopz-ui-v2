import { FC } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductSkeletonCard = () => (
  <div className="group relative">
    <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100 mb-3">
      <Skeleton height="100%" width="100%" />
    </div>

    <Skeleton height={16} width="80%" className="mb-1" />
    <div className="flex justify-between items-center">
      <Skeleton height={16} width="40%" />
      <Skeleton height={16} width="30%" />
    </div>
  </div>
);

const ProductGridSkeletonLoader: FC = () => {
  const placeholderItems = Array.from({ length: 8 });

  return (
    <div className="flex-1">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <div className="mb-6">
          <Skeleton height={20} width={200} />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {placeholderItems.map((_, idx) => (
            <ProductSkeletonCard key={idx} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductGridSkeletonLoader;
