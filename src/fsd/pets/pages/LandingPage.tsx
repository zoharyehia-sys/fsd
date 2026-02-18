import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import styles from "./LandingPage.module.scss";
import LastPets from "../components/LastPets";
import { PetService } from "../services/petService";
import { Loader } from "../../../shared/components";
import type { Pet } from "../../../models/Pet";

const DOG_HE = "\u05DB\u05DC\u05D1";
const PLACEHOLDER_URL =
  "https://placehold.co/600x400?text=%D7%98%D7%95%D7%A2%D7%9F...";
const NO_IMAGE_URL =
  "https://placehold.co/600x400?text=%D7%9C%D7%9C%D7%90+%D7%AA%D7%9E%D7%95%D7%A0%D7%94";

const isDog = (animalType: string): boolean => {
  const normalized = animalType.trim().toLowerCase();
  return normalized.includes("dog") || normalized.includes(DOG_HE);
};

const withFallback = (value: string | undefined): string => {
  if (!value || value.trim().length === 0) return NO_IMAGE_URL;
  return value;
};

const LandingPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [randomImages, setRandomImages] = useState({
    total: PLACEHOLDER_URL,
    dogs: PLACEHOLDER_URL,
  });

  useEffect(() => {
    let cancelled = false;

    PetService.fetchAll()
      .then((data) => {
        if (cancelled) return;
        setPets(data);

        const dogsList = data.filter((pet) => isDog(pet.animalType));
        const randomTotalImg =
          data.length > 0
            ? withFallback(
                data[Math.floor(Math.random() * data.length)].pictureUrl,
              )
            : NO_IMAGE_URL;
        const randomDogImg =
          dogsList.length > 0
            ? withFallback(
                dogsList[Math.floor(Math.random() * dogsList.length)]
                  .pictureUrl,
              )
            : randomTotalImg;

        setRandomImages({ total: randomTotalImg, dogs: randomDogImg });
      })
      .catch((fetchError) => {
        console.error("Error fetching pets:", fetchError);
        setError(
          "\u05DC\u05D0 \u05E0\u05D9\u05EA\u05DF \u05DC\u05D8\u05E2\u05D5\u05DF \u05D0\u05EA \u05E0\u05EA\u05D5\u05E0\u05D9 \u05E2\u05DE\u05D5\u05D3 \u05D4\u05D1\u05D9\u05EA.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPets = pets.length;
  const dogsCount = useMemo(
    () => pets.filter((pet) => isDog(pet.animalType)).length,
    [pets],
  );

  if (loading) return <Loader message="\u05D8\u05D5\u05E2\u05DF..." fullPage />;
  if (error) return <div className={styles.hero}>{error}</div>;

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>{"\u05D0\u05D9\u05DE\u05D5\u05E5 \u05D7\u05D9\u05D5\u05EA"}</h1>
      </section>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <img
            src={randomImages.total}
            alt={
              "\u05D7\u05D9\u05D5\u05EA \u05E9\u05DE\u05DE\u05EA\u05D9\u05E0\u05D5\u05EA \u05DC\u05D0\u05D9\u05DE\u05D5\u05E5"
            }
            className={styles.statImage}
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = NO_IMAGE_URL;
            }}
          />
          <h2>
            {
              "\u05DB\u05DE\u05D4 \u05D7\u05D9\u05D5\u05EA \u05DE\u05DE\u05EA\u05D9\u05E0\u05D5\u05EA \u05DC\u05D0\u05D9\u05DE\u05D5\u05E5?"
            }
          </h2>
          <div className={styles.bigNumber}>{totalPets}</div>
          <Link to="/catalogue" className={styles.btn}>
            {"\u05DC\u05E7\u05D8\u05DC\u05D5\u05D2"}
          </Link>
        </div>

        <div className={styles.statCard}>
          <img
            src={randomImages.dogs}
            alt={
              "\u05DB\u05DC\u05D1\u05D9\u05DD \u05E9\u05DE\u05DE\u05EA\u05D9\u05E0\u05D9\u05DD \u05DC\u05D0\u05D9\u05DE\u05D5\u05E5"
            }
            className={styles.statImage}
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).src = NO_IMAGE_URL;
            }}
          />
          <h2>
            {
              "\u05DB\u05DE\u05D4 \u05DB\u05DC\u05D1\u05D9\u05DD \u05DE\u05DE\u05EA\u05D9\u05E0\u05D9\u05DD \u05DC\u05D0\u05D9\u05DE\u05D5\u05E5?"
            }
          </h2>
          <div className={styles.bigNumber}>{dogsCount}</div>

          <Link to="/adoption-form" className={styles.btn}>
            {"\u05DC\u05D0\u05D9\u05DE\u05D5\u05E5"}
          </Link>
        </div>
      </div>

      <section className={styles.lastPetsSection}>
        <LastPets />
      </section>
    </div>
  );
};

export default LandingPage;


