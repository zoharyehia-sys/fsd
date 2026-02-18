import { useEffect, useMemo, useState } from "react";
import styles from "./CataloguePage.module.scss";
import PetCard from "../components/PetCard";
import { PetService } from "../services/petService";
import { Button, Loader } from "../../../shared/components";
import type { Pet } from "../../../models/Pet";
import { ageCalc } from "../../../shared/utils/helpers";

type GenderFilter = "all" | "male" | "female";
type AgeRange = "all" | "young" | "1-3" | "4-7" | "8+";
type AnimalFilter = "all" | "dog" | "cat";

const MALE_HE = "\u05D6\u05DB\u05E8";
const FEMALE_HE = "\u05E0\u05E7\u05D1\u05D4";
const DOG_HE = "\u05DB\u05DC\u05D1";
const CAT_HE = "\u05D7\u05EA\u05D5\u05DC";

const isMale = (gender: string): boolean => {
  const normalized = gender.trim().toLowerCase();
  return normalized === "male" || normalized === MALE_HE;
};

const isFemale = (gender: string): boolean => {
  const normalized = gender.trim().toLowerCase();
  return normalized === "female" || normalized === FEMALE_HE;
};

const isDog = (animalType: string): boolean => {
  const normalized = animalType.trim().toLowerCase();
  return normalized.includes("dog") || normalized.includes(DOG_HE);
};

const isCat = (animalType: string): boolean => {
  const normalized = animalType.trim().toLowerCase();
  return normalized.includes("cat") || normalized.includes(CAT_HE);
};

const CataloguePage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("all");
  const [ageFilter, setAgeFilter] = useState<AgeRange>("all");
  const [typeFilter, setTypeFilter] = useState<AnimalFilter>("all");

  useEffect(() => {
    let cancelled = false;

    PetService.fetchAll()
      .then((data) => {
        if (cancelled) return;
        setPets(data);
      })
      .catch((fetchError) => {
        console.error("Error fetching pets:", fetchError);
        setError(
          "\u05D8\u05E2\u05D9\u05E0\u05EA \u05D4\u05E7\u05D8\u05DC\u05D5\u05D2 \u05E0\u05DB\u05E9\u05DC\u05D4.",
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const nameMatch = pet.firstName
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const genderMatch =
        genderFilter === "all" ||
        (genderFilter === "male" && isMale(pet.gender)) ||
        (genderFilter === "female" && isFemale(pet.gender));

      const typeMatch =
        typeFilter === "all" ||
        (typeFilter === "dog" && isDog(pet.animalType)) ||
        (typeFilter === "cat" && isCat(pet.animalType));

      const age = ageCalc(pet.birthYear);
      let ageMatch = true;
      if (ageFilter !== "all") {
        if (ageFilter === "young") ageMatch = age <= 1;
        else if (ageFilter === "1-3") ageMatch = age >= 1 && age <= 3;
        else if (ageFilter === "4-7") ageMatch = age >= 4 && age <= 7;
        else if (ageFilter === "8+") ageMatch = age >= 8;
      }

      return nameMatch && genderMatch && typeMatch && ageMatch;
    });
  }, [pets, searchName, genderFilter, ageFilter, typeFilter]);

  if (loading)
    return (
      <Loader message="\u05D8\u05D5\u05E2\u05DF \u05D7\u05D9\u05D5\u05EA..." />
    );
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <main className={styles.catalog}>
      <header className={styles.header}>
        <h1>
          {"\u05E7\u05D8\u05DC\u05D5\u05D2 \u05D0\u05D9\u05DE\u05D5\u05E5"}
        </h1>
        <p className={styles.count}>
          {"\u05DE\u05D5\u05E6\u05D2\u05D5\u05EA"} {filteredPets.length}{" "}
          {"\u05DE\u05EA\u05D5\u05DA"} {pets.length}{" "}
          {"\u05D7\u05D9\u05D5\u05EA"}
        </p>
      </header>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="search">
            {"\u05D7\u05D9\u05E4\u05D5\u05E9 \u05DC\u05E4\u05D9 \u05E9\u05DD"}
          </label>
          <input
            id="search"
            type="search"
            value={searchName}
            onChange={(event) => setSearchName(event.target.value)}
            placeholder="\u05D4\u05E7\u05DC\u05D3 \u05E9\u05DD..."
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="type">
            {"\u05E1\u05D5\u05D2 \u05D7\u05D9\u05D4"}
          </label>
          <select
            id="type"
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value as AnimalFilter)
            }
          >
            <option value="all">{"\u05D4\u05DB\u05DC"}</option>
            <option value="dog">{"\u05DB\u05DC\u05D1\u05D9\u05DD"}</option>
            <option value="cat">
              {"\u05D7\u05EA\u05D5\u05DC\u05D9\u05DD"}
            </option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="gender">{"\u05DE\u05D9\u05DF"}</label>
          <select
            id="gender"
            value={genderFilter}
            onChange={(event) =>
              setGenderFilter(event.target.value as GenderFilter)
            }
          >
            <option value="all">{"\u05D4\u05DB\u05DC"}</option>
            <option value="male">{"\u05D6\u05DB\u05E8"}</option>
            <option value="female">{"\u05E0\u05E7\u05D1\u05D4"}</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="age">{"\u05D2\u05D9\u05DC"}</label>
          <select
            id="age"
            value={ageFilter}
            onChange={(event) => setAgeFilter(event.target.value as AgeRange)}
          >
            <option value="all">{"\u05D4\u05DB\u05DC"}</option>
            <option value="young">
              {
                "\u05D2\u05D5\u05E8\u05D9\u05DD (\u05E2\u05D3 \u05E9\u05E0\u05D4)"
              }
            </option>
            <option value="1-3">{"1-3 \u05E9\u05E0\u05D9\u05DD"}</option>
            <option value="4-7">{"4-7 \u05E9\u05E0\u05D9\u05DD"}</option>
            <option value="8+">{"8+ \u05E9\u05E0\u05D9\u05DD"}</option>
          </select>
        </div>
      </section>

      {filteredPets.length === 0 ? (
        <div className={styles.noResults}>
          <p>
            {
              "\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D5 \u05D7\u05D9\u05D5\u05EA \u05E9\u05DE\u05EA\u05D0\u05D9\u05DE\u05D5\u05EA \u05DC\u05E1\u05D9\u05E0\u05D5\u05DF \u05D4\u05E0\u05D5\u05DB\u05D7\u05D9."
            }
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setSearchName("");
              setGenderFilter("all");
              setAgeFilter("all");
              setTypeFilter("all");
            }}
          >
            {"\u05E0\u05E7\u05D4 \u05E1\u05D9\u05E0\u05D5\u05E0\u05D9\u05DD"}
          </Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} {...pet} />
          ))}
        </div>
      )}
    </main>
  );
};

export default CataloguePage;


