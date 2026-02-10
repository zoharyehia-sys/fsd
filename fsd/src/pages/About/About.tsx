import ImageWithFallback from "../../components/ImageWithFallback/ImageWithFallback";
import { FC, useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import { Pet } from "../../types";
import styles from "./About.module.scss";

const PetAbout: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/pets.json")
      .then((res) => res.json())
      .then((data: Pet[]) => {
        const found = data.find((p) => String(p.id) === String(id));
        setPet(found || null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.status}>טוען...</div>;
  if (!pet) return <div className={styles.status}>החיה לא נמצאה.</div>;

  const age = new Date().getFullYear() - pet.birthYear;

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        → חזרה
      </button>
      <br />
      <br />

      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.imageContainer}>
            <ImageWithFallback
              src={pet.pictureUrl}
              alt={pet.firstName}
              className={styles.petImage}
            />
          </div>
          <div className={styles.titleInfo}>
            <h1>{pet.firstName}</h1>
            <span className={styles.badge}>{pet.animalType}</span>
          </div>
        </section>

        <section className={styles.detailsSection}>
          <div className={styles.infoCard}>
            <h3>פרטים כלליים</h3>
            <div className={styles.grid}>
              <div className={styles.item}>
                <span className={styles.label}>גיל:</span>
                <span className={styles.value}>{age} שנים</span>
              </div>
              <div className={styles.item}>
                <span className={styles.label}>מין:</span>
                <span className={styles.value}>{pet.gender}</span>
              </div>
              <div className={styles.item}>
                <span className={styles.label}>סוג:</span>
                <span className={styles.value}>{pet.animalType}</span>
              </div>
            </div>
          </div>

          <div className={styles.storyCard}>
            <h3>הסיפור שלי</h3>
            <p>
              הכירו את {pet.firstName}! {pet.description}
            </p>
            <Link
              to="/adoption-form"
              state={{ selectedPetId: pet.id }}
              className={styles.adoptLink}
            >
              אמצו את {pet.firstName}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PetAbout;
