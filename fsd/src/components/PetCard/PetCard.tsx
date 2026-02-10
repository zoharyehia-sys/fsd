import { FC } from "react";
import { Pet } from "../../types";
import styles from "./PetCard.module.scss";
import { useNavigate } from "react-router-dom";
import ImageWithFallback from "../../components/ImageWithFallback/ImageWithFallback";

interface PetCardProps {
  pet: Pet;
  onAdopt?: (petId: string) => void;
  onViewDetails?: (petId: string) => void;
}

const PetCard: FC<PetCardProps> = ({ pet, onAdopt }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const age = currentYear - pet.birthYear;
  const ageDisplay =
    age <= 0 ? "גור/גורה" : `${age} ${age === 1 ? "שנה" : "שנים"}`;

  const handleDetails = () => {
    const saved = localStorage.getItem("last_viewed_pets");
    const history: Pet[] = saved ? JSON.parse(saved) : [];

    const updatedHistory = [
      pet,
      ...history.filter((p) => p.id !== pet.id),
    ].slice(0, 3);

    localStorage.setItem("last_viewed_pets", JSON.stringify(updatedHistory));
    navigate(`/about/${pet.id}`);
  };

  return (
    <article className={styles.card} data-testid={`pet-card-${pet.id}`}>
      <div className={styles.imageContainer}>
        <ImageWithFallback
          src={pet.pictureUrl}
          alt={pet.firstName}
          className={styles.image}
          loading="lazy"
        />
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{pet.firstName}</h3>

        <div className={styles.meta}>
          <span className={styles.metaItem}>{pet.animalType}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.metaItem}>{ageDisplay}</span>
          <span className={styles.separator}>•</span>
          <span
            className={`${styles.metaItem} ${styles.gender} ${
              pet.gender === "זכר" ? styles.male : styles.female
            }`}
          >
            {pet.gender}
          </span>
        </div>

        <p className={styles.description}>
          {pet.description.length > 110
            ? `${pet.description.substring(0, 107)}...`
            : pet.description}
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.detailsBtn}
            onClick={handleDetails}
          >
            פרטים נוספים
          </button>

          <button
            type="button"
            className={styles.adoptBtn}
            onClick={() => navigate("/Adoption-Form")}
          >
            לאימוץ
          </button>
        </div>
      </div>
    </article>
  );
};

export default PetCard;
