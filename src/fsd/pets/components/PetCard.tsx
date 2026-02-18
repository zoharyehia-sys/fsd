import { useNavigate } from "react-router";
import classes from "./PetCard.module.scss";

interface PetCardProps {
  id: string;
  firstName: string;
  birthYear: number;
  animalType: string;
  gender: string;
  description: string;
  pictureUrl: string;
}

const MALE_HE = "\u05D6\u05DB\u05E8";
const FEMALE_HE = "\u05E0\u05E7\u05D1\u05D4";
const NO_IMAGE_URL =
  "https://via.placeholder.com/260x260?text=%D7%9C%D7%9C%D7%90+%D7%AA%D7%9E%D7%95%D7%A0%D7%94";

const normalizeGender = (gender: string): "male" | "female" | "unknown" => {
  const value = gender.trim().toLowerCase();
  if (value === "male" || value === MALE_HE) return "male";
  if (value === "female" || value === FEMALE_HE) return "female";
  return "unknown";
};

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
  const normalizedGender = normalizeGender(gender);

  return (
    <div className={classes.card}>
      <div className={classes.imageContainer}>
        <img
          src={pictureUrl}
          alt={firstName}
          className={classes.image}
          onError={(event) => {
            (event.currentTarget as HTMLImageElement).src = NO_IMAGE_URL;
          }}
        />
      </div>

      <div className={classes.content}>
        <h3 className={classes.name}>{firstName}</h3>

        <div className={classes.meta}>
          <span className={classes.metaItem}>{animalType}</span>
          <span className={classes.separator}>|</span>
          <span className={classes.metaItem}>
            {age} {"\u05E9\u05E0\u05D9\u05DD"}
          </span>
          <span className={classes.separator}>|</span>
          <span
            className={
              classes.gender +
              " " +
              (normalizedGender === "male" ? classes.male : classes.female)
            }
          >
            {normalizedGender === "male"
              ? "\u05D6\u05DB\u05E8"
              : normalizedGender === "female"
                ? "\u05E0\u05E7\u05D1\u05D4"
                : gender}
          </span>
        </div>

        <p className={classes.description}>{description}</p>

        <div className={classes.actions}>
          <button
            className={classes.detailsBtn}
            onClick={() => navigate(`/pet/${id}`)}
          >
            {"\u05DC\u05E4\u05E8\u05D8\u05D9\u05DD"}
          </button>
          <button
            className={classes.adoptBtn}
            onClick={() => navigate(`/adoption-form?id=${id}`)}
          >
            {"\u05DC\u05D0\u05D9\u05DE\u05D5\u05E5"}
          </button>
        </div>
      </div>
    </div>
  );
}
