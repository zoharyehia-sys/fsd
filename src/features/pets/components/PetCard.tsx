import { useNavigate } from 'react-router-dom';
import classes from './PetCard.module.scss';

interface PetCardProps {
  id: string;
  firstName: string;
  birthYear: number;
  animalType: string;
  gender: string;
  description: string;
  pictureUrl: string;
}

export default function PetCard({
  id,
  firstName,
  birthYear,
  animalType,
  gender,
  description,
  pictureUrl,
}: PetCardProps) {
  const navigate = useNavigate();
  const age = new Date().getFullYear() - birthYear;

  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        <img
          src={pictureUrl}
          alt={firstName}
          className={classes.image}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://via.placeholder.com/260x260?text=No+Image';
          }}
        />
      </div>

      <div className={classes.content}>
        <h3 className={classes.name}>{firstName}</h3>

        <div className={classes.meta}>
          <span className={classes.metaItem}>{animalType}</span>
          <span className={classes.separator}>•</span>
          <span className={classes.metaItem}>{age} years</span>
          <span className={classes.separator}>•</span>
          <span className={classes.gender + ' ' + (gender === 'male' || gender === 'זכר' ? classes.male : classes.female)}>
            {gender === 'male' || gender === 'זכר' ? 'זכר' : gender === 'female' || gender === 'נקבה' ? 'נקבה' : gender}
          </span>
        </div>

        <p className={classes.description}>{description}</p>

        <div className={classes.actions}>
          <button
            className={classes.detailsBtn}
            onClick={() => navigate(`/pet/${id}`)}
          >
            Details
          </button>
          <button
            className={classes.adoptBtn}
            onClick={() => navigate(`/adoption/${id}`)}
          >
            Adopt
          </button>
        </div>
      </div>
    </div>
  );
}
