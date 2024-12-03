import RowHeader from '@common/RowHeader';
import DetailsCard from '@common/ItemCard/DetailsCard';

export default function MaintenancePlanItemDetailsHeader({ label, caption, item, image }) {
  return (
    <>
      <RowHeader title={label} caption={caption} />
      <DetailsCard selectedItem={item} selectedImage={image} />
    </>
  );
}
