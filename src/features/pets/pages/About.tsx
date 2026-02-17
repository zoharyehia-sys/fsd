import { FC, useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styles from './About.module.scss';
import { Pet as PetModel } from '../../../models';
import { PetService } from '../services/petService';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';
import Button from '../../../shared/components/Button';
import Loader from '../../../shared/components/Loader';

const About: FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [pet, setPet] = useState<PetModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('לא נבחרה חיה');
      setLoading(false);
      return;
    }

    let cancelled = false;
    PetService.fetchAll()
      .then((pets) => {
        if (cancelled) return;
        const found = PetService.getById(pets, id);
        setPet(found || null);
      })
      .catch((err) => {
        console.error(err);
        setError('שגיאה בטעינת פרטי החיה');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader message="טוען..." />;
  if (error) return <div className={styles.status}>{error}</div>;
  if (!pet) return <div className={styles.status}>החיה לא נמצאה.</div>;

  const age = pet.getAge ? pet.getAge() : new Date().getFullYear() - pet.birthYear;

  return (
    <div className={styles.page}>
      <div className={styles.controls}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← חזרה
        </Button>
      </div>

      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.imageContainer}>
            <ImageWithFallback
              src={pet.pictureUrl}
              alt={pet.firstName}
              className={styles.petImage}
              fallback={'https://placehold.co/800x600?text=ללא+תמונה'}
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
                <span className={styles.value}>{age} {age === 1 ? 'שנה' : 'שנים'}</span>
              </div>
              <div className={styles.item}>
                <span className={styles.label}>מין:</span>
                <span className={styles.value}>{pet.gender === 'male' ? 'זכר' : pet.gender === 'female' ? 'נקבה' : pet.gender}</span>
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

            <div className={styles.actionsRow}>
              <Link to={`/adoption/${pet.id}`} className={styles.adoptLink}>
                אמצו את {pet.firstName}
              </Link>
              <Button variant="primary" onClick={() => navigate(`/adoption/${pet.id}`)}>
                אני רוצה לאמץ
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
