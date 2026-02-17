import PetCard from './PetCard';
import classes from './PetGrid.module.scss';

interface Pet {
  id: string;
  firstName: string;
  birthYear: number;
  animalType: string;
  gender: 'male' | 'female';
  description: string;
  pictureUrl: string;
}

interface PetGridProps {
  pets: Pet[];
  isLoading?: boolean;
}

export default function PetGrid({ pets, isLoading }: PetGridProps) {
  if (isLoading) {
    return <div className={classes.empty}>Loading...</div>;
  }

  if (!pets || pets.length === 0) {
    return (
      <div className={classes.empty}>
        <div className={classes.emptyIcon}>🐾</div>
        <div className={classes.emptyTitle}>No pets found</div>
        <div className={classes.emptyText}>
          Try adjusting your search filters
        </div>
      </div>
    );
  }

  return (
    <div className={classes.grid}>
      {pets.map((pet) => (
        <PetCard key={pet.id} {...pet} />
      ))}
    </div>
  );
}
