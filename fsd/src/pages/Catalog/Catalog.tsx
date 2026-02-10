import { FC, useState, useEffect, useMemo } from "react";
import { Pet } from "../../types";
import PetCard from "../../components/PetCard/PetCard";
import styles from "./Catalog.module.scss";

type GenderFilter = "כל" | "זכר" | "נקבה";
type AgeRange = "כל" | "גורים" | "1-3" | "4-7" | "8+";

const Catalog: FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchName, setSearchName] = useState("");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("כל");
  const [ageFilter, setAgeFilter] = useState<AgeRange>("כל");
  const [typeFilter, setTypeFilter] = useState("כל");

  useEffect(() => {
    fetch("/data/pets.json")
      .then((res) => {
        if (!res.ok) throw new Error(`שגיאה ${res.status}`);
        return res.json();
      })
      .then((data: Pet[]) => {
        setPets(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const animalTypes = useMemo(() => {
    const types = new Set(pets.map((p) => p.animalType));
    return ["כל", ...Array.from(types).sort()];
  }, [pets]);

  const filteredPets = useMemo(() => {
    return pets.filter((pet) => {
      const nameMatch = pet.firstName
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const genderMatch = genderFilter === "כל" || pet.gender === genderFilter;

      const typeMatch = typeFilter === "כל" || pet.animalType === typeFilter;

      const age = new Date().getFullYear() - pet.birthYear;
      let ageMatch = true;
      if (ageFilter !== "כל") {
        if (ageFilter === "גורים") ageMatch = age <= 1;
        else if (ageFilter === "1-3") ageMatch = age >= 1 && age <= 3;
        else if (ageFilter === "4-7") ageMatch = age >= 4 && age <= 7;
        else if (ageFilter === "8+") ageMatch = age >= 8;
      }

      return nameMatch && genderMatch && typeMatch && ageMatch;
    });
  }, [pets, searchName, genderFilter, ageFilter, typeFilter]);

  if (loading) return <div className={styles.loading}>טוען חיות...</div>;
  if (error) return <div className={styles.error}>שגיאה: {error}</div>;

  return (
    <main className={styles.catalog}>
      <header className={styles.header}>
        <h1>קטלוג אימוץ</h1>
        <p className={styles.count}>
          מוצגות {filteredPets.length} מתוך {pets.length} חיות
        </p>
      </header>

      <section className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="search">חיפוש לפי שם</label>
          <input
            id="search"
            type="search"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="הקלד שם..."
          />
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="type">סוג חיה</label>
          <select
            id="type"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {animalTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="gender">מגדר</label>
          <select
            id="gender"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as GenderFilter)}
          >
            <option value="כל">הכל</option>
            <option value="זכר">זכר</option>
            <option value="נקבה">נקבה</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="age">גיל</label>
          <select
            id="age"
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value as AgeRange)}
          >
            <option value="כל">הכל</option>
            <option value="גורים">גורים (עד שנה)</option>
            <option value="1-3">1–3 שנים</option>
            <option value="4-7">4–7 שנים</option>
            <option value="8+">8 שנים ומעלה</option>
          </select>
        </div>
      </section>

      {filteredPets.length === 0 ? (
        <div className={styles.noResults}>
          <p>לא נמצאו חיות שמתאימות לסינון</p>
          <button
            onClick={() => {
              setSearchName("");
              setGenderFilter("כל");
              setAgeFilter("כל");
              setTypeFilter("כל");
            }}
          >
            נקה סינונים
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredPets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Catalog;
