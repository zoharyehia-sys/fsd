import { FC, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Pet } from "../../types";
import styles from "./Home.module.scss";
import ImageWithFallback from "../../components/ImageWithFallback/ImageWithFallback";
import { LastPets } from "../../components/LastPets/Lastpets";

const Home: FC = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/pets.json")
      .then((res) => res.json())
      .then((data: Pet[]) => setPets(data))
      .finally(() => setLoading(false));
  }, []);

  const totalPets = pets.length;

  const dogs = pets.filter((pet) =>
    pet.animalType.toLowerCase().includes("כלב"),
  );
  const dogsCount = dogs.length;

  const getRandomPetImage = () => {
    if (pets.length === 0) return "https://placehold.co/600x400?text=טוען...";
    const randomPet = pets[Math.floor(Math.random() * pets.length)];
    return randomPet.pictureUrl;
  };

  const getRandomDogImage = () => {
    if (dogs.length === 0) return getRandomPetImage();
    const randomDog = dogs[Math.floor(Math.random() * dogs.length)];
    return randomDog.pictureUrl;
  };

  if (loading) return <div className={styles.loading}>טוען...</div>;

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
          <Link to="/catalog" className={styles.btn}>
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

          <Link to={`/Adoption-Form`} className={styles.btn}>
            לאימוץ
          </Link>
        </div>
      </div>
      <LastPets />
    </div>
  );
};

export default Home;
