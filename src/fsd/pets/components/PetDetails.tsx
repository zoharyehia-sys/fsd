import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import styles from "./PetDetails.module.scss";
import type { Pet as PetModel } from "../../../models/Pet";
import { PetService } from "../services/petService";
import { useViewedPets } from "../hooks/useViewedPets";
import { Button, Loader } from "../../../shared/components";

const MALE_HE = "\u05D6\u05DB\u05E8";
const FEMALE_HE = "\u05E0\u05E7\u05D1\u05D4";
const NO_IMAGE_URL =
  "https://placehold.co/800x600?text=%D7%9C%D7%9C%D7%90+%D7%AA%D7%9E%D7%95%D7%A0%D7%94";

const getGenderLabel = (gender: string): string => {
  const value = gender.trim().toLowerCase();
  if (value === "male" || value === MALE_HE) return "\u05D6\u05DB\u05E8";
  if (value === "female" || value === FEMALE_HE) return "\u05E0\u05E7\u05D1\u05D4";
  return gender;
};

const isMale = (gender: string): boolean => {
  const value = gender.trim().toLowerCase();
  return value === "male" || value === MALE_HE;
};

const PetDetails = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { addViewed } = useViewedPets();

  const [pet, setPet] = useState<PetModel | null>(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!id) {
      return () => {
        cancelled = true;
      };
    }

    PetService.fetchAll()
      .then((pets) => {
        if (cancelled) return;
        const found = PetService.getById(pets, id);
        if (found) {
          setPet(found);
        } else {
          setError(
            "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05D7\u05D9\u05D4 \u05E2\u05DD \u05DE\u05D6\u05D4\u05D4 \u05D6\u05D4.",
          );
        }
      })
      .catch((fetchError) => {
        console.error(fetchError);
        setError(
          "\u05DC\u05D0 \u05E0\u05D9\u05EA\u05DF \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05E4\u05E8\u05D8\u05D9 \u05D4\u05D7\u05D9\u05D4.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (pet) addViewed(pet.id);
  }, [pet, addViewed]);

  if (loading) return <Loader message="\u05D8\u05D5\u05E2\u05DF \u05E4\u05E8\u05D8\u05D9 \u05D7\u05D9\u05D4..." />;

  if (!id || error || !pet) {
    return (
      <div className={styles.errorWrap}>
        <h2>{"\u05E9\u05D2\u05D9\u05D0\u05D4"}</h2>
        <p>{error || "\u05D4\u05D7\u05D9\u05D4 \u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4."}</p>
        <Link to="/catalogue" className={styles.backLink}>
          {"\u05D7\u05D6\u05E8\u05D4 \u05DC\u05E7\u05D8\u05DC\u05D5\u05D2"}
        </Link>
      </div>
    );
  }

  const age = new Date().getFullYear() - pet.birthYear;
  const ageText =
    age <= 0
      ? "\u05D2\u05D5\u05E8/\u05D4"
      : `${age} ${age === 1 ? "\u05E9\u05E0\u05D4" : "\u05E9\u05E0\u05D9\u05DD"}`;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <img
            src={pet.pictureUrl}
            alt={pet.firstName}
            className={styles.mainImage}
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = NO_IMAGE_URL;
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.name}>{pet.firstName}</h1>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.label}>{"\u05E1\u05D5\u05D2"}</span>
              <span className={styles.value}>{pet.animalType}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.label}>{"\u05D2\u05D9\u05DC"}</span>
              <span className={styles.value}>{ageText}</span>
            </div>

            <div className={styles.metaItem}>
              <span className={styles.label}>{"\u05DE\u05D9\u05DF"}</span>
              <span
                className={`${styles.value} ${isMale(pet.gender) ? styles.male : styles.female}`}
              >
                {getGenderLabel(pet.gender)}
              </span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h2>{"\u05E2\u05DC \u05D4\u05D7\u05D9\u05D4"}</h2>
            <p className={styles.description}>{pet.description}</p>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" onClick={() => navigate(`/adoption-form?id=${pet.id}`)}>
              {"\u05D0\u05E0\u05D9 \u05E8\u05D5\u05E6\u05D4 \u05DC\u05D0\u05DE\u05E5"}
            </Button>

            <Button variant="secondary" onClick={() => navigate("/catalogue")}>
              {"\u05D7\u05D6\u05E8\u05D4 \u05DC\u05E7\u05D8\u05DC\u05D5\u05D2"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PetDetails;


