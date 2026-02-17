import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './LandingPage.module.scss';
import ImageWithFallback from '../../../shared/components/ImageWithFallback';
import { LastPets } from '../components';
import { PetService } from '../services/petService';
import Loader from '../../../shared/components/Loader';

const LandingPage: FC = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    PetService.fetchAll()
      .then((data) => {
        if (cancelled) return;
        setPets(data);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPets = pets.length;
  const dogs = pets.filter((p) => p.animalType.toLowerCase().includes('כלב'));
  const dogsCount = dogs.length;

  const getRandomPetImage = () => {
    if (pets.length === 0) return 'https://placehold.co/600x400?text=טוען...';
    const randomPet = pets[Math.floor(Math.random() * pets.length)];
    return randomPet.pictureUrl;
  };

  const getRandomDogImage = () => {
    if (dogs.length === 0) return getRandomPetImage();
    const randomDog = dogs[Math.floor(Math.random() * dogs.length)];
    return randomDog.pictureUrl;
  };

  if (loading) return <Loader message="טוען..." />;

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <h1>אימוץ חיות</h1>
      </section>

      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <ImageWithFallback
            src={getRandomPetImage()}
            alt="חיות ממתינות"
            className={styles.statImage}
          />
          <h2>כמה חיות ממתינות לאימוץ?</h2>
          <div className={styles.bigNumber}>{totalPets}</div>
          <Link to="/catalogue" className={styles.btn}>
            לקטלוג
          </Link>
        </div>

        <div className={styles.statCard}>
          <ImageWithFallback
            src={getRandomDogImage()}
            alt="כלבים ממתינים"
            className={styles.statImage}
          />
          <h2>כמה כלבים ממתינים לאימוץ?</h2>
          <div className={styles.bigNumber}>{dogsCount}</div>

          <Link to="/adoption" className={styles.btn}>
            לאימוץ
          </Link>
        </div>
      </div>

      <LastPets />
    </div>
  );
};

export default LandingPage;
