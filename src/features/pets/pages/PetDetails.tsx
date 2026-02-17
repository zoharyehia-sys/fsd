import { FC, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styles from './PetDetails.module.scss';
import { Pet as PetModel } from '../../../models';
import { PetService } from '../services/petService';
import { useViewedPets } from '../hooks/useViewedPets';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';
import Loader from '../../../shared/components/Loader';
import Button from '../../../shared/components/Button';

const PetDetails: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { addViewed } = useViewedPets();

  const [pet, setPet] = useState<PetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!id) {
      setError('לא נמצא ID לחיה');
      setLoading(false);
      return;
    }

    setLoading(true);
    PetService.fetchAll()
      .then((pets) => {
        if (cancelled) return;
        const found = PetService.getById(pets, id);
        if (found) {
          setPet(found);
        } else {
          setError('לא נמצאה חיה עם ID זה');
        }
      })
      .catch((err) => {
        console.error(err);
        setError('לא ניתן לטעון את נתוני החיות');
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

  if (loading) return <Loader message="טוען פרטי החיה..." />;

  if (error || !pet) {
    return (
      <div className={styles.errorWrap}>
        <h2>שגיאה</h2>
        <p>{error || 'לא נמצאה החיה'}</p>
        <Link to="/catalogue" className={styles.backLink}>
          חזרה לקטלוג
        </Link>
      </div>
    );
  }

  const age = pet.getAge ? pet.getAge() : new Date().getFullYear() - pet.birthYear;
  const ageText = age <= 0 ? 'גור/גורה' : `${age} ${age === 1 ? 'שנה' : 'שנים'}`;

  return (
    <main className={styles.container}>
      <div className={styles.card}>
        <div className={styles.imageSection}>
          <ImageWithFallback
            src={pet.pictureUrl}
            alt={pet.firstName}
            className={styles.mainImage}
            fallback={'https://placehold.co/800x600?text=ללא+תמונה'}
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
                className={`${styles.value} ${
                  pet.gender === 'male' || pet.gender === 'זכר' ? styles.male : styles.female
                }`}
              >
                {pet.gender === 'male' || pet.gender === 'זכר' ? 'זכר' : pet.gender === 'female' || pet.gender === 'נקבה' ? 'נקבה' : pet.gender}
              </span>
            </div>
          </div>

          <div className={styles.descriptionSection}>
            <h2>על החיה</h2>
            <p className={styles.description}>{pet.description}</p>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              onClick={() => navigate(`/adoption/${pet.id}`)}
            >
              אני רוצה לאמץ!
            </Button>

            <Button variant="secondary" onClick={() => navigate('/catalogue')}>
              חזרה לקטלוג
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PetDetails;
