import { FC, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Pet } from "../../types";
import styles from "./PetDetails.module.scss";

const PetDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("לא נמצא ID לחיה");
      setLoading(false);
      return;
    }

    fetch("/data/pets.json")
      .then((res) => {
        if (!res.ok) throw new Error("לא ניתן לטעון את הנתונים");
        return res.json();
      })
      .then((data: Pet[]) => {
        const foundPet = data.find((p) => p.id === id);
        if (foundPet) {
          setPet(foundPet);
        } else {
          setError("לא נמצאה חיה עם ID זה");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    if (pet) {
      const saved = localStorage.getItem("last_viewed_pets");
      let history: Pet[] = saved ? JSON.parse(saved) : [];

      const updatedHistory = [
        pet,
        ...history.filter((p) => p.id !== pet.id),
      ].slice(0, 3);

      localStorage.setItem("last_viewed_pets", JSON.stringify(updatedHistory));
    }
  }, [pet]);
  if (loading) {
    return <div className={styles.loading}>טוען פרטי החיה...</div>;
  }

  if (error || !pet) {
    return (
      <div className={styles.error}>
        <h2>שגיאה</h2>
        <p>{error || "לא נמצאה החיה"}</p>
        <Link to="/catalog" className={styles.backLink}>
          חזרה לקטלוג
        </Link>
      </div>
    );
  }

  const age = new Date().getFullYear() - pet.birthYear;
  const ageText =
    age <= 0 ? "גור/גורה" : `${age} ${age === 1 ? "שנה" : "שנים"}`;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <img
            src={pet.pictureUrl}
            alt={pet.firstName}
            className={styles.mainImage}
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400?text=ללא+תמונה";
            }}
          />
        </div>

        <div className={styles.infoSection}>
          <h1 className={styles.name}>{pet.firstName}</h1>

          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.label}>סוג</span>
              <span className={styles.value}>{pet.animalType}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.label}>גיל</span>
              <span className={styles.value}>{ageText}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.label}>מגדר</span>
              <span
                className={`${styles.value} ${pet.gender === "זכר" ? styles.male : styles.female}`}
              >
                {pet.gender}
              </span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h2>על החיה</h2>
            <p className={styles.description}>{pet.description}</p>
          </div>

          <div className={styles.actions}>
            <button
              className={styles.adoptButton}
              onClick={() => alert(`בקשת אימוץ נשלחה עבור ${pet.firstName}`)}
            >
              אני רוצה לאמץ!
            </button>

            <button
              className={styles.backButton}
              onClick={() => navigate("/catalog")}
            >
              חזרה לקטלוג
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PetDetails;
