import * as React from "react";
import { Pet } from "../../types";
import { useState, useEffect } from "react";
import PetCard from "../../components/PetCard/PetCard";
import styles from "./LastPets.module.scss";

export const LastPets: React.FC = () => {
  const [lastPets, setLastPets] = useState<Pet[]>([]);

  const loadPets = () => {
    const saved = localStorage.getItem("last_viewed_pets");
    if (saved) {
      try {
        setLastPets(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing storage", e);
      }
    }
  };

  useEffect(() => {
    loadPets();

    window.addEventListener("storage", loadPets);
    return () => window.removeEventListener("storage", loadPets);
  }, []);

  if (lastPets.length === 0) return null;
  return (
    <div className={styles.separatorLP}>
      <h1>חיות שנצפו לאחרונה</h1>
      <div className={styles.lastPetsList}>
        {lastPets.map((pet) => (
          <div key={pet.id} className={styles.cardWrapper}>
            <PetCard pet={pet} />
          </div>
        ))}
      </div>
    </div>
  );
};
